<script setup>

    const showModal          = defineModel('showModal')

    // Keyboard Listeners  ================================================
	
    DisableGlobalKeys(showModal) // disable Esc key if modal is showing  

    const keys =
    {
		'Escape': () => showModal.value=false
    }

	KeyboardListeners(keys)

</script> 

<template>   

	<ModalControl v-model="showModal" title="ImageEditor" id="ImageEditor" 
        height="90%" width="90%" class="p-6 pb-10 overflow-hidden" @closeModal="showModal=false">

        <!-- overflow-y-auto scrollbar-thin -->
        <TabsControl class="h-full"  id="ImageEditorTabsControl" 
            :tabList="['Gallery', 'Detail', 'Upload']" >

            <template #Gallery>       
                <ImageGalleryView />
            </template>
            
            <template #Detail>       
                <ImageDetailView />
            </template>
            
            <template #Upload>       
                <ImageUploadView />
            </template>

        </TabsControl>

        <template #footer>
            <button class="btn-delete" @click="showModal=false">Close</button>
        </template> 

	</ModalControl>

</template>

