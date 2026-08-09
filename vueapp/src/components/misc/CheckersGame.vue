<script setup>

    const props = defineProps(
    {
        forceMoves:     { type: Boolean, default: true },
        resetSignal: 	{ type: Number, default: 0 },
		fullScreen: 	{ type: Boolean, default: false },
        squareSize:     { type: [Number, String], default: 56 },
    })

    const normalizedSquareSize = computed(() =>
    {
        const raw = props.squareSize
        if (raw === null || raw === undefined || raw === '') return '56px'
        if (typeof raw === 'number') return `${raw}px`

        const trimmed = String(raw).trim()
        if (!trimmed) return '56px'
        if (/^\d+(\.\d+)?$/.test(trimmed)) return `${trimmed}px`
        return trimmed
    })

    const squareStyle = computed(() =>
    ({
        width: normalizedSquareSize.value,
        height: normalizedSquareSize.value,
    }))

    const pieceStyle = computed(() =>
    ({
        width: `calc(${normalizedSquareSize.value} * 0.7142857)`,
        height: `calc(${normalizedSquareSize.value} * 0.7142857)`,
    }))

    const innerRingStyle = computed(() =>
    ({
        width: `calc(${normalizedSquareSize.value} * 0.4285714)`,
        height: `calc(${normalizedSquareSize.value} * 0.4285714)`,
    }))

    // Piece values: 'red' | 'black' | 'red-king' | 'black-king'
    const getColor = (piece) => piece.startsWith('red') ? 'red' : 'black'
    const isKing   = (piece) => piece.endsWith('-king')
    const isRed    = (title) => getColor(checkerPieces.value[title]) === 'red'
    const getPieceColorClasses = (piece) =>
        getColor(piece) === 'red'
            ? 'bg-red-500 border-red-800'
            : 'bg-gray-900 border-gray-600'

    // Board state — dark squares only ((row+col) % 2 === 0)
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

    const checkerPieces  = ref(buildInitialBoard())
    const draggedFrom    = ref(null)
    const currentTurn    = ref('red')   // red moves first
    const chainJumpPiece = ref(null)    // locked piece during a chain jump
    const winner         = ref(null)    // 'red' | 'black' | null

    // Returns { moves: Set, jumps: Set } for a given piece key against a given board snapshot
    function getMovesForPiece(key, board)
    {
        const piece = board[key]
        if (!piece) return { moves: new Set(), jumps: new Set() }

        const [row, col] = key.split('-').map(Number)
        const color = getColor(piece)
        const dirs  = isKing(piece)
            ? [[1,-1],[1,1],[-1,-1],[-1,1]]
            : color === 'red' ? [[1,-1],[1,1]] : [[-1,-1],[-1,1]]

        const moves = new Set()
        const jumps = new Set()

        for (const [dr, dc] of dirs)
        {
            const nr = row + dr, nc = col + dc
            if (nr < 0 || nr > 7 || nc < 0 || nc > 7) continue
            const stepKey = `${nr}-${nc}`

            if (!board[stepKey])
            {
                moves.add(stepKey)
            }
            else if (getColor(board[stepKey]) !== color)
            {
                const jr = row + 2 * dr, jc = col + 2 * dc
                if (jr >= 0 && jr <= 7 && jc >= 0 && jc <= 7)
                {
                    const jumpKey = `${jr}-${jc}`
                    if (!board[jumpKey]) jumps.add(jumpKey)
                }
            }
        }
        return { moves, jumps }
    }

    // True if any piece of the current turn can jump
    const hasAnyJump = computed(() =>
    {
        const board = checkerPieces.value
        return Object.keys(board)
            .filter(k => getColor(board[k]) === currentTurn.value)
            .some(k => getMovesForPiece(k, board).jumps.size > 0)
    })

    function canDrag(key)
    {
        if (winner.value) return false
        const piece = checkerPieces.value[key]
        if (!piece) return false
        if (chainJumpPiece.value) return key === chainJumpPiece.value
        return getColor(piece) === currentTurn.value
    }

    // Valid landing squares for the currently dragged piece
    const validMoves = computed(() =>
    {
        if (!draggedFrom.value) return new Set()
        const { moves, jumps } = getMovesForPiece(draggedFrom.value, checkerPieces.value)
        // Mandatory jumps: only jumps are valid when any jump exists for the current turn (if enforced)
        if (chainJumpPiece.value || (props.forceMoves && hasAnyJump.value)) return jumps
        return new Set([...moves, ...jumps])
    })

    function onDragStart(title)
    {
        if (!canDrag(title)) return
        draggedFrom.value = title
    }

    function onSquareTap(title)
    {
        if (winner.value) return

        if (draggedFrom.value && validMoves.value.has(title))
        {
            onDrop(title)
            return
        }

        if (canDrag(title))
        {
            draggedFrom.value = title
            return
        }

        if (!chainJumpPiece.value)
            draggedFrom.value = null
    }

    function onPieceTap(title, e)
    {
        e?.preventDefault?.()
        onSquareTap(title)
    }

    function onDrop(title)
    {
        if (!draggedFrom.value || !validMoves.value.has(title)) return

        const [fr, fc] = draggedFrom.value.split('-').map(Number)
        const [tr, tc] = title.split('-').map(Number)
        const isJump   = Math.abs(tr - fr) === 2

        const updated = { ...checkerPieces.value }
        let   piece   = updated[draggedFrom.value]

        // Remove jumped piece
        if (isJump)
        {
            const midKey = `${fr + (tr - fr) / 2}-${fc + (tc - fc) / 2}`
            delete updated[midKey]
        }

        // King promotion — a newly kinged piece ends the turn (cannot chain-jump)
        const justKinged =
            (getColor(piece) === 'red'   && tr === 7 && !isKing(piece)) ||
            (getColor(piece) === 'black' && tr === 0 && !isKing(piece))

        if (getColor(piece) === 'red'   && tr === 7) piece = 'red-king'
        if (getColor(piece) === 'black' && tr === 0) piece = 'black-king'

        updated[title] = piece
        delete updated[draggedFrom.value]
        checkerPieces.value = updated
        draggedFrom.value   = null

        // Chain jump: continue if this was a jump, piece not just kinged, and more jumps exist
        if (isJump && !justKinged)
        {
            const { jumps } = getMovesForPiece(title, updated)
            if (jumps.size > 0)
            {
                chainJumpPiece.value = title
                return
            }
        }

        chainJumpPiece.value = null

        // Win condition
        const vals     = Object.values(updated)
        const redCount = vals.filter(p => getColor(p) === 'red').length
        const blkCount = vals.filter(p => getColor(p) === 'black').length
        if (redCount === 0) { winner.value = 'black'; return }
        if (blkCount === 0) { winner.value = 'red';   return }

        currentTurn.value = currentTurn.value === 'red' ? 'black' : 'red'
    }

    function onDragEnd()
    {
        draggedFrom.value = null
    }

    function resetCheckers()
    {
        checkerPieces.value  = buildInitialBoard()
        draggedFrom.value    = null
        currentTurn.value    = 'red'
        chainJumpPiece.value = null
        winner.value         = null
    }

	watch(() => props.resetSignal, () =>
	{
		resetCheckers()
	})

