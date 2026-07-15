<script setup>

    const fullScreen = ref(false)
    const inset      = ref(0)
    const insetList  = 
    [ 
        { name: 'Inset None', inset: 0 },
		{ name: 'Inset 24',   inset: 24 },
        { name: 'Inset 48',   inset: 48 },
    ]

</script>

<template>

    <div class="w-full flex justify-between items-center mb-4">

        <div class="text-lg font-bold mb-5">
            FullScreen Control
        </div>

        <span class="flex flex-wrap gap-1.5">

            <ListIndexButton v-model="inset" :rangeList="insetList" 
                class="!rounded-md !text-sm !text-[#121639] !py-0 !pt-[4px] !pb-[3px] 
                !h-auto !leading-normal !tracking-wide hover:!bg-white hover:!border-color-primary 
                !border !border-transparent" />

            <PrimaryButton @click="fullScreen=!fullScreen">
                FullScreen
            </PrimaryButton>

        </span>
    </div>

	<InfoBox>
		<b>FullScreenControl</b> wraps any content and expands it to fill the viewport via a
		<b>v-model:fullScreen</b> boolean. An <b>:inset</b> prop (number, string, or object)
		offsets the panel from the screen edges. An exit button is shown by default and
		<b>Esc</b> also closes it. Scroll is locked while fullscreen is active.
	</InfoBox>

    <FullScreenControl v-model:fullScreen="fullScreen" 
        :inset="insetList[inset].inset" class="flex justify-center">
        <img src="/images/super_string_theory.jpg" class="aspect-auto"
            :style="fullScreen ? {} : { maxWidth: '400px' }" />
    </FullScreenControl>

</template>