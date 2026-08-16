<script setup>

	const showModal = defineModel({ type: Boolean })

	const props = defineProps(
	{
		title:            	{ type: String, default: null },
		teleportToModals:   { type: Boolean, default: true },
		height:           	{ type: String, default: '300px' },
		width:            	{ type: String, default: '500px' },
		overlayClosesModal: { type: Boolean, default: false },
		showFooter: 		{ type: Boolean, default: true },
	})
	
	const closeModal = () => showModal.value = false

	defineOptions({ inheritAttrs: false })

	DisableGlobalKeys(showModal) // disable Esc key if modal is showing

	useScrollLock(showModal)

</script>

<template>
	<Teleport to="#modals" :disabled="!teleportToModals">    
		<Transition name="modal">

			<!-- Modal Overlay (the semi-transparent background behind the modal) -->
			<div v-if="showModal" id="ModalOverlay"
				@click.self="props.overlayClosesModal && closeModal()"
                class="flex fixed z-[999] top-0 left-0 w-full h-full bg-black 
					bg-opacity-30 transition-opacity ease-in-out duration-75">

				<!-- Modal Container -->
				<div class="flex flex-col m-auto  max-w-screen transition-all relative 
					bg-white rounded-sm shadow-lg shadow-color-dark-gray"
					:style="{ height: props.height, width: props.width }">

					<!-- Modal Header -->
					<div class="shrink-0 flex justify-between items-center pl-8 pr-5 w-full h-14 
						text-lg font-bold bg-gradient-modal select-none">

						<slot name="header">
							<span>{{title || 'Title'}}</span>
							<div class="h-7 w-7 bg-white/50 hover:bg-color-light-blue rounded-full flex-center" 
								@click="showModal=false">
								<IconSymbol width="18px" class="text-color-dark-gray" icon="heroicons-solid:x" />
							</div>
						</slot>

					</div>
					
					<!-- Modal Content - Gets ModalControls attributes ($attrs) on this div -->
					<div class="pb-8 h-full items-stretch scrollbar-thin overflow-auto"
						v-bind="$attrs"
						><slot><div class="p-5 pb-0">Default content</div></slot>
					</div>

					<!-- Modal Footer -->
					<div v-if="showFooter"
						class="shrink-0 p-4 pb-6 w-full h-18 flex justify-end gap-2 select-none">
						<slot name="footer">
							<button class="btn-primary" @click="closeModal">Ok</button>
						</slot>
					</div>

				</div>

			</div>

		</Transition>
	</Teleport> 
</template>

<style lang="postcss" scoped>

    /* The following styles are auto-applied to elements with transition="modal" when their visibility is 
    * toggled by Vue.js. You can easily play with the modal transition by editing these styles. */

	.modal-enter-from { opacity: 0; }
	.modal-leave-to { opacity: 0; }
	.modal-enter-from .modal-container,
	.modal-leave-to .modal-container { -webkit-transform: scale(1.1); transform: scale(1.1); }

</style>


<!-- Usage Examples: 

    // In this example, using a v-if condition, the ModalControl will only be created when the condition is true
	<ModalControl v-if="showAdvSearch" v-model="showAdvSearch"  />

    <ModalControl v-model="showModal" title="Advanced Search" height="400px" width="500px">
        <div class="p-5 pb-0">Content Here</div>
    </ModalControl>

    <ModalControl v-model="showModal" height="600px" width="600px" :overlayClosesModal="true">...

    <ModalControl v-model="showModal" :teleportToModals="false" :showFooter="false">...

    <ModalControl v-model="showModal" title="Confirm">
        <template #footer>
            <button class="btn-primary" @click="onConfirm">Yes</button>
            <button class="btn-delete" @click="showModal=false">No</button>
        </template>
    </ModalControl>

    <ModalControl v-model="showModal">
        <template #header>
            <span>Custom Header</span>
        </template>
        <div class="p-5">Content Here</div>
    </ModalControl>
-->
