<script setup>

    const showPlatformInfo = ref(true)
    const showFloaterOne = ref(true)

</script>

<template>

    <PageTitleBox pageTitle="Floater Control" />

    <InfoBox>
        Info about floater controls.
    </InfoBox>

    <FloaterControl :show="showFloaterOne" name="FloaterOne" 
        class="bg-white w-[400px] h-[300px]">

        <div class="p-2 bg-color-blue text-white font-bold select-none flex 
            justify-between items-center">
            Platform Info
            <div class="size-4 bg-white hover:bg-color-light-blue rounded-full flex-center" 
				@click="showFloaterOne=false">
				<IconSymbol width="12px" class="text-color-dark-gray" icon="heroicons-solid:x" />
			</div>
        </div>

        <div class="p-5">
            Some floating content here.
        </div>
    </FloaterControl>
				
</template>