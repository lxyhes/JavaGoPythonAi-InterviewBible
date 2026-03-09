import * as fs from 'fs'
import * as path from 'path'
import type { QuestionSubmission, QaItem } from '../src/types'

interface ImportResult {
  success: number
  failed: number
  skipped: number
  errors: string[]
}

interface ImportOptions {
  dryRun?: boolean
  skipDuplicates?: boolean
  defaultStatus?: 'pending' | 'approved'
}

export class QuestionImporter {
  private existingQuestions: Set<string> = new Set()
  private result: ImportResult = {
    success: 0,
    failed: 0,
    skipped: 0,
    errors: [],
  }

  constructor(private dataDir: string = path.join(__dirname, '../src/data')) {
    this.loadExistingQuestions()
  }

  private loadExistingQuestions(): void {
    try {
      const files = fs.readdirSync(this.dataDir)
      for (const file of files) {
        if (file.endsWith('.ts')) {
          const content = fs.readFileSync(path.join(this.dataDir, file), 'utf-8')
          const matches = content.match(/question:\s*['"`]([^'"`]+)['"`]/g)
          if (matches) {
            for (const match of matches) {
              const question = match.replace(/question:\s*['"`]/, '').replace(/['"`]$/, '')
              this.existingQuestions.add(this.normalizeQuestion(question))
            }
          }
        }
      }
    } catch (error) {
      console.warn('Warning: Could not load existing questions:', error)
    }
  }

  private normalizeQuestion(question: string): string {
    return question.toLowerCase().replace(/\s+/g, ' ').trim()
  }

  private isDuplicate(question: string): boolean {
    return this.existingQuestions.has(this.normalizeQuestion(question))
  }

  private validateSubmission(submission: Partial<QuestionSubmission>): string[] {
    const errors: string[] = []

    if (!submission.category || submission.category.trim() === '') {
      errors.push('Category is required')
    }

    if (!submission.sectionId || submission.sectionId.trim() === '') {
      errors.push('Section ID is required')
    }

    if (!submission.question || submission.question.trim().length < 5) {
      errors.push('Question must be at least 5 characters')
    }

    if (!submission.answer || submission.answer.trim().length < 10) {
      errors.push('Answer must be at least 10 characters')
    }

    const validCategories = ['frontend', 'backend', 'database', 'algorithm', 'system-design', 'devops', 'network', 'os', 'ai']
    if (submission.category && !validCategories.includes(submission.category)) {
      errors.push(`Invalid category. Must be one of: ${validCategories.join(', ')}`)
    }

    return errors
  }

  private convertToQaItem(submission: QuestionSubmission, options: ImportOptions): QaItem {
    return {
      question: submission.question.trim(),
      answer: submission.answer.trim(),
      tags: submission.tags || [],
      source: submission.source || 'imported',
      hotScore: 0,
      status: options.defaultStatus || 'pending',
      submittedAt: new Date().toISOString(),
    }
  }

  importFromJSON(filePath: string, options: ImportOptions = {}): ImportResult {
    this.result = { success: 0, failed: 0, skipped: 0, errors: [] }

    try {
      const content = fs.readFileSync(filePath, 'utf-8')
      const data = JSON.parse(content)

      const submissions = Array.isArray(data) ? data : [data]

      for (const submission of submissions) {
        this.processSubmission(submission, options)
      }
    } catch (error) {
      this.result.errors.push(`Failed to read JSON file: ${error}`)
      this.result.failed++
    }

    return this.result
  }

  importFromCSV(filePath: string, options: ImportOptions = {}): ImportResult {
    this.result = { success: 0, failed: 0, skipped: 0, errors: [] }

    try {
      const content = fs.readFileSync(filePath, 'utf-8')
      const lines = content.split('\n').filter((line) => line.trim())

      if (lines.length < 2) {
        this.result.errors.push('CSV file must have header and at least one data row')
        return this.result
      }

      const headers = lines[0].split(',').map((h) => h.trim())

      for (let i = 1; i < lines.length; i++) {
        const values = this.parseCSVLine(lines[i])
        const submission: Partial<QuestionSubmission> = {}

        headers.forEach((header, index) => {
          const value = values[index]?.trim() || ''
          switch (header.toLowerCase()) {
            case 'category':
              submission.category = value
              break
            case 'sectionid':
            case 'section_id':
              submission.sectionId = value
              break
            case 'question':
              submission.question = value
              break
            case 'answer':
              submission.answer = value
              break
            case 'tags':
              submission.tags = value.split(';').filter((t) => t.trim())
              break
            case 'source':
              submission.source = value
              break
          }
        })

        this.processSubmission(submission, options)
      }
    } catch (error) {
      this.result.errors.push(`Failed to read CSV file: ${error}`)
      this.result.failed++
    }

    return this.result
  }

