<script setup>

    const appStore                   = useAppStore()
    const { enableNotes, showNotes } = storeToRefs(appStore) 

    const props = defineProps (
    {
        showNotesIcon:    { type: Boolean, default: false } 
    })


</script>

<template>
    <div class="relative h-14 pl-5 pr-10 flex justify-end items-center overflow-hidden select-none">
        
        <div class="mr-auto flex items-center gap-3">
            <slot name="leftalign"></slot>
        </div>

        <slot name="default"></slot>

        <IconSymbol v-if="enableNotes && props.showNotesIcon" 
            @click="showNotes=!showNotes"  width="20px" 
            :class="['ml-10 text-color-dark-gray',
            showNotes ? 'text-orange hover:text-black' 
				      : 'text-gray-800 hover:text-gray-400']"
            icon="heroicons:document-text" /> 
 
        <InfoButton class="ml-2" />

    </div>
</template>

