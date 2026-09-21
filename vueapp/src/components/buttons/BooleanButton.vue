<script setup>

	const props = defineProps(
	{
		text:       		{ type: String, default: null },
		trueText:   		{ type: String, default: null },
		falseText:  		{ type: String, default: null },
		trueIcon:   		{ type: String, default: null },
		falseIcon:  		{ type: String, default: null },
		stackTrueFalseText: { type: Boolean, default: true },
	})

	const modelValue = defineModel ({ type: Boolean, default: false })
	const attrs = useAttrs()

</script>

<template>
	
	<PrimaryButton @click="modelValue = !modelValue"
		:class="{'pr-3': (props.trueIcon || props.falseIcon)}" >

		<slot>
			<span class="flex gap-1" v-bind="attrs">
				<span v-if="text">{{ text }}</span>

				<!-- stackTrueFalseText: stack both labels in one grid cell so the wider one sets a fixed width -->
				<span v-if="stackTrueFalseText && (trueText || falseText)" class="grid">
					<span class="[grid-area:1/1]" :class="{ invisible: !modelValue }">{{ trueText }}</span>
					<span class="[grid-area:1/1]" :class="{ invisible: modelValue }">{{ falseText }}</span>
				</span>
				<span v-else>
					<span v-show="modelValue">{{ trueText }}</span>
					<span v-show="!modelValue">{{ falseText }}</span>
				</span>

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

	<BooleanButton v-model="boolValue" trueIcon="heroicons-solid:eye" falseIcon="heroicons-solid:eye-slash" />
-->

