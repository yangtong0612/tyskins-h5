import { createApp } from 'vue'
import App from './App.vue'
import dayjs from 'dayjs'
import './assets/js/common.js'
import {setupStore} from '@/store'
import vuetify from './plugins/vuetify'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import 'element-plus/dist/index.css'
// import { loadFonts } from './plugins/webfontloader'
import { router } from './router'
import './assets/css/common.scss'
import 'animate.css';
import VueLuckyCanvas from '@lucky-canvas/vue'

import { websocketClient } from "./libs";


// import VConsole from 'vconsole';
// const vConsole = new VConsole();

websocketClient.connect();
const app = createApp(App)

app.config.globalProperties.BASE_URL = import.meta.env.VITE_BASE_URL
app.config.globalProperties.OSS_URL = import.meta.env.VITE_OSS_URL

app.config.globalProperties.$dayjs = dayjs
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(VueLuckyCanvas)
setupStore(app)
app.use(router)
app.use(vuetify)
app.use(ElementPlus,{
  locale: zhCn,
})
// loadFonts()

app.mount('#app')
