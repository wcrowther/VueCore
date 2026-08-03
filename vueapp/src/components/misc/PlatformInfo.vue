<script setup>

    import { usePlatform } from '@/composables/UsePlatform'

    const appStore              = useAppStore()
    const { showPlatformInfo }  = storeToRefs(appStore) 

    const platform = usePlatform()

</script>

<template>

    <FloaterControl v-model="showPlatformInfo" name="PlatformInfo" title="Platform Info"
        class="w-[200px] pb-3 mb-1 drop-shadow-xl text-sm/loose 
        leading-[25px] bg-white border"> 

        <div class="p-3">
            <div><b>Platform:</b> {{ platform.platform }}</div>
            <div><b>Browser:</b> {{ platform.browser }}</div>
            <div><b>Device:</b> {{ platform.deviceType }}</div>
            <div><b>Touch:</b> {{ platform.hasTouch }}</div>
        </div>

        <hr class="border-2 border-gray-300"/>

        <div class="p-3">
            <div><b>isMobile:</b> {{ platform.isMobile }}</div>
            <div><b>isTablet:</b> {{ platform.isTablet }}</div>
            <div><b>isDesktop:</b> {{ platform.isDesktop }}</div>
        </div>

        <hr class="border-2 border-gray-300"/>

        <div class="p-3">
            <div><b>Chrome:</b> {{ platform.isChrome }}</div>
            <div><b>Firefox:</b> {{ platform.isFirefox }}</div>
            <div><b>Safari:</b> {{ platform.isSafari }}</div>
            <div><b>Edge:</b> {{ platform.isEdge }}</div>
        </div>

    </FloaterControl>

</template>
