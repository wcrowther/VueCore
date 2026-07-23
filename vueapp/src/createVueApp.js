
import { createPinia }          from 'pinia'
import router                   from './router/router'
import Toast                    from "vue-toastification"
import { createHead }           from '@unhead/vue/client'
import tooltipPlugin            from '@/helpers/toolTipPlugin'
import './styles/toaster.css'  
import './styles/tailwind.css'

import App from './App.vue'

const pinia = createPinia()
pinia.use(({ store }) => 
{
    store.router = markRaw(router)
})

const head = createHead()

async function bootstrap()
{
    const app = createApp(App)
        .use(pinia)
        .use(router)
        .use(head)
        .use(Toast,
        {
            transition: 'Vue-Toastification__fade',
            maxToasts: 10,
            newestOnTop: true
        })
        .use(tooltipPlugin)


    const authStore = useAuthStore(pinia)
    authStore.startInactivityTracking()
    await authStore.fetchCurrentUser()

    app.mount('#app')
}

bootstrap()

// 'toaster.css' is from from node_modules:
// 'vue-toastification/dist/index.css'

// -----------------------------------------------------
// No longer used directive
// Global Directive: v-tooltip (uses element title)
// -----------------------------------------------------
// import { tooltipDirective } from '@/helpers/toolTipDirective'
// .directive('tooltip', tooltipDirective)  // applied to createApp() above
// -----------------------------------------------------
