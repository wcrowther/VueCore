<script setup>

    import { Icon } from '@iconify/vue'

    /*  
    ============================================================================================
    Wrapper for Iconify 'Icon' component
    ============================================================================================
    https://icones.js.org/ - list of icons
    https://icones.js.org/collection/heroicons
    https://iconify.design/docs/icon-components/vue/

    Examples:

    <IconSymbol class="text-color-red" icon="heroicons:chevron-right-solid" />
    <IconSymbol class="text-color-red" icon="heroicons:chevron-down-solid" />
    <IconSymbol width="28px" class="text-warm" @click="deleteProp" icon="heroicons:x-circle-20-solid" />
    <IconSymbol width="32px" class="text-color-dark-gray" icon="heroicons:bars-3" />
    <IconSymbol width="28px" class="text-color-dark-gray" icon="heroicons:cog-8-tooth-solid" />
    <IconSymbol width="28px" class="text-color-dark-gray" icon="fa7-solid:folder" />
    <IconSymbol width="28px" class="text-color-dark-gray" icon="fa7-solid:folder-open" />
    <IconSymbol width="28px" class="text-color-dark-gray" icon="heroicons:arrow-path" />
    <IconSymbol class="text-blue" icon="material-symbols-light:play-arrow" />
    <IconSymbol class="text-blue" icon="material-symbols-light:arrow-back-2" />
    <IconSymbol class="text-color-dark-gray" icon="heroicons:pencil-square-solid" />
    <IconSymbol class="text-black group-hover:text-color-mid-gray"
        title="Advanced Search" width="22px" icon="heroicons:plus-20-solid" />

    <IconSymbol v-if="modelValue && modelValue.length > 0" 
        class="xs:hidden sm:block text-color-dark-gray hover:text-color-mid-gray" 
        width="22px" icon="heroicons:x-mark" />

    <IconSymbol width="18px" class="mt-[10px] mr-1 text-color-dark-gray
		group-hover:text-white group-hover:opacity-100" icon="heroicons-solid:home" />

    <IconSymbol :inline="false" :vertical-flip="true" class="border border-red"
        color="red"  width="96px" icon="mdi:arrow-down-box" />

    <IconSymbol class="transition-transform duration-500" :class="{'rotate-[-450deg]': isTop}"
        :color="isTop ? 'green': 'red'" @click="isTop=!isTop" width="96px" icon="mdi:arrow-down-thick"  />
    ============================================================================================
    */

	const props = defineProps(
	{
		inline: { type: Boolean, default: true }
	});


</script>

<template>
    <Icon :inline="props.inline" :class="{'inline': props.inline}" />
</template>

