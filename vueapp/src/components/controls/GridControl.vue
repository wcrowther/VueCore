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

	<div class="w-fit grid gap-0" 
		:style="{ gridTemplateRows: `repeat(${props.rows}, 1fr)`, 
		gridTemplateColumns: `repeat(${props.cols}, 1fr)`}">

		<template v-for="(_, rowIndex) in props.rows" :key="rowIndex">

			<template v-for="(_, colIndex) in props.cols" 
				:key="`${rowIndex}-${colIndex}`">

				<div class="flex justify-center items-center"
					:id="`${rowIndex}-${colIndex}`" 
					:style="{ gridRow: rowIndex+1, gridColumn: colIndex+1 }">

					<slot :title="`${rowIndex}-${colIndex}`"
						:rowIndex="rowIndex" :colIndex="colIndex"
						:row="rowIndex + 1"	:col="colIndex + 1"
						:id="`${rowIndex}-${colIndex}`"	:isEvenCell="(rowIndex + colIndex) % 2 === 0">

						<div class="size-10" />

					</slot>
				</div>

			</template>

		</template>
	</div>

</template>


<!--  Usage: 
	// Note: use colon (:) to bind the rows and cols props as numbers instead of strings.

	<GridControl :rows="5" :cols="7" class="size-10 bg-white border border-blue aspect-square" />

	<GridControl :rows="5" :cols="7" v-slot="{ rowIndex, colIndex, row, col, id, isEvenCell }">
		<div
			:class="[
				'size-10 border border-blue aspect-square',
				isEvenCell ? 'bg-slate-200' : 'bg-white'
			]"
		>
			{{ row }},{{ col }}
		</div>
	</GridControl>


	<div>Rows: {{ props.rows }}</div>
	<div>Cols: {{ props.cols }}</div>

-->
