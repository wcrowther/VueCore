<script setup>

	const showModal = defineModel({ type: Boolean })

	const props = defineProps(
	{
		title:            	{ type: String, default: null },
		teleportToModals:   { type: Boolean, default: true },
		height:           	{ type: String, default: '300px' },
		width:            	{ type: String, default: '500px' },
		overlayClickCloses: { type: Boolean, default: false },
		showFooter: 		{ type: Boolean, default: true },
	})

	defineOptions({ inheritAttrs: false })

	useScrollLock(showModal)

</script>

<template>
	<Teleport to="#modals" :disabled="!teleportToModals">    
		<Transition name="modal">

			<div v-if="showModal" id="ModalOverlay"
				@click.self="props.overlayClickCloses && closeModal"
                class="flex fixed z-[999] top-0 left-0 w-full h-full bg-black 
					bg-opacity-30 transition-opacity ease-in-out duration-75">

				<div class="flex flex-col m-auto  max-w-screen transition-all relative 
					bg-white rounded-sm shadow-lg shadow-color-dark-gray"
					:style="{ height: props.height, width: props.width }">

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
					
					<!-- Content - Gets ModalControls attributes ($attrs) on this div -->
					<div class="pb-8 h-full items-stretch scrollbar-thin overflow-auto"
						v-bind="$attrs"
						><slot><div class="p-5 pb-0">Default content</div></slot></div>

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


<!-- Usage: 

    <ModalControl v-if="showAdvSearch" v-model="showAdvSearch"  />
-->
