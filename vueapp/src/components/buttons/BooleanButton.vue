<script setup>
	const props = defineProps(
	{
		text:       { type: String, default: null },
		trueText:   { type: String, default: null },
		falseText:  { type: String, default: null },
		trueIcon:   { type: String, default: null },
		falseIcon:  { type: String, default: null },
	})

	const modelValue = defineModel ({ type: Boolean, default: false })

</script>

<template>
	
	<!-- Use this? :class="{'pr-2': (props.trueIcon || props.falseIcon)}" -->
	<PrimaryButton @click="modelValue = !modelValue">

		<slot>
			<span class="flex gap-1">
				<span v-if="text">{{ text }}</span>
				{{ modelValue ? trueText : falseText }}
				<IconSymbol v-if="modelValue ? trueIcon : falseIcon" 
					width="20" :icon="modelValue ? trueIcon : falseIcon" />
			</span>
		</slot>

	</PrimaryButton>  

</template>


<!-- USAGE
	const boolValue = ref(false)
	<BooleanButton v-model="boolValue" trueText="Show On" falseText="Show Off" />

	<BooleanButton v-model="boolValue" trueText="On" falseText="Off"
		trueIcon="heroicons-solid:eye" falseIcon="heroicons-solid:eye-slash" />
-->

