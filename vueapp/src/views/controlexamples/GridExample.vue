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
            GridControl Example
        </div>

        <div class="mb-7 basis-full flex-none">
            The <b>GridControl</b> renders a configurable grid of selectable cells. Use the 
            <b>ListIndexButton</b> above to switch between preset grid sizes (4×4 up to 10×10) 
            and observe how the grid re-renders reactively.
        </div>
        
        <CheckersExample class="lg:flex-1 mb-5" />

        <ListIndexButtonExample class="lg:flex-1" />

    </div>

    <!-- Resize Grid -->
    <div class="basis-full mt-10 mb-10">

        <div class="text-lg font-bold mb-5">Resizable Grid</div>

		<InfoBox class="mb-7">
			A fully playable checkers game built on <b>GridControl</b>'s scoped slot. Drag a piece to move it —
			valid squares highlight in yellow. Turns alternate between red and black, pieces reaching the back
			row become kings (♛) and can move in all directions, and chain jumps are enforced automatically.
			Toggle <b>Force Moves</b> to require mandatory jumps when available.
		</InfoBox>

        <ListIndexButton v-model="gridIndex" :rangeList="gridSizes" 
            class="mb-8 text-center w-[180px] !text-gray-500 !text-base h-7 !bg-gray-200 hover:!bg-gray-300" />


        <!-- GRID CONTROL -->
        <GridControl :rows="gridSizes[gridIndex].rows" :cols="gridSizes[gridIndex].cols" />

    </div>

</template>