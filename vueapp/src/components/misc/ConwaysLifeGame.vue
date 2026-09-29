<script setup>

    import { runAlgorithm, ruleOptions }                from '@/helpers/lifeAlgorithms.js'
    import { lifePatterns, addPattern as applyPattern } from '@/helpers/lifePatterns.js'

    const props = defineProps(
    {
        fullScreen: { type: Boolean, default: false },
        rows:       { type: Number,  default: 100 },
        cols:       { type: Number,  default: 100 },
        speed:      { type: Number,  default: 150 },
        cellSize:   { type: String,  default: 'size-2' },
        cellClass:  { type: String,  default: 'bg-black' },
    })

    const generation        = defineModel('generation', { type: Number, default: 0 })
    const isPaused          = ref(true)
    const wrapEdges         = ref(true)
    const selectedRuleLabel = ref(ruleOptions[0].label)
    const cellBack          = computed(() => props.cellClass)

    // SelectInput needs a key->label map; the rule object (with .fn) is looked up from the chosen label
    const ruleOptionsMap = computed(() => Object.fromEntries(ruleOptions.map((r) => [r.label, r.label])))
    const selectedRule   = computed(() => ruleOptions.find((r) => r.label === selectedRuleLabel.value) ?? ruleOptions[0])
    const menuRef       = useTemplateRef('patternMenu')

    const { createConfirm } = useConfirmControl()

    // Key includes dimensions so differently-sized boards don't share a slot; {} default forces VueUse to use JSON serializer instead of String()
    const savedBoard      = useLocalStorage(`conways-life-board-${props.rows}x${props.cols}`, {})
    const lastPatternName = useLocalStorage('conways-life-last-pattern', '')

    // Non-reactive: double-buffered flat board and loop handle
    let current    = null
    let next       = null
    let intervalId = null
    let isPainting = false
    let eraseMode  = false  // drag follows the state set on initial mousedown

    const addPattern = (name, { row, col }, quarterTurns = 0) =>
    {
        if (!current) return

        const cells = applyPattern(current, name, row, col, props.rows, props.cols, wrapEdges.value, quarterTurns)
        cells.forEach(([targetRow, targetCol]) =>
        {
            const el = document.getElementById(`${targetRow}-${targetCol}`)
            if (el) el.classList.add(cellBack.value)
        })

        lastPatternName.value = name
    }

    const patternMenuItems = computed(() => Object.keys(lifePatterns).map((name) =>
    ({
        label: `Add ${name}${name === lastPatternName.value ? ' *' : ''}`,
        action: (context) => addPattern(name, context),
    })))

    const renderDiff = (prev, curr) =>
    {
        const cols  = props.cols
        const total = props.rows * cols
        for (let i = 0; i < total; i++) 
        {
            if (prev[i] !== curr[i]) 
            {
                const el = document.getElementById(`${(i / cols) | 0}-${i % cols}`)
                if (el) el.classList.toggle(cellBack.value, curr[i] === 1)
            }
        }
    }

    const tick = () =>
    {
        runAlgorithm(current, next, props.rows, props.cols, wrapEdges.value, selectedRule.value.fn)
        renderDiff(current, next)
        ;[current, next] = [next, current]
        generation.value++
    }

    const startLoop = () =>
    {
        if (intervalId !== null) return
        intervalId = setInterval(tick, props.speed)
    }

    const stopLoop = () =>
    {
        if (intervalId === null) return
        clearInterval(intervalId)
        intervalId = null
    }

    // Returns [rowIndex, colIndex] from a mouse event using GridControl's id="r-c" wrapper divs
    const getCellFromEvent = (e) =>
    {
        const el = e.target.id ? e.target : e.target.parentElement
        if (!el?.id) return null
        const parts = el.id.split('-')
        if (parts.length !== 2) return null
        return [parts[0] | 0, parts[1] | 0]
    }

    const paintCell = (r, c, alive) =>
    {
        const idx = r * props.cols + c
        if (current[idx] === (alive ? 1 : 0)) return
        current[idx] = alive ? 1 : 0
        const el = document.getElementById(`${r}-${c}`)
        if (el) el.classList.toggle(cellBack.value, alive)
    }

    const onGridMouseDown = (e) =>
    {
        if (e.button !== 0) return
        const cell = getCellFromEvent(e)
        if (!cell) return

        if (e.ctrlKey || e.shiftKey)
        {
            const patternName = lastPatternName.value || Object.keys(lifePatterns)[0]
            addPattern(patternName, { row: cell[0], col: cell[1] }, e.shiftKey ? 1 : 0)
            return
        }

        eraseMode  = current[cell[0] * props.cols + cell[1]] === 1
        isPainting = true
        paintCell(cell[0], cell[1], !eraseMode)
    }

    const onGridContextMenu = (e) =>
    {
        const cell = getCellFromEvent(e)
        if (cell) menuRef.value.open(e, { row: cell[0], col: cell[1] })
    }

    const onGridMouseMove = (e) =>
    {
        if (!isPainting) return
        const cell = getCellFromEvent(e)
        if (cell) paintCell(cell[0], cell[1], !eraseMode)
    }

    const onDocMouseUp = () =>
    {
        isPainting = false
    }

    const clearBoard = async () =>
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
        for (let i = 0; i < total; i++) 
        {
            const el = document.getElementById(`${(i / cols) | 0}-${i % cols}`)
            if (el) el.classList.remove(cellBack.value)
        }
    }

    const saveBoard = async () =>
    {
        isPaused.value = true

        savedBoard.value = 
        {
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

        if (savedBoard.value?.board?.length === props.rows * props.cols) 
        {
            current.set(savedBoard.value.board)
            generation.value = savedBoard.value.generation ?? 0
            wrapEdges.value  = savedBoard.value.wrapEdges  ?? false
            const cols  = props.cols
            const total = props.rows * cols
            for (let i = 0; i < total; i++) 
            {
                if (current[i] === 1) 
                {
                    const el = document.getElementById(`${(i / cols) | 0}-${i % cols}`)
                    if (el) el.classList.add(cellBack.value)
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
            <SelectInput labelName="" hideLabel v-model="selectedRuleLabel" :optionsList="ruleOptionsMap" 
                class="!mb-0 w-32 ml-auto" />
        </div>

        <div class="cursor-crosshair select-none"
            @mousedown.prevent="onGridMouseDown" @mousemove="onGridMouseMove" 
            @contextmenu="onGridContextMenu" @dragstart.prevent>

            <GridControl :rows="props.rows" :cols="props.cols" 
                class="border-r border-b border-gray-300">

                <template #default>
                    <div :class="[props.cellSize, 'border-l border-t border-gray-300']" />
                </template>

            </GridControl>
        </div>

        <ContextMenu ref="patternMenu" :items="patternMenuItems" />

    </div>

</template>

