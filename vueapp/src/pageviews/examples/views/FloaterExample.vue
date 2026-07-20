<script setup>

    const floater1 = ref(true)
    const floater2 = ref(true)
    const floater3 = ref(true)

</script>

<template>

    <PageTitleBox pageTitle="Floater Control">
    
        <BooleanButton v-model="floater1" class="pr-2"
            text="Floater 1" trueIcon="heroicons-solid:check" falseIcon="heroicons-solid:x" /> 

        <BooleanButton v-model="floater2" 
            text="Floater 2" trueIcon="heroicons-solid:check" falseIcon="heroicons-solid:x" /> 

        <BooleanButton v-model="floater3" 
            text="Floater 3" trueIcon="heroicons-solid:check" falseIcon="heroicons-solid:x" /> 
            
    </PageTitleBox>

    <InfoBox>
        FloaterControl renders a draggable, floating panel. Drag it by its header to move it
        around the page, and click the X to close it. Position two floaters over each other and
        click one to bring it to the front.
    </InfoBox>

    <HelpBox>
        <div class="mb-3">
            Each floater's <b>name</b> prop doubles as a storage key, so its x/y position is saved to
            localStorage and restored the next time it's shown - even after a page refresh. The
            <b>initialX</b>/<b>initialY</b> props only set the starting position the very first time,
            before any position has been saved.
        </div>
        <div>
            The <b>showXY</b> prop displays the live coordinates in
            the header, handy while debugging placement. The <b>keepInView</b> prop (backed by the
            <code>useKeepInView</code> composable) watches the window size and position, and snaps the
            floater back on screen - leaving a small margin visible - if it's ever dragged fully past a
            viewport edge, so it can never get lost off-screen or behind the scrollbar.
        </div>
    </HelpBox>

    <FloaterControl v-model="floater1" keepInView
        name="Floater1" title="Floater1"
        :initialX="340" :initialY="375"
        class="bg-white w-[350px] h-[200px]">

        <div class="p-5 text-sm">
            This floater's position is saved to <b>localStorage</b>, so it reopens exactly where 
            you left it, even after refreshing the page. Right-click on the header to reset its position.
        </div>
    </FloaterControl>

    <FloaterControl v-model="floater2" 
        name="Floater2" title="Floater2" keepInView
        :initialX="340" :initialY="600" 
        class="bg-white w-[420px] h-[200px]">

        <div class="p-5 text-sm">
            Try dragging this panel fully off the edge of the window - <b>keepInView</b> will snap
            it back so part of it always stays visible, instead of leaving it lost off-screen.
        </div>

    </FloaterControl>
    
    <FloaterControl v-model="floater3" 
        name="Floater3" title="Floater3"
        :initialX="340" :initialY="825" showXY
        class="bg-white w-[300px] h-[200px]">

        <div class="p-5 text-sm">
            This floater has X/Y coordinates displayed in its header for easy reference while 
            positioning it on the page. It does not have the keepInView behavior.
        </div>

    </FloaterControl>
				
				
</template>