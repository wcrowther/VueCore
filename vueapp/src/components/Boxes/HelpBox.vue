<script setup>

	const appStore      = useAppStore()
	const { infoLevel } = storeToRefs(appStore)

    const props = defineProps(
	{
		compact: { type: Boolean, default: false },
        pin:  { type: Boolean, default: false },
	})

    const helpClick = () => { if(!props.pin){ infoLevel.value = 2 } }

</script>

<template>
    <div v-if="infoLevel > 2 || pin" 
        :class="['text-sm border-y border-[#f97316] bg-white/75  w-full',
            props.compact ? 'mb-3 px-3 py-2' : 'mb-2 px-6 py-5']">

        <span v-if="!props.compact"
            class="float-right relative -top-3 -right-4 badge-button text-white bg-orange" 
            @click="helpClick"  @click.right.prevent="infoLevel=1">
            Help
        </span> 

        <slot></slot>
        
    </div>
</template>

<!-- 
USE:  Wrap around content that you only want to appear when infoLevel is Help (3) determined 
    by the InfoLevel control. Optional 'compact' parameter for streamlined version.

EXAMPLES: 

    <HelpBox>
        Voluptates accusamus repudiandae quam officiis temporibus dicta ipsa iure? 
    </HelpBox>

    <HelpBox :compact="true">
        Note the : before compact so that true is evaluated as a boolean not a string
    </HelpBox>
-->

