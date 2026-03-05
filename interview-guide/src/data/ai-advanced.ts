import type { QAItem } from './backend'

export const aiAdvancedQA: QAItem[] = [
  {
    question: '什么是 ResNet？残差连接解决了什么问题？',
    tags: [{ text: '必问', type: 'must' }, { text: '高频', type: 'frequent' }],
    answer: `**ResNet（Residual Network）：**
微软 2015 年提出的深度残差网络，赢得 ImageNet 冠军

**核心思想：残差学习**
\`\`\`
传统：H(x) = F(x)
ResNet：H(x) = F(x) + x  （学习残差 F(x) = H(x) - x）
\`\`\`

**解决的问题：**
- 深层网络梯度消失/爆炸
- 退化问题（56层比20层训练误差还大）

**残差块结构：**
\`\`\`
输入 x → Conv → BN → ReLU → Conv → BN → (+ x) → ReLU → 输出
\`\`\`

**变种：**
- ResNet-18/34/50/101/152
- ResNeXt（引入分组卷积）
- Wide ResNet
- DenseNet（密集连接）`
  },
  {
    question: '什么是 LSTM？解决了 RNN 的什么问题？',
    tags: [{ text: '必问', type: 'must' }, { text: '高频', type: 'frequent' }],
    answer: `**LSTM（Long Short-Term Memory）：**
长短期记忆网络，解决 RNN 长序列梯度消失问题

**核心结构：三门一态**

1. **遗忘门（Forget Gate）：**
   \`\`\`f_t = σ(W_f · [h_{t-1}, x_t] + b_f)\`\`\`
   决定丢弃哪些信息

2. **输入门（Input Gate）：**
   \`\`\`i_t = σ(W_i · [h_{t-1}, x_t] + b_i)\`\`\`
   决定存储哪些新信息

3. **输出门（Output Gate）：**
   \`\`\`o_t = σ(W_o · [h_{t-1}, x_t] + b_o)\`\`\`
   决定输出哪些信息

4. **细胞状态（Cell State）：**
   \`\`\`C_t = f_t * C_{t-1} + i_t * tanh(W_c · [h_{t-1}, x_t] + b_c)\`\`\`

**GRU（简化版）：**
- 合并遗忘门和输入门为更新门
- 合并细胞状态和隐藏状态
- 参数更少，训练更快`
  },
  {
    question: '什么是 Batch Normalization 和 Layer Normalization？区别是什么？',
    tags: [{ text: '必问', type: 'must' }, { text: '高频', type: 'frequent' }],
    answer: `**Batch Normalization：**
- 对一个 batch 的同一通道做归一化
- 计算：μ_B, σ_B^2  across batch
- 适合 CNN

**Layer Normalization：**
- 对单个样本的所有特征做归一化
- 计算：μ, σ^2 across features
- 适合 RNN/Transformer

**对比：**
| 特性 | BatchNorm | LayerNorm |
|------|-----------|-----------|
| 归一化维度 | Batch | Feature |
| 依赖 batch size | 是 | 否 |
| 训练/测试 | 不同（running stats） | 相同 |
| 主要应用 | CNN | RNN/Transformer |

**其他归一化：**
- Instance Norm：单样本单通道（风格迁移）
- Group Norm：通道分组（目标检测）`
  },
  {
    question: '什么是 Transformer 的 Decoder？Masked Self-Attention 是什么？',
    tags: [{ text: '必问', type: 'must' }],
    answer: `**Decoder 结构：**

1. **Masked Multi-Head Self-Attention**
2. **Multi-Head Cross-Attention**（Encoder-Decoder Attention）
3. **Feed Forward Network**

**Masked Self-Attention：**
- 防止看到未来的 token
- 通过上三角掩码矩阵实现
- 位置 i 只能 attend to 位置 ≤ i

**Cross-Attention：**
- Q 来自 Decoder
- K, V 来自 Encoder
- 建立输入输出之间的关联

**训练 vs 推理：**
- 训练：并行处理，使用 mask
- 推理：自回归生成，每次生成一个 token`
  },
  {
    question: '什么是 GPT 的解码策略？Greedy、Beam Search、Sampling？',
    tags: [{ text: '高频', type: 'frequent' }],
    answer: `**Greedy Decoding：**
- 每步选择概率最高的 token
- 简单快速，但容易陷入局部最优

**Beam Search：**
- 维护 k 个最优序列（beam width）
- 每步扩展，保留 top-k
- 平衡质量和多样性

**Sampling 方法：**

1. **Temperature Sampling：**
   - 调整 softmax 温度
   - T→0：greedy；T→∞：均匀分布

2. **Top-k Sampling：**
   - 从概率最高的 k 个 token 中采样

3. **Top-p (Nucleus) Sampling：**
   - 从累积概率 ≥ p 的最小集合中采样
   - 动态调整候选集大小

4. **Repetition Penalty：**
   - 惩罚已生成的 token`
  },
  {
    question: '什么是 In-Context Learning？为什么大模型具备这种能力？',
    tags: [{ text: '热门', type: 'important' }],
    answer: `**In-Context Learning（上下文学习）：**
通过提示中的示例学习新任务，无需微调模型参数

**形式：**
\`\`\`
任务描述 + 示例1 + 示例2 + ... + 待预测输入
\`\`\`

**类型：**
- **Zero-shot：** 无示例，直接描述任务
- **One-shot：** 1个示例
- **Few-shot：** 多个示例（通常 4-8 个）

**可能原因：**
1. **预训练任务隐式包含：** 语言建模需要理解上下文关系
2. **注意力机制：** 能建立输入示例与预测位置的关联
3. **大规模数据：** 训练数据包含各种任务模式
4. **模型容量：** 足够大的参数量存储大量知识

**局限性：**
- 示例顺序敏感
- 示例选择影响大
- 复杂推理能力有限`
  },
  {
    question: '什么是 RLHF（人类反馈强化学习）？',
    tags: [{ text: '热门', type: 'important' }, { text: '高频', type: 'frequent' }],
    answer: `**RLHF 三阶段：**

**阶段1：预训练（Pretraining）**
- 大规模语料训练基础模型

**阶段2：奖励模型训练（Reward Model）**
- 同一提示的多个回答，人工排序
- 训练奖励模型预测人类偏好
- 损失函数：\`\`\`-log σ(r(x,y_w) - r(x,y_l))\`\`\`

**阶段3：强化学习优化（PPO）**
- 策略：语言模型生成回答
- 奖励：奖励模型打分 + KL 散度约束
- 防止模型偏离太远

**替代方法：**
- **DPO（Direct Preference Optimization）：**
  直接用偏好数据优化，无需显式奖励模型
- **RLAIF：** 用 AI 替代人类标注`
  },
  {
    question: '什么是模型蒸馏？如何用大模型教小模型？',
    tags: [{ text: '高频', type: 'frequent' }],
    answer: `**知识蒸馏（Knowledge Distillation）：**
让小模型（Student）学习大模型（Teacher）的行为

**软标签（Soft Targets）：**
- Teacher 的输出概率分布（logits/T）
- 比 one-hot 标签包含更多信息
- 温度 T 平滑概率分布

**蒸馏损失：**
\`\`\`
L = α * L_hard（学生 vs 真实标签）
  + (1-α) * L_soft（学生 vs 教师软标签）
\`\`\`

**进阶方法：**
- **中间层蒸馏：** 学习隐藏层表示
- **注意力蒸馏：** 学习注意力权重
- **数据增强：** 用教师模型生成伪标签

**应用：**
- DistilBERT（BERT 的 60% 大小，97% 性能）
- TinyBERT、MobileBERT`
  },
  {
    question: '什么是多模态大模型？CLIP 和 GPT-4V 的原理？',
    tags: [{ text: '热门', type: 'important' }],
    answer: `**多模态：**
融合文本、图像、音频、视频等多种模态

**CLIP（Contrastive Language-Image Pre-training）：**
- 对比学习，对齐图像和文本表示
- 双塔结构：Image Encoder + Text Encoder
- 训练目标：配对样本相似度最大化

**GPT-4V / Gemini：**
- 视觉编码器（ViT）提取图像特征
- 与文本 token 一起输入 Transformer
- 统一生成文本输出

**Flamingo / BLIP-2：**
- 冻结预训练视觉和语言模型
- 轻量级桥接网络（Perceiver/Q-Former）

**应用场景：**
- 图像描述、视觉问答
- 图文检索
- 多模态对话`
  },
  {
    question: '什么是 Agent？ReAct、Reflexion 是什么？',
    tags: [{ text: '热门', type: 'important' }],
    answer: `**AI Agent：**
能感知环境、做出决策、执行动作的智能体

**ReAct（Reasoning + Acting）：**
\`\`\`
Thought → Action → Observation → Thought → ...
\`\`\`
- 交替进行推理和行动
- 使用工具（搜索、计算器、API）

**Reflexion：**
- 自我反思机制
- 评估行动结果
- 从失败中学习

**关键组件：**
1. **规划（Planning）：** 分解任务、制定策略
2. **记忆（Memory）：** 短期（上下文）+ 长期（向量数据库）
3. **工具使用（Tool Use）：** 调用外部 API
4. **行动（Action）：** 执行具体操作

**框架：**
- LangChain、AutoGPT、BabyAGI
- 微软 Semantic Kernel`
  },
]