</script>

<template>

    <div :class="['w-fit', { 'm-auto' : fullScreen }]">

        <!-- Status bar -->
        <div class="mb-3 h-6 text-sm font-semibold text-center">

            <span v-if="winner" :class="winner === 'red' ? 'text-red-600' : 'text-gray-800'">
                {{ winner === 'red' ? 'Red' : 'Black' }} wins! 🎉
            </span>
            <span v-else-if="chainJumpPiece" class="text-amber-600">
                Chain jump — keep jumping with the same piece!
            </span>
            <span v-else :class="currentTurn === 'red' ? 'text-red-600' : 'text-gray-700'">
                {{ currentTurn === 'red' ? 'Red' : 'Black' }}'s turn
                <span v-if="hasAnyJump && props.forceMoves" class="text-amber-600"> — must jump!</span>
            </span>

        </div>

        <GridControl :rows="8" :cols="8" class="border-4 border-gray-600">

            <template #default="{ title, isEvenCell }">

                <div :style="squareStyle"
                    :class="['flex items-center justify-center',
                    isEvenCell ? 'bg-gray-400' : 'bg-slate-200',
                    { 'ring-2 ring-inset ring-yellow-400 bg-yellow-100/40': validMoves.has(title) }]"
                    @click="onSquareTap(title)"
                    @dragover.prevent
                    @drop.prevent="onDrop(title)">

                    <span v-if="checkerPieces[title]"
                        :style="pieceStyle"
                        :draggable="canDrag(title)"
                        :class="['flex-center rounded-full shadow-md border-2 select-none',
                            canDrag(title) ? 'cursor-grab active:cursor-grabbing' : 'cursor-default opacity-70',
                            getPieceColorClasses(checkerPieces[title]),
                            draggedFrom === title ? 'opacity-30' : '']"
                        @click.stop="onPieceTap(title, $event)"
                        @touchstart.stop.prevent="onPieceTap(title, $event)"
                        @dragstart="onDragStart(title)" @dragend="onDragEnd">

                        <!-- King crown -->
                        <span v-if="isKing(checkerPieces[title])"
                            :class="[isRed(title) ? 'text-pink-200' : 'text-gray-300', 'text-2xl leading-none select-none']">
                            ♛
                        </span>
                        <!-- Regular piece inner ring -->
                        <span v-else
                            :style="innerRingStyle"
                            class="block border border-white/40 bg-white/10 rounded-full" />
                    </span>

                </div>
                
            </template>

        </GridControl>

    </div>

</template>

