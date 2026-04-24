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

		<BackGradation />

        <div class="p-5 pt-5 pb-14 sm:p-10 sm:pt-5">

            <div class="flex justify-between items-center mb-7 relative z-20">
                <h2 class="text-2xl font-display font-bold flex-grow">{{ pageTitle }}</h2>
            </div>

            <InfoBox class="mb-5 relative z-20">
                The <b>Site Map</b> below is dynamically generated at runtime by reading the structure from the pages folder.
            </InfoBox>

            <HelpBox class="mb-5 relative z-20">
                Internally, the SiteMap component calls <code>router.getRoutes()</code> to retrieve all registered routes,
                filters out parameterized paths (e.g. <code>/accounts/:id</code>) that represent dynamic detail views,
                then sorts the remaining routes alphabetically. Each link is indented based on its depth in the URL 
                hierarchy — top-level routes are flush left, while nested routes are indented proportionally.
                Because it reads directly from the router, any new page added to the <code>/pages</code> folder 
                will automatically appear here without any changes to this component.
            </HelpBox>

            <SiteMap class="z-50 relative p-5 mb-7 border border-color-primary" />
         
            <div class="flex flex-wrap gap-y-5 relative">

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

        </div>

    </div>  

</template>