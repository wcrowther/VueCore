<script setup>

    import { usePlatform } from '@/composables/UsePlatform'

    const platform = usePlatform()
    const props = defineProps(
    {
        show:  { type: Boolean, default: true }
    })

</script>

<template>

    <FloaterControl :show name="PlatformInfo" 
        class="w-[200px] pb-3 mb-1 drop-shadow-xl text-sm/loose leading-[25px] bg-white border"> 

        <div class="p-3 font-mono">
            <div><strong>Platform:</strong> {{ platform.platform }}</div>
            <div><strong>Browser:</strong> {{ platform.browser }}</div>
            <div><strong>Device:</strong> {{ platform.deviceType }}</div>
            <div><strong>Touch:</strong> {{ platform.hasTouch }}</div>

            <hr />

            <div>isMobile: {{ platform.isMobile }}</div>
            <div>isTablet: {{ platform.isTablet }}</div>
            <div>isDesktop: {{ platform.isDesktop }}</div>

            <hr />

            <div>Chrome: {{ platform.isChrome }}</div>
            <div>Firefox: {{ platform.isFirefox }}</div>
            <div>Safari: {{ platform.isSafari }}</div>
            <div>Edge: {{ platform.isEdge }}</div>
        </div>

    </FloaterControl>

</template>
