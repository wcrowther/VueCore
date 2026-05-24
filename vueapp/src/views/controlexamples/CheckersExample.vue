<script setup>

    const fullScreen = ref(false)
    
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

        <FullScreenControl v-model:fullScreen="fullScreen" class="p-10">
            <CheckersGame v-model:fullScreen="fullScreen" />
        </FullScreenControl>
    </div>

</template>
