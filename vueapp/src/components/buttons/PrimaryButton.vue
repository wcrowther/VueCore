<script setup>

	const props = defineProps(
	{
		compact: Boolean, // For 'compact' to without a value cannot be { Boolean }
		title: { type: String, required: false, 
    		validator: (value) => 
			{
      			if (!slots.default && !value) 
				{
        			console.error('[Vue warn]: Missing required prop: "title" when no slot content is provided.');
        			return false;
      			}
      			return true; 
    		}
		}
	})

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

