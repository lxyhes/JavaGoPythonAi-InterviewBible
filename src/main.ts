import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import { useI18nStore } from './stores/i18n'
import Antd from 'ant-design-vue'

import './assets/styles/main.css'
import 'ant-design-vue/dist/reset.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(Antd)

// Initialize i18n locale
const i18nStore = useI18nStore(pinia)
i18nStore.initLocale()

app.mount('#app')