export const cvQA: QAItem[] = [
  {
    question: '什么是卷积？卷积核的作用是什么？',
    tags: [{ text: '基础', type: 'frequent' }],
    answer: `**卷积操作：**
滑动窗口在输入上做点积，提取局部特征

**卷积核（Filter）：**
- 可学习的参数矩阵
- 每个核检测一种特征模式

**常见卷积核：**
- 边缘检测核
- 模糊核
- 锐化核

**超参数：**
- Kernel size：3×3, 5×5
- Stride：步长，控制下采样
- Padding：填充，控制输出尺寸
- Dilation：空洞卷积，扩大感受野`
  },
  {
    question: '什么是感受野？如何计算？',
    tags: [{ text: '重要', type: 'important' }],
    answer: `**感受野（Receptive Field）：**
输出特征图上的一个点对应输入图像的区域大小

**计算方式：**
\`\`\`
RF_l = RF_{l-1} + (k_l - 1) × stride_{l-1}
\`\`\`

**增大感受野的方法：**
- 堆叠更多卷积层
- 使用大卷积核（5×5, 7×7）
- 空洞卷积（Dilated Convolution）
- 池化操作

**感受野与性能：**
- 感受野越大，捕获全局信息能力越强
- 但过大可能导致细节丢失`
  },
  {
    question: '什么是数据增强？常用方法有哪些？',
    tags: [{ text: '高频', type: 'frequent' }],
    answer: `**数据增强：**
通过对训练数据进行变换，增加数据多样性

**几何变换：**
- 翻转（Flip）
- 旋转（Rotation）
- 缩放（Scale）
- 裁剪（Crop）
- 平移（Translation）

**颜色变换：**
- 亮度、对比度调整
- 色调、饱和度调整
- 灰度化

**高级增强：**
- Mixup：图像和标签线性插值
- CutMix：裁剪拼接
- AutoAugment：学习最优增强策略
- RandAugment：随机选择增强操作`
  },
]
