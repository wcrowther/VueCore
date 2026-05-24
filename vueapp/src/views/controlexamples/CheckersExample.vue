<script setup>

    const fullScreen = ref(false)
	const forceMandatoryIndex = ref(0)
	const forceMandatoryList = [
		{ name: 'Force Moves: On', value: true },
		{ name: 'Force Moves: Off', value: false },
	]
	const forceMandatory = computed(() => forceMandatoryList[forceMandatoryIndex.value].value)
	const resetSignal = ref(0)

	function resetCheckers()
	{
		resetSignal.value++
	}
    
</script>

<template>

    <div class="w-full">


		<div class="text-lg w-fit font-bold mb-5 relative">
			Checkers Board
			<div class="absolute rotate-[10deg] -top-1 right-[-3.3rem] w-fit 
				font-bold text-xs bg-orange px-2 text-white tracking-widest">
				NEW
			</div>
		</div>

		<InfoBox class="mb-7">
			A fully playable checkers game built on <b>GridControl</b>'s scoped slot. Drag a piece to move it —
			valid squares highlight in yellow. Turns alternate between red and black, pieces reaching the back
			row become kings (♛) and can move in all directions, and chain jumps are enforced automatically.
			Toggle <b>Force Moves</b> to require mandatory jumps when available.
		</InfoBox>

		<div class="flex items-center gap-3 mb-5">

			<ListIndexButton v-model="forceMandatoryIndex" :rangeList="forceMandatoryList"
				class="w-[180px] !text-gray-500 !text-base h-7 !bg-gray-200 hover:!bg-gray-300" />

			<button class="text-base px-4 h-7 rounded-full font-bold text-gray-500 bg-gray-200 hover:bg-gray-300"
				@click="fullScreen=!fullScreen">
				{{ fullScreen ? 'Full Screen: On' : 'Full Screen: Off' }}
			</button>

			<button class="text-base px-4 h-7 rounded-full font-bold text-gray-500 bg-gray-200 hover:bg-gray-300"
				@click="resetCheckers">
				Reset
			</button>

		</div>

		<FullScreenControl v-model:fullScreen="fullScreen" class="p-10">
			<CheckersGame :forceMandatory :resetSignal :fullScreen />
        </FullScreenControl>
    </div>

</template>

<!-- Usage:

	<CheckersGame :forceMandatory :resetSignal :fullScreen /> 
-->
