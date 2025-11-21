
import { createPinia }          from 'pinia'
import router                   from './router/router'
import Toast                    from "vue-toastification"
import { createHead }           from '@unhead/vue/client'
import './styles/toaster.css'  
import './styles/tailwind.css'

import App from './App.vue'

const pinia = createPinia()
pinia.use(({ store }) => 
{
    store.router = markRaw(router)
})

const head = createHead()

createApp(App)
    .use(pinia)
    .use(router)
    .use(head)
    .use(Toast, 
        {   transition: "Vue-Toastification__fade",
            maxToasts: 10,
            newestOnTop: true
        })
    .mount('#app')

        // 'toaster.css' is from from node_modules:
        // 'vue-toastification/dist/index.css'