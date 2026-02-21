<script setup>

	const props = defineProps({
		showModal:          Boolean, 
		title:            	String,
		teleportToBody:   	{ type: Boolean, default: true },
		height:           	{ type: String, default: '300px' },
		width:            	{ type: String, default: '500px' },
		overlayClickCloses: { type: Boolean, default: false },
	})

	defineOptions({ inheritAttrs: false })

	const emits 		= defineEmits(["closeModal"])
	const closeModal 	= () =>  emits('closeModal')
	
	onMounted(() =>   { document.body.style.overflow = 'hidden'; })
	onUnmounted(() => { document.body.style.overflow = 'auto'; })

    watch(() => props.showModal, (newVal) => 
    {
		// Prevents scrolling behind overlay. 
		document.body.style.overflow    = newVal ? 'hidden': 'auto'

		// code: document.body.style.marginRight = newVal ? '16px': 'initial'
    })


</script>

<template>
	<Teleport to="body" :disabled="!teleportToBody">    
		<Transition name="modal">

			<div v-if="showModal" id="ModalOverlay"
				@click.self="props.overlayClickCloses && closeModal"
                class="flex fixed z-[9999] top-0 left-0 w-full h-full bg-black 
					bg-opacity-30 transition-opacity ease-in-out duration-75">

				<div class="flex flex-col m-auto  max-w-screen transition-all relative 
					bg-white rounded-sm shadow-lg shadow-color-dark-gray"
					:style="{ height: props.height, width: props.width }">

					<div class="shrink-0 flex justify-between items-center pl-8 pr-5 w-full h-14 
						text-lg font-bold bg-gradient-modal select-none ">
						<slot name="header">
							<span>{{title || 'Title'}}</span>
							<div class="h-7 w-7 bg-white hover:bg-color-light-blue rounded-full flex-center" 
								@click="closeModal">
								<IconSymbol width="22px" class="text-color-dark-gray" icon="heroicons-solid:x" />
							</div>
						</slot>
					</div>
					
					<!-- Content -->
					<div class="pb-8 h-full items-stretch scrollbar-thin" 
						v-bind="$attrs"
						><slot><div class="p-5 pb-0">Default content</div></slot></div>

					<div class="shrink-0 p-4 pb-6 w-full h-18 flex justify-end gap-2 select-none">
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

    <AccountAdvSearch v-if="showAdvSearch" 
        v-model:showModal="showAdvSearch" v-model:listPager="listPager" @getListData="getListData" />

	NOTE: 'v-if' above is used to ensure the modal is only initialized when it is actually needed,
	preventing it from mounting on page load. Removing v-if would cause lifecycle hooks like onMounted 
	(e.g., keyboard listeners) to run immediately, which could override the LayoutEscapeKey behavior.
-->
