<script setup>

	const props = defineProps(
	{
		rows: { type: Number, required: true },
		cols: { type: Number, required: true },
	})

    // defineOptions({ inheritAttrs: false })
    // const grid = Array.from({ length: props.rows }, () => new Array(props.cols).fill(0));

</script>

<template>

	<div class="w-fit mx-auto grid gap-0 border-4 border-gray-600 mb-5" 
		:style="{ gridTemplateRows: `repeat(${props.cols}, 1fr)`, 
		gridTemplateColumns: `repeat(${props.rows}, 1fr)`}">

		<template v-for="(_, rowIndex) in props.rows" :key="rowIndex">

			<template v-for="(_, colIndex) in props.cols" :key="`${rowIndex}-${colIndex}`">
				<div :class="['flex justify-center items-center', 
					(rowIndex + colIndex) % 2 === 0 ? 'bg-gray-400' : 'bg-slate-200']" 
					:id="`${rowIndex}-${colIndex}`" 
					:style="{ gridRow: rowIndex+1, gridColumn: colIndex+1 }">
					<slot :title="`${rowIndex}-${colIndex}`">
						<div class="size-10"></div>
					</slot>
				</div>
			</template>

		</template>
	</div>

</template>


<!--  Usage: 
	// Note: use colon (:) to bind the rows and cols props as numbers instead of strings.

	<GridControl :rows="5" :cols="7" class="size-10 bg-white border border-blue aspect-square" />


	<div>Rows: {{ props.rows }}</div>
	<div>Cols: {{ props.cols }}</div>

-->
