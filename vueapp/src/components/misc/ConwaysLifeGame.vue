<script>

// Pluggable algorithm signature: (current, next, rows, cols, wrapEdges) => void
function conwayAlgorithm(current, next, rows, cols, wrapEdges) 
{
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            let n = 0
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    if (dr === 0 && dc === 0) continue
                    let nr, nc
                    if (wrapEdges) {
                        nr = (r + dr + rows) % rows
                        nc = (c + dc + cols) % cols
                    } else {
                        nr = r + dr
                        nc = c + dc
                        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue
                    }
                    n += current[nr * cols + nc]
                }
            }
            const idx = r * cols + c
            next[idx] = n === 3 || (n === 2 && current[idx]) ? 1 : 0
        }
    }
}
</script>

<script setup>

    const props = defineProps(
    {
        fullScreen: { type: Boolean,  default: false },
        rows:       { type: Number,   default: 100 },
        cols:       { type: Number,   default: 100 },
        speed:      { type: Number,   default: 150 },
        cellSize:   { type: String,   default: 'size-2' },
        algorithm:  { type: Function, default: conwayAlgorithm },
    })

    const generation = ref(0)
    const isPaused   = ref(true)
    const wrapEdges  = ref(true)

    const { createConfirm } = useConfirmControl()

    // Key includes dimensions so differently-sized boards don't share a slot; {} default forces VueUse to use JSON serializer instead of String()
    const savedBoard = useLocalStorage(`conways-life-board-${props.rows}x${props.cols}`, {})

    // Non-reactive: double-buffered flat board and loop handle
    let current    = null
    let next       = null
    let intervalId = null
    let isPainting = false

    function renderDiff(prev, curr) 
    {
        const cols  = props.cols
        const total = props.rows * cols
        for (let i = 0; i < total; i++) {
            if (prev[i] !== curr[i]) {
                const el = document.getElementById(`${(i / cols) | 0}-${i % cols}`)
                if (el) el.classList.toggle('bg-black', curr[i] === 1)
            }
        }
    }

    function tick() 
    {
        props.algorithm(current, next, props.rows, props.cols, wrapEdges.value)
        renderDiff(current, next)
        ;[current, next] = [next, current]
        generation.value++
    }

    function startLoop() 
    {
        if (intervalId !== null) return
        intervalId = setInterval(tick, props.speed)
    }

    function stopLoop() 
    {
        if (intervalId === null) return
        clearInterval(intervalId)
        intervalId = null
    }

    // Returns [rowIndex, colIndex] from a mouse event using GridControl's id="r-c" wrapper divs
    function getCellFromEvent(e) 
    {
        const el = e.target.id ? e.target : e.target.parentElement
        if (!el?.id) return null
        const parts = el.id.split('-')
        if (parts.length !== 2) return null
        return [parts[0] | 0, parts[1] | 0]
    }

    function paintCell(r, c) 
    {
        const idx = r * props.cols + c
        if (current[idx] === 1) return
        current[idx] = 1
        const el = document.getElementById(`${r}-${c}`)
        if (el) el.classList.add('bg-black')
    }

    function onGridMouseDown(e) 
    {
        isPainting = true
        const cell = getCellFromEvent(e)
        if (cell) paintCell(cell[0], cell[1])
    }

    function onGridMouseMove(e) 
    {
        if (!isPainting) return
        const cell = getCellFromEvent(e)
        if (cell) paintCell(cell[0], cell[1])
    }

    function onDocMouseUp() 
    {
        isPainting = false
    }

    async function clearBoard() 
    {
        const confirmed = await createConfirm('Are you sure you want to reset the board? You will lose all changes.')
        if (!confirmed) return

        stopLoop()
        isPaused.value = true
        current.fill(0)
        next.fill(0)
        generation.value = 0
        const cols  = props.cols
        const total = props.rows * cols
        for (let i = 0; i < total; i++) {
            const el = document.getElementById(`${(i / cols) | 0}-${i % cols}`)
            if (el) el.classList.remove('bg-black')
        }
    }

    async function saveBoard()
    {
        isPaused.value = true

        savedBoard.value = {
            board:      Array.from(current),
            generation: generation.value,
            wrapEdges:  wrapEdges.value,
        }

        const continueGenerating = await createConfirm('Saving board state. Continue generations?')
        if (continueGenerating) isPaused.value = false
    }

    watch(isPaused, (paused) => 
    {
        if (paused) stopLoop()
        else startLoop()
    })

    onMounted(() => 
    {
        current = new Uint8Array(props.rows * props.cols)
        next    = new Uint8Array(props.rows * props.cols)
        document.addEventListener('mouseup', onDocMouseUp)

        if (savedBoard.value?.board?.length === props.rows * props.cols) {
            current.set(savedBoard.value.board)
            generation.value = savedBoard.value.generation ?? 0
            wrapEdges.value  = savedBoard.value.wrapEdges  ?? false
            const cols  = props.cols
            const total = props.rows * cols
            for (let i = 0; i < total; i++) {
                if (current[i] === 1) {
                    const el = document.getElementById(`${(i / cols) | 0}-${i % cols}`)
                    if (el) el.classList.add('bg-black')
                }
            }
        }
    })

    onUnmounted(() => 
    {
        stopLoop()
        document.removeEventListener('mouseup', onDocMouseUp)
    })

</script>

<template>

    <div :class="['w-fit', { 'm-auto': props.fullScreen }]">

        <div class="flex items-center gap-3 mb-5 px-1 select-none">
            <button
                @click="isPaused = !isPaused"
                class="px-2 py-0.5 text-xs rounded border border-gray-400 hover:bg-gray-100"
            >{{ isPaused ? '▶ Play' : '⏸ Pause' }}</button>
            <button
                @click="clearBoard"
                class="px-2 py-0.5 text-xs rounded border border-gray-400 hover:bg-gray-100"
            >✕ Clear</button>
            <button
                @click="saveBoard"
                class="px-2 py-0.5 text-xs rounded border border-gray-400 hover:bg-gray-100"
            >💾 Save</button>
            <label class="flex items-center gap-1 text-xs cursor-pointer">
                <input type="checkbox" v-model="wrapEdges" class="cursor-pointer" />
                Wrap edges
            </label>
            <span class="ml-auto text-xs text-gray-500 tabular-nums">Gen {{ generation }}</span>
        </div>

        <div class="cursor-crosshair select-none"
            @mousedown.prevent="onGridMouseDown"
            @mousemove="onGridMouseMove" @dragstart.prevent>

            <GridControl :rows="props.rows" :cols="props.cols" 
                :class="['border-r border-b border-gray-300', { 'm-auto' : props.fullScreen }]">
                <template #default>
                    <div :class="[props.cellSize, 'border-l border-t border-gray-300']"></div>
                </template>
            </GridControl>
        </div>

    </div>

</template>

