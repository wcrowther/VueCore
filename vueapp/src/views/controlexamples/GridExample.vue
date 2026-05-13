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
        { name: 'Grid Size 12x12', rows: 12, cols: 12 },
        { name: 'Grid Size 20x10', rows: 20, cols: 20 },
    ]

    // Checkers board state — dark squares only ((row+col) % 2 === 0)
    const buildInitialBoard = () =>
    {
        const map = {}
        for (let row = 0; row < 8; row++)
            for (let col = 0; col < 8; col++)
                if ((row + col) % 2 === 0)
                {
                    if (row < 3)      map[`${row}-${col}`] = 'red'
                    else if (row > 4) map[`${row}-${col}`] = 'black'
                }
        return map
    }

    const checkerPieces = ref(buildInitialBoard())
    const draggedFrom   = ref(null)

    // Compute valid landing squares for the piece being dragged
    const validMoves = computed(() =>
    {
        if (!draggedFrom.value) return new Set()

        const [row, col] = draggedFrom.value.split('-').map(Number)
        const pieceColor = checkerPieces.value[draggedFrom.value]
        const dirs       = pieceColor === 'red' ? [[1, -1], [1, 1]] : [[-1, -1], [-1, 1]]
        const moves      = new Set()

        for (const [dr, dc] of dirs)
        {
            const nr = row + dr
            const nc = col + dc
            if (nr < 0 || nr > 7 || nc < 0 || nc > 7) continue

            const stepKey = `${nr}-${nc}`

            if (!checkerPieces.value[stepKey])
            {
                // Empty square — normal move
                moves.add(stepKey)
            }
            else if (checkerPieces.value[stepKey] !== pieceColor)
            {
                // Opponent — check jump landing
                const jr = row + 2 * dr
                const jc = col + 2 * dc
                if (jr >= 0 && jr <= 7 && jc >= 0 && jc <= 7)
                {
                    const jumpKey = `${jr}-${jc}`
                    if (!checkerPieces.value[jumpKey]) moves.add(jumpKey)
                }
            }
        }
        return moves
    })

    function onDragStart(title)
    {
        draggedFrom.value = title
    }

    function onDrop(title)
    {
        if (!validMoves.value.has(title)) return

        const [fr, fc] = draggedFrom.value.split('-').map(Number)
        const [tr, tc] = title.split('-').map(Number)

        const updated = { ...checkerPieces.value }

        // Remove jumped piece if this was a jump
        if (Math.abs(tr - fr) === 2)
        {
            const midKey = `${fr + (tr - fr) / 2}-${fc + (tc - fc) / 2}`
            delete updated[midKey]
        }

        updated[title] = updated[draggedFrom.value]
        delete updated[draggedFrom.value]
        checkerPieces.value = updated
        draggedFrom.value   = null
    }

    function onDragEnd()
    {
        draggedFrom.value = null
    }

    function resetCheckers()
    {
        checkerPieces.value = buildInitialBoard()
        draggedFrom.value   = null
    }

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

            <div class="flex items-center gap-4 mb-3">
                <div class="text-lg font-bold">Checkers Board (8×8)</div>
                <button class="text-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded" @click="resetCheckers">Reset</button>
            </div>
            <div class="mb-5 text-sm text-gray-600">
                Drag a piece to move it. Valid landing squares highlight in yellow. Jumps over opponents are supported.
            </div>

            <GridControl :rows="8" :cols="8">

                <template #default="{ title }">

                    <div class="size-10 flex items-center justify-center"
                        :class="{ 'ring-2 ring-inset ring-yellow-400 bg-yellow-100/40': validMoves.has(title) }"
                        @dragover.prevent
                        @drop.prevent="onDrop(title)">

                        <span v-if="checkerPieces[title]"
                            :class="['flex-center rounded-full size-8 shadow-md border-2 cursor-grab active:cursor-grabbing',
                            checkerPieces[title] === 'red'
                                ? 'bg-red-500 border-red-800'
                                : 'bg-gray-900 border-gray-600',
                            draggedFrom === title ? 'opacity-40' : 'opacity-100']" 
                            @dragstart="onDragStart(title)" @dragend="onDragEnd"
                            draggable="true">
                            <span class="flex border border-white/60 bg-white/20 size-5 rounded-full">&nbsp;</span>
                        </span> 
                    </div>
                </template>

            </GridControl>

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

    <!-- Resize Grid -->
    <div class="basis-full mt-10 mb-10">

        <ListIndexButton v-model="gridIndex" :rangeList="gridSizes" class="w-fit p-3 mb-3" />

        <!-- GRID CONTROL -->
        <GridControl :rows="gridSizes[gridIndex].rows" :cols="gridSizes[gridIndex].cols" />

    </div>

</template>