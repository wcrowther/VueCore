<script setup>
	import { computed, watchEffect, useSlots } from 'vue'

	const props = defineProps(
	{
		compact: Boolean, // For 'compact' to without a value cannot be { Boolean }
		title: { type: String, required: false }
	})

	const slots = useSlots()
	const hasDefaultSlot = computed(() => Boolean(slots.default))
	const warningMessage = '[Vue warn]: Missing required prop: "title" when no slot content is provided.'

	watchEffect(() => { if (!hasDefaultSlot.value && !props.title) console.warn(warningMessage) })

</script>

<template>
    <button :class="['btn-primary',{'text-xs max-h-6 px-3': props.compact}]">
		<slot>{{ props.title }}</slot>
	</button>
</template>

<!-- USAGE - We may add additional props in the future 
	
	<PrimaryButton>Click Me</PrimaryButton>
	<PrimaryButton title="Save" />
-->

