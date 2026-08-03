<script setup>

	import { useSwipe } from '@vueuse/core';

	const swipeStatus = ref('');
	const el = useTemplateRef('el');

	const handleSwipeEnd = (event, direction) => {
		if (direction === 'RIGHT') {
			swipeStatus.value = 'Swiped Right! 🎉';
			alert('Swipe Right detected');
		} else {
			swipeStatus.value = `Swiped ${direction}`;
		}
	};

	// 3. Use the useSwipe composable, passing the target element ref and options
	const { direction, isSwiping } = useSwipe(el, {
		onSwipeEnd: handleSwipeEnd,
		// Optional: set a threshold (in pixels) for the swipe to be detected
		threshold: 50,
	});

	// Optional: Reactive variables can be used in the template
	// direction will be 'LEFT', 'RIGHT', 'UP', 'DOWN', or 'NONE'
	// isSwiping is a boolean indicating if a swipe is currently in progress
	
</script>

<template>

	<div ref="el" class="swipe-area border  bg-yellow-200
		flex flex-col justify-center items-center m-10 h-[200px]">
		<p>Swipe here on a mobile device</p>
		<p>Is Swiping: {{ isSwiping ? 'Yes' : 'No' }}</p>
		<p>Current Direction: {{ direction }}</p>
		<p>Status: {{ swipeStatus }}</p>
	</div>

</template>

<style scoped>
	.swipe-area {
		touch-action: pan-y;
		/* Allows vertical scrolling while enabling horizontal swipe detection */
	}
</style>
