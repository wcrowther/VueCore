<script setup>

    // RESIZABLE GRID EXAMPLE
    const gridIndex = ref(2)
    const gridSizes =
    [
        { name: 'Grid Size 4x4',   rows: 4, cols: 4 },
        { name: 'Grid Size 6x6',   rows: 6, cols: 6 }, 
        { name: 'Grid Size 8x8',   rows: 8, cols: 8 }, 
        { name: 'Grid Size 10x10', rows: 10, cols: 10 },
        { name: 'Grid Size 12x12', rows: 12, cols: 12 },
        { name: 'Grid Size 10x20', rows: 10, cols: 20 },
        { name: 'Grid Size 25x25', rows: 25, cols: 25 },
    ]


</script>

<template>

    <div class="flex flex-wrap gap-x-8">

        <div class="text-lg font-bold mb-5 basis-full flex-none">
            GridControl Examples
        </div>

        <InfoBox class="mb-7 basis-full flex-none">
            This page demonstrates <b>GridControl</b> — a configurable checkered grid that exposes a scoped slot
            for each cell. The <b>Checkers Board</b> shows how the slot can power a fully interactive game with
            drag-and-drop, king promotion, and turn enforcement. The <b>ListIndexButton</b> example shows a
            lightweight prev/next navigator used throughout this page to switch options. The <b>Resizable Grid</b>
            at the bottom demonstrates raw GridControl rendering at various row/column sizes.
        </InfoBox> 
        
        <CheckersExample class="lg:flex-1 mb-5" />

        <ListIndexButtonExample class="lg:flex-1" />

    </div>

    <!-- Resize Grid -->
    <div class="basis-full mt-10 mb-10">

        <div class="text-lg font-bold mb-5">Resizable Grid</div>

		<InfoBox class="mb-7">
			<b>GridControl</b> renders a reactive checkered grid driven by <b>:rows</b> and <b>:cols</b> props.
			Use the button to cycle through preset sizes and watch the grid re-render instantly.
		</InfoBox>

        <ListIndexButton v-model="gridIndex" :rangeList="gridSizes" 
            class="mb-8 text-center w-[180px] !text-gray-500 !text-base h-7 !bg-gray-200 hover:!bg-gray-300" />


        <!-- GRID CONTROL -->
        <GridControl :rows="gridSizes[gridIndex].rows" :cols="gridSizes[gridIndex].cols" />

    </div>

</template>