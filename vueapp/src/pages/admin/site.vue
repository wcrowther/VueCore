// eslint-disable-next-line vue/multi-word-component-names
<script setup>

    const pageTitle     = ref('Site Map')
    const appStore      = useAppStore()
    const currentUrl    = import.meta.url
    const baseUrl       = import.meta.env.BASE_URL
    const baseApiUrl    = import.meta.env.VITE_API_URL
    const route         = useRoute();
    const baseApiUrl2   = appStore.baseApiUrl

</script>

<template>

    <div class="relative" id="adminSite">

        <div class="z-0 bg-gradient-main h-[500px] absolute top-0 left-0 right-0"></div>

        <div class="p-5 pt-5 pb-14 sm:p-10 sm:pt-5">

            <div class="flex justify-between items-center mb-7 relative z-20">
                <h2 class="text-2xl font-display font-bold flex-grow">{{ pageTitle }}</h2>
            </div>
            
            <div class="flex flex-wrap gap-y-5 mb-5 relative">

                <div class="w-1/2">
                    <span class="font-bold">Mode: </span>
                    {{ appStore.mode }}
                </div>

                <div class="w-1/2">
                    <span class="font-bold">Route: </span>
                    {{ route.path }}
                </div>

                <div class="w-1/2">
                    <span class="font-bold">BaseUrl:</span>
                    {{ baseUrl }}
                </div>

                <div class="w-1/2">
                    <span class="font-bold">Base API Url:</span>
                    {{ baseApiUrl }}
                </div>

                <div class="w-1/2">
                    <span class="font-bold">Base API Url from AppStore:</span>
                    {{ baseApiUrl2 }}
                </div>

                <div class="w-1/2">
                    <span class="font-bold">Page / Component Name:</span>
                    {{ getCurrentInstance().type.__name  }}
                </div>  

                <div class="w-full">
                    <span class="font-bold">import.meta.url:</span>
                    {{ currentUrl }}
                </div>  

            </div>

            <SiteMap class="z-50 relative p-5 border border-color-primary" />

        </div>

    </div>  

</template>