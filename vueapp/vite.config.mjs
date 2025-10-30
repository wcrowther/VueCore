
import { fileURLToPath, URL }   from 'node:url'
// import { resolve }           from 'path';
import { defineConfig }         from 'vite'
import mkcert                   from 'vite-plugin-mkcert'
import Vue                      from '@vitejs/plugin-vue'
import Markdown 				from 'unplugin-vue-markdown/vite'
import VueRouter                from 'unplugin-vue-router/vite'
import AutoImport               from 'unplugin-auto-import/vite'
import Components               from 'unplugin-vue-components/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'

export default defineConfig({
    plugins: 
    [
        AutoImport({
            dts: 'src/auto-imports.d.ts',
            vueTemplate: true,
            dirs: ['./src/helpers', './src/models', 
                    './src/stores', './src/composables'],
            imports: [
                'vue',
                VueRouterAutoImports,
                { 
                    '@vueuse/core': 
                    [
                        'useClipboard',
                        'useDebounceFn',
                        'useLocalStorage',
                        'useWindowSize',
                        ['useDraggable' , 'Draggable']
                    ],
                    'pinia': 
                    [
                        'storeToRefs',
                        'defineStore'
                    ],
                    '@vuelidate/core': 
                    [
                        'useVuelidate'
                    ]
                }	
            ],	
            eslintrc: {
                enabled: true
            }
        }),
        VueRouter({
            dts: 'src/typed-router.d.ts'
        }),        
        Vue({
            include: [/\.vue$/, /\.md$/], // <-- allows Vue to compile Markdown files
        }),
        Markdown({ /* options */ }),
        mkcert(),
        Components({
            dirs: ['./src/components', './src/layouts', './src/views'],
            dts: 'src/components.d.ts'
        }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    server: {
        proxy: {
            '^/weatherforecast': {
                target: 'https://localhost:7199/', 
                secure: false
            }
        },
        port: 7200,
        open: true  // open the browser after compiling
    },
    build: {
        sourcemap: true,
    }
})
