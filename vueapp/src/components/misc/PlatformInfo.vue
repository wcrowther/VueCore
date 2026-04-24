<script setup>

    import { usePlatform } from '@/composables/UsePlatform'

    const appStore              = useAppStore()
    const { showPlatformInfo }  = storeToRefs(appStore) 

    const platform = usePlatform()

</script>

<template>

    <FloaterControl :show="showPlatformInfo" name="PlatformInfo" 
        class="w-[200px] pb-3 mb-1 drop-shadow-xl text-sm/loose 
        leading-[25px] bg-white border"> 

        <div class="p-2 bg-color-blue text-white font-bold select-none flex 
            justify-between items-center">
            Platform Info
            <div class="size-4 bg-white hover:bg-color-light-blue rounded-full flex-center" 
				@click="showPlatformInfo=false">
				<IconSymbol width="12px" class="text-color-dark-gray" icon="heroicons-solid:x" />
			</div>
        </div>

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