  private parseCSVLine(line: string): string[] {
    const values: string[] = []
    let current = ''
    let inQuotes = false

    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        values.push(current)
        current = ''
      } else {
        current += char
      }
    }
    values.push(current)

    return values
  }

  private processSubmission(submission: Partial<QuestionSubmission>, options: ImportOptions): void {
    const errors = this.validateSubmission(submission)

    if (errors.length > 0) {
      this.result.errors.push(`Validation failed: ${errors.join(', ')}`)
      this.result.failed++
      return
    }

    const fullSubmission = submission as QuestionSubmission

    if (options.skipDuplicates !== false && this.isDuplicate(fullSubmission.question)) {
      this.result.skipped++
      return
    }

    if (!options.dryRun) {
      const qaItem = this.convertToQaItem(fullSubmission, options)
      this.saveQuestion(fullSubmission.category, fullSubmission.sectionId, qaItem)
    }

    this.result.success++
    this.existingQuestions.add(this.normalizeQuestion(fullSubmission.question))
  }

  private saveQuestion(category: string, sectionId: string, item: QaItem): void {
    const outputDir = path.join(this.dataDir, 'imported')
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    const fileName = `${category}-${sectionId}.ts`
    const filePath = path.join(outputDir, fileName)

    let existingData: QaItem[] = []
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8')
      const match = content.match(/export const \w+:\s*QaItem\[\]\s*=\s*(\[[\s\S]*\])/)
      if (match) {
        try {
          existingData = eval(match[1])
        } catch {
          existingData = []
        }
      }
    }

    existingData.push(item)

    const varName = `${category.replace(/-/g, '')}${sectionId.replace(/-/g, '')}QA`
    const fileContent = `import type { QaItem } from '@/types'

export const ${varName}: QaItem[] = ${JSON.stringify(existingData, null, 2)}
`

    fs.writeFileSync(filePath, fileContent)
  }

  generateImportTemplate(): string {
    const template = [
      {
        category: 'backend',
        sectionId: 'java-basics',
        question: '示例问题：Java 中 == 和 equals() 的区别？',
        answer: '示例答案：== 比较内存地址，equals 比较内容值...',
        tags: ['must', 'frequent'],
        source: 'https://example.com/interview',
      },
    ]

    return JSON.stringify(template, null, 2)
  }
}

if (require.main === module) {
  const importer = new QuestionImporter()

  const args = process.argv.slice(2)
  const command = args[0]

  switch (command) {
    case 'template':
      console.log(importer.generateImportTemplate())
      break

    case 'import-json':
      if (!args[1]) {
        console.error('Usage: ts-node import-questions.ts import-json <file-path> [--dry-run]')
        process.exit(1)
      }
      const jsonResult = importer.importFromJSON(args[1], {
        dryRun: args.includes('--dry-run'),
        skipDuplicates: true,
        defaultStatus: 'pending',
      })
      console.log('Import Result:', jsonResult)
      break

    case 'import-csv':
      if (!args[1]) {
        console.error('Usage: ts-node import-questions.ts import-csv <file-path> [--dry-run]')
        process.exit(1)
      }
      const csvResult = importer.importFromCSV(args[1], {
        dryRun: args.includes('--dry-run'),
        skipDuplicates: true,
        defaultStatus: 'pending',
      })
      console.log('Import Result:', csvResult)
      break

    default:
      console.log(`
Usage: ts-node import-questions.ts <command> [options]

Commands:
  template              Generate a JSON import template
  import-json <path>    Import questions from JSON file
  import-csv <path>     Import questions from CSV file

Options:
  --dry-run            Preview import without saving

Examples:
  ts-node import-questions.ts template
  ts-node import-questions.ts import-json ./questions.json --dry-run
  ts-node import-questions.ts import-csv ./questions.csv
`)
  }
}
