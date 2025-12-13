<script setup>
	const appStore                      = useAppStore()
	const { infoLevel }                 = storeToRefs(appStore)

    const props = defineProps(
	{
        static:  { type: Boolean, default: false },
	});

</script>

<template>
    <div v-if="infoLevel > 1 || static" class="mb-3 text-sm">
        <slot></slot>
    </div>
</template>

<!-- 
USE:  Wrap around content that you only want to appear when infoLevel is Info (2) or Help (3)
      determined by the InfoLevel control.

EXAMPLES: 

    <InfoBox>
        Conditional generic directions or information to display on the page.
    </InfoBox>

    <InfoBox :static="true">
        Always display generic directions or information to display on the page 
    </InfoBox>
-->


