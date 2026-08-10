<script setup>

    const fullScreen = ref(false)

</script>

<template>

    <div ref="parentBox" class="w-full">

    	<PageTitleBox pageTitle="Conway's Life" />

		<InfoBox>
			<p>
				A fully playable Conway's Life game built on <b>GridControl</b>'s scoped slot. Click cells to toggle their state —
				live cells are highlighted. The game evolves according to Conway's rules.
			</p>
			<p class="mt-2">
                Conway's Game of Life was devised by British mathematician John Horton Conway in 1970 and
                published in Martin Gardner's <em>Mathematical Games</em> column in <em>Scientific American</em>.
                Despite having only four rules, it is Turing-complete and capable of simulating universal computation.
                Entire CPUs, memory systems, and self-replicating patterns have been constructed inside its infinite grid.
            </p>
            <p class="mt-2">
                Each cell is either <strong>alive</strong> (black) or <strong>dead</strong> (white).
                On every generation the rules are applied simultaneously: a live cell survives with 2 or 3 live
                neighbours; a dead cell becomes alive with exactly 3 live neighbours; all other cells die or remain dead.
            </p>
            <p class="mt-2">
                <strong>Using this board:</strong> Click or drag on the grid to paint live cells, then press
                <strong>▶ Play</strong> to start. Toggle <strong>Wrap edges</strong> to make the board
                toroidal — cells leaving one edge re-enter on the opposite side. Use <strong>💾 Save</strong>
                to persist the board to local storage between sessions, and <strong>✕ Clear</strong> to reset.
            </p>
        </InfoBox>

        <HelpBox>
            <p><strong>Implementation</strong></p>
            <p class="mt-1">
                The board is stored as two flat <code>Uint8Array</code> buffers — current and next generation —
                and swapped on every tick. Only cells that change state are touched in the DOM via
                <code>document.getElementById</code>, bypassing Vue reactivity entirely for cell state.
                Mouse paint events use a single delegated listener on the grid wrapper rather than per-cell
                handlers, keeping the initial render lightweight at 10,000 cells.
            </p>
            <p class="mt-2"><strong>Extending with alternate algorithms</strong></p>
            <p class="mt-1">
                The <code>algorithm</code> prop accepts any function with the signature
                <code>(current, next, rows, cols, wrapEdges) =&gt; void</code>.
                Add additional rule sets to <code>src/helpers/lifeAlgorithms.js</code> and pass them in
                to swap rule sets at runtime — for example <em>Day &amp; Night</em>, <em>HighLife</em>,
                or <em>Seeds</em> each follow the same interface.
            </p>
            <p class="mt-2"><strong>Canvas vs DOM for larger grids</strong></p>
            <p class="mt-1">
                At 100×100 the DOM grid is practical, but for larger boards — 300×300 is 90,000 cells —
                a <code>&lt;canvas&gt;</code> element would be significantly faster. A canvas approach draws
                alive cells as filled rectangles each tick, skipping Vue's reconciler and per-element class
                toggling entirely. It can sustain higher frame rates with less CPU and is the standard choice
                for production Life implementations at any size above roughly 150×150.
            </p>
        </HelpBox>

		<ConwaysLifeGame :fullScreen cellClass="bg-indigo" />

    </div>

</template>

