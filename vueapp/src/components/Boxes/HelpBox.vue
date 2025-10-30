<script setup>

	const appStore        = useAppStore()
	const { infoLevel, }  = storeToRefs(appStore)

    const props = defineProps(
	{
		compact: 	 { type: Boolean, default: false }, 
	});

</script>

<template>
    <div v-if="infoLevel > 2" 
        :class="['text-sm border border-[#f97316] bg-white  w-full',
            props.compact ? 'mb-3 px-3 py-2 rounded-md' : 'mb-2 px-6 py-5 rounded-xl']">

        <span v-if="!props.compact"
            class="float-right relative -top-4 -right-5 badge-button text-white bg-orange" 
            @click="infoLevel=2"  @click.right.prevent="infoLevel=1">
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

