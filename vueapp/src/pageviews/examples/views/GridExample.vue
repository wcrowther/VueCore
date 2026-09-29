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

    <div class="basis-full overflow-auto scrollbar-thin">

        <PageTitleBox pageTitle="Resizable Grid Examples" />

		<InfoBox>
            <b>GridControl</b> renders a reactive grid driven by <b>:rows</b> and <b>:cols</b> props.
            Use the button to cycle through preset sizes, then use the scoped slot to customize each cell (including checkerboard patterns).
		</InfoBox>

        <ListButton v-model:index="gridIndex" :rangeList="gridSizes" 
            class="mb-8 text-center w-[180px] !text-gray-500 !text-base h-7 !bg-gray-200 hover:!bg-gray-300" />

        <!-- GRID CONTROL -->

        <GridControl class="mb-10 border-4 border-gray-600" 
            :rows="gridSizes[gridIndex].rows" :cols="gridSizes[gridIndex].cols"
            v-slot="{ isEvenCell }">

            <div :class="[ 'size-10 aspect-square',
                isEvenCell ? 'bg-gray-400' : 'bg-slate-200' ]">
            </div>

        </GridControl>

	    <GridControl :rows="30" :cols="50" v-slot="{ isEvenCell }"
            class="border-r border-b border-blue mb-10">

	    	<div :class="[ 'size-[10px] border-t border-l border-blue aspect-square',
	    		isEvenCell ? 'bg-white' : 'bg-white' ]" >
	    	</div>

	    </GridControl>

        <GridControl :rows="10" :cols="20" v-slot="{ isEvenCell }"
            class="border-r border-b border-red">

	    	<div :class="[ 'size-[25px] border-t border-l border-red aspect-square',
	    		isEvenCell ? 'bg-white' : 'bg-white' ]" >
	    	</div>
            
	    </GridControl>


    </div>

</template>