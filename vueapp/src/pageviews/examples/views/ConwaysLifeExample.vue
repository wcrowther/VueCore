<script setup>

    const fullScreen = ref(false)
    const generation = ref(0)

</script>

<template>

    <div ref="parentBox" class="w-full">

    	<PageTitleBox pageTitle="Conway's Life">
            <div class="mt-2 text-sm text-gray-500">Generation: {{ generation }}</div>
        </PageTitleBox> 

		<InfoBox>
			<p>
				A fully playable Conway's Life game built on <b>GridControl</b>'s scoped slot. Click cells to toggle their state —
				live cells are highlighted. The game evolves according to Conway's rules.
			</p>
			<p class="mt-2">
                <b>Conway's Game of Life</b> was devised by British mathematician John Horton Conway in 1970 and
                published in Martin Gardner's <em>Mathematical Games</em> column in <em>Scientific American</em>.
                Despite having only four rules, it is Turing-complete and capable of simulating universal computation.
                Entire CPUs, memory systems, and self-replicating patterns have been constructed inside its infinite grid.
            </p>
            <p class="mt-2">
                <strong>Rules:</strong>
            </p>
            <p class="mt-2">
                Each cell is either <strong>alive</strong> (black) or <strong>dead</strong> (white) 
                and are applied simultaneously every generation.
            </p>
            <ol class="list-decimal list-inside">
                <li>A live cell survives with 2 or 3 live neighbours.</li>
                <li>A dead cell becomes alive with exactly 3 live neighbours.</li>
                <li>All other cells die or remain dead.</li>
            </ol>
            <p class="mt-2 italic">
                Experiment with other rule sets using the dropdown and observe how different rules
                affect the evolution of the board!
            </p>

        </InfoBox>

        <HelpBox>
            <p><strong>Using this board:</strong></p>
            <p class="mt-1">
                Click or drag on the grid to paint live cells, then press
                <strong>▶ Play</strong> to start. Toggle <strong>Wrap edges</strong> to make the board
                toroidal — cells leaving one edge re-enter on the opposite side. Right-click a cell to add a
                <b>Glider</b>, <b>Lightweight Spaceship</b>, <b>R-pentomino</b>,
                or <b>Gosper Glider Gun</b> with its anchor at that cell. Use <strong>💾 Save</strong>
                to persist the board to local storage between sessions, and <strong>✕ Clear</strong> to reset.
            </p>
            <p class="mt-2"><strong>Implementation</strong></p>
            <p class="mt-1">
                The board is stored as two flat <code>Uint8Array</code> buffers — current and next generation —
                and swapped on every tick. Only cells that change state are touched in the DOM via
                <code>document.getElementById</code>, bypassing Vue reactivity entirely for cell state.
                Mouse paint and context-menu events use delegated listeners on the grid wrapper rather than
                per-cell handlers, keeping the initial render lightweight at 10,000 cells.
            </p>
            <p class="mt-2"><strong>Adding patterns</strong></p>
            <p class="mt-1">
                Pattern coordinates and placement logic are defined in <code>src/helpers/lifePatterns.js</code>.
                Right-click placement writes the selected pattern directly into the board buffer and updates
                only the affected cell elements. Patterns wrap around the edges when <strong>Wrap edges</strong>
                is enabled; otherwise cells outside the board are skipped. The last used pattern is remembered 
                using local storage for quick placement with <b>Ctrl+click</b>.
            </p>
            <p class="mt-2"><strong>Use alternate algorithms</strong></p>
            <p class="mt-1">
                Use the algorithm dropdown to switch between Conway's Life, HighLife, Replicator, Seeds,
                Morley, Day &amp; Night, Maze, Diamoeba, Amoeba, and Stains while the board is paused or running.
                Each rule set follows the same function signature:
                <code>(current, next, rows, cols, wrapEdges) =&gt; void</code>.
                Additional rule sets can be added to <code>src/helpers/lifeAlgorithms.js</code> and included in
                the dropdown.
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

        <ConwaysLifeGame v-model:generation="generation" 
            :fullScreen cellClass="bg-indigo" class="m-auto" />

    </div>

</template>

