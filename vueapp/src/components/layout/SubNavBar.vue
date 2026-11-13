<script setup>

    //const appStore                   = useAppStore()
    // const { enableNotes, showNotes } = storeToRefs(appStore) 

</script>

<template>
    <div class="relative h-14 pl-5 pr-10 flex justify-end items-center overflow-hidden select-none">
        
        <div class="mr-auto flex items-center gap-3">
            <slot name="leftalign"></slot>
        </div>

        <slot name="default"></slot>

        <InfoButton />
       
        <!-- 
        <IconSymbol v-if="enableNotes" @click="showNotes=!showNotes"
            width="20px" class="ml-4 text-color-dark-gray" icon="heroicons:document-text" /> 
        -->

    </div>
</template>

