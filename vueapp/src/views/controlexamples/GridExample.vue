<script setup>

    const listIndex     = ref(0)
    const animal        = ref(0)
    const color         = ref(0)
    const webPageIndex  = ref(0)
    const gridIndex     = ref(2)
    const rangeList     = ['0','1','2','3','4','5','6','7','8','9']
    const animalList    = ['Cats','Dogs','Tigers','Bears','Lions']
    const colors        = ['Red','Yellow','Blue','Green','Orange']
    const webPages = 
    [
        { name: 'Cnn',      url: 'https://www.cnn.com'},
        { name: 'Time',     url: 'https://www.time.com'},
        { name: 'UsaToday', url: 'https://www.usatoday.com'},
    ]
    const gridSizes =
    [
        { name: 'Grid Size 4x4',   rows: 4, cols: 4 },
        { name: 'Grid Size 6x6',   rows: 6, cols: 6 }, 
        { name: 'Grid Size 8x8',   rows: 8, cols: 8 }, 
        { name: 'Grid Size 10x10', rows: 10, cols: 10 },
    ]

    // Checkers: dark squares where (row+col) % 2 === 0
    // Red pieces on rows 0-2, black pieces on rows 5-7
    const checkerPieces = computed(() =>
    {
        const map = {}
        for (let row = 0; row < 8; row++)
        {
            for (let col = 0; col < 8; col++)
            {
                if ((row + col) % 2 === 0)
                {
                    if (row < 3)      map[`${row}-${col}`] = 'red'
                    else if (row > 4) map[`${row}-${col}`] = 'black'
                }
            }
        }
        return map
    })

</script>

<template>

    <div class="flex flex-wrap">

        <div class="text-lg font-bold mb-5 basis-full flex-none">
            GridControl Example
        </div>

        <div class="mb-7 basis-full flex-none">
            The <b>GridControl</b> renders a configurable grid of selectable cells. Use the 
            <b>ListIndexButton</b> above to switch between preset grid sizes (4×4 up to 10×10) 
            and observe how the grid re-renders reactively.
        </div>
        
        <div class="lg:w-1/2 mb-5">

            <ListIndexButton v-model="gridIndex" :rangeList="gridSizes" class="w-fit p-3 mb-3" />

            <!-- GRID CONTROL -->
            <GridControl :rows="gridSizes[gridIndex].rows" :cols="gridSizes[gridIndex].cols" />

        </div>


        <div class="w-full lg:w-1/2 p-5 mb-5 flex flex-wrap gap-1 bg-blue-100 border-b-2">
            <div class="basis-full font-bold mb-5">
                List Index Button
            </div>
            <div class="mb-5 basis-full flex-none">
                The <b>ListIndexButton</b> is a lightweight prev/next navigator for stepping through any array. 
                It binds to a zero-based index via <code>v-model</code> and accepts any array as <code>:rangeList</code>. 
                By default it displays the item's <code>name</code> property, but you can override this with the 
                <code>textName</code> prop. Set <code>:wrapBack="false"</code> to prevent cycling past the first or last item.
            </div>
            <div class="basis-full mb-5">
                <ListIndexButton v-model="listIndex" :rangeList class="w-fit mb-2" />
                List Index ({{ listIndex }}) - zero-based : {{ rangeList[listIndex] }}
            </div>
            <div class="basis-full mb-5">
                <ListIndexButton v-model="animal" :rangeList="animalList" class="w-fit mb-2" />
                Animal Ordinal - 1-based ({{ animal+1 }}): {{ animalList[animal] }}
            </div>
            <div class="basis-full mb-5">
                <ListIndexButton v-model="color" :rangeList="colors" :wrapBack="false" class="w-fit mb-2" />
                Color ({{ color+1 }}) - does not wrap: {{ colors[color] }}
            </div>
            <div class="basis-full flex flex-wrap gap-2">
                <ListIndexButton v-model="webPageIndex" :rangeList="webPages" 
                    class="w-fit mb-2 inline-block"/>
                <ListIndexButton v-model="webPageIndex" :rangeList="webPages" textName="url" 
                    class="w-fit mb-2 inline-block" />
                <div class="basis-full flex-none">
                    Web Pages ({{ webPageIndex }}) : {{ webPages[webPageIndex].url }}
                </div>
            </div>
        </div>

    </div>

    <!-- CHECKERS BOARD -->
    <div class="basis-full mt-10 mb-10">

        <div class="text-lg font-bold mb-3">Checkers Board (8×8)</div>
        <div class="mb-5 text-sm text-gray-600">
            Static checkers layout using <b>GridControl</b>'s scoped slot. Red pieces occupy the top three rows,
            black pieces the bottom three — all on dark squares only.
        </div>

        <GridControl :rows="8" :cols="8">
            <template #default="{ title }">
                <div class="size-10 flex items-center justify-center">
                    <span v-if="checkerPieces[title]"
                        :class="['block rounded-full size-6 shadow-md border-2 border-white/30',
                            checkerPieces[title] === 'red' ? 'bg-red-600' : 'bg-gray-900']" />
                </div>
            </template>
        </GridControl>

    </div>


</template>