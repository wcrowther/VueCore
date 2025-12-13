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

	<div class="w-fit mx-auto" :style="{ display: 'grid', gap: '4px', 
		gridTemplateRows: `repeat(${props.cols}, 1fr)`, 
		gridTemplateColumns: `repeat(${props.rows}, 1fr)`}">

		<template v-for="(row, rowIndex) in props.rows" :key="rowIndex">

			<template v-for="(col, colIndex) in props.cols" :key="`${rowIndex}-${colIndex}`">
				<div class="flex justify-center items-center" v-bind='$attrs' 
					:style="{ gridRow: rowIndex+1, gridColumn: colIndex+1 }" 
					:title="`Row: ${rowIndex+1}, Col: ${colIndex+1}`">
					<slot></slot> <!-- :name="`cell|${row}|${col}`" -->
				</div>
			</template>

		</template>

	</div>

	<div>Rows: {{ props.rows }}</div>
	<div>Cols: {{ props.cols }}</div>

</template>

<!--  Usage: 
	// Note: use colon (:) to bind the rows and cols props as numbers instead of strings.

	<GridControl :rows="5" :cols="7" class="size-10 bg-white border border-blue aspect-square" />
-->
