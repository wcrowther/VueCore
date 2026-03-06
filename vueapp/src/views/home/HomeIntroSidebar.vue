<script setup>

    const appStore = useAppStore()

</script>

<template>

    <div class="w-full grow italic flex flex-col border-color-light-blue
        border bg-gradient-source sm:flex-row md:flex-col md:w-1/3 md:border-0" 
        id="HomeIntroSidebar">

        <div class="w-full p-5 pb-0 md:pb-5 sm:w-1/2 md:w-full">
            <div class="font-bold text-[#455393]">
            We will finalize the last .NET 9 release in January 2026, after which we will 
            shift our focus to the .NET 10 release, which will include features such as 
            Tailwind 4.1 support.</div>
        </div>

        <hr class="border-px border-[#b8d7ed] mx-5" />

        <div class="w-full p-5 pb-0 md:pb-5 sm:w-1/2 md:w-full">
            <div class="font-bold">Example website:</div>
            <a class="block font-bold link-underline text-blue break-words lg:break-normal"
                :href="appStore.vueCoreUrl" target="_blank" ref="noopener">
                {{ appStore.vueCoreUrl }}
            </a>
        </div>

        <div class="w-full p-5 pb-0 md:pb-5 md:pt-0 sm:w-1/2 md:w-full">
            <div class="font-bold">Customized Swagger:</div>
            <a class="block font-bold link-underline text-blue break-words lg:break-normal"
                :href="appStore.apiDocsUrl">
                VueCore API DotNet Documentation
            </a>
        </div>

        <div class="w-full p-5 md:pt-0 sm:w-1/2 md:w-full sm:text-right md:text-left">
            <div class="font-bold">VueCore Source: </div>
            <a class="block font-bold link-underline text-blue break-all lg:break-normal"
                :href="appStore.vueCoreSourceUrl" target="_blank">
                {{ appStore.vueCoreSourceUrl }}
            </a>
        </div>                
    </div>

</template>