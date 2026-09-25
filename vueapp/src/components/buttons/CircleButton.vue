<script setup>

	const modelValue = defineModel({ type: Boolean, default: false })
	const props = defineProps(
	{
		icon: 			{ type: String, default: 'heroicons:bars-3'},
		noClick: 		{ type: Boolean, default: false },
		rotation: 		{ type: String, default: 'rotate-180'},
		iconColor: 		{ type: String, default: 'text-black'},
		iconHoverColor: { type: String, default: 'text-gray'},
		borderColor: 	{ type: String, default: 'border-transparent'},
		bgColor: 		{ type: String, default: 'bg-amber'},
		size: 			{ type: String, default: '20px'},
		padding: 		{ type: String, default: 'p-2'},
		halfCircle: 	{ type: String, default: null }
	})

	const handleClick = () => { if(!props.noClick ) modelValue.value = !modelValue.value }

	const halfCircleSide 	= computed(() => halfCircleSidesList.find(item => item.side === props.halfCircle))
	const roundedClass 		= computed(() => halfCircleSide.value?.rounded ?? 'rounded-full')
	const flatBorderClass	= computed(() => halfCircleSide.value?.border ?? '')

</script>

<template>

	<span :class="['inline-flex items-center justify-center cursor-pointer border', 
		roundedClass, flatBorderClass, props.padding, props.borderColor, props.bgColor]"
		:style="{ padding: props.padding }" @click="handleClick">
		
		<RotateButton v-model="modelValue" noClick
			:size :rotation :icon :iconColor :iconHoverColor />
	</span>
	
</template>


<!-- CircleButton USAGE

-->