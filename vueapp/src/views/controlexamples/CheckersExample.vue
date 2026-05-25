<script setup>

	import { useElementSize } from '@vueuse/core'

    const fullScreen = ref(false)
    const forceMoves = ref(false)

	const resetSignal 		= ref(0)
	const resetCheckers 	= () => resetSignal.value++

    const parentBox 	= useTemplateRef('parentBox')
	const { width } 	= useElementSize(parentBox)
	const compact 		= computed( () => Math.trunc(width.value) <= 450 )
	const squareSize 	= computed(() =>
	{
		if (!fullScreen.value)
			return compact.value ? 40 : 56

		const boardWidth = Math.min(Math.trunc(width.value) || 0, 1000)
		return boardWidth > 0 ? Math.floor(boardWidth / 8) : 56
	})
    
</script>

<template>

    <div ref="parentBox" class="w-full">

		<div class="text-lg w-fit font-bold mb-5 relative">
			Checkers Board 
			<div class="absolute rotate-[10deg] -top-1 right-[-3.3rem] w-fit 
				font-bold text-xs bg-orange px-2 text-white tracking-widest">
				NEW
			</div>
			<div class="font-normal text-sm">ParentBox width: {{ `${Math.trunc(width)}px` }}</div>
		</div>

		<InfoBox class="mb-7">
			A fully playable checkers game built on <b>GridControl</b>'s scoped slot. Drag a piece to move it —
			valid squares highlight in yellow. Turns alternate between red and black, pieces reaching the back
			row become kings (♛) and can move in all directions, and chain jumps are enforced automatically.
			Toggle <b>Force Moves</b> to require mandatory jumps when available.
		</InfoBox>

		<div class="w-fit m-auto flex items-center gap-3 mb-5">

			<button class="text-base px-4 h-7 rounded-full font-bold text-gray-500 bg-gray-200 hover:bg-gray-300"
				@click="forceMoves=!forceMoves" title="Force Moves On/Off">

				<span v-if="compact">{{ forceMoves ? 'FMoves: On' : 'FMoves: Off' }}</span>
				<span v-else>{{ forceMoves ? 'Force Moves: On' : 'Force Moves: Off' }}</span>
			</button>

			<button class="text-base px-4 h-7 rounded-full font-bold text-gray-500 bg-gray-200 hover:bg-gray-300"
				@click="fullScreen=!fullScreen" title="Full Screen On/Off">

				<span v-if="compact">{{ fullScreen ? 'FScreen;On' : 'FScreen: Off' }}</span>
				<span v-else>{{ fullScreen ? 'Full Screen: On' : 'Full Screen: Off' }}</span>
			</button>

			<button class="text-base px-4 h-7 rounded-full font-bold text-gray-500 bg-gray-200 hover:bg-gray-300"
				@click="resetCheckers">
				Reset
			</button>

		</div>

		<FullScreenControl v-model:fullScreen="fullScreen" class="px-0 py-10 xs:p-10">
			<CheckersGame :forceMoves :resetSignal :fullScreen :squareSize class="m-auto" />
        </FullScreenControl>
    </div>

</template>

<!-- Usage:

	<CheckersGame :forceMandatory :resetSignal :fullScreen /> 
-->
