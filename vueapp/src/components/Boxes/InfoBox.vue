<script setup>
	const appStore                      = useAppStore()
	const { infoLevel }                 = storeToRefs(appStore)
</script>

<template>
    <div v-if="infoLevel > 1" class="mb-3 text-sm">
        <slot></slot>
    </div>
</template>

<!-- 
USE:  Wrap around content that you only want to appear when infoLevel is Info (2) or Help (3)
      determined by the InfoLevel control.

EXAMPLES: 

    <InfoBox>
        Voluptates accusamus repudiandae quam officiis temporibus dicta ipsa iure? 
    </InfoBox>
-->


