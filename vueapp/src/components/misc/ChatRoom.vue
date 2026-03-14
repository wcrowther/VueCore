

<script setup>

	const { startChat, messages, message, sendMessage } = useChatHub()  

	const chatStore 				= useChatStore()
    const { serverMaxMessageId } 	= storeToRefs(chatStore) 

	const authStore	   				= useAuthStore()
	const { userId:currentUserId }	= storeToRefs(authStore)  

	const newestFirst 				= ref(useLocalStorage('chatRoomNewestFirst', true))  
	const lockScroll  				= ref(false) 
	const newestMsg	 				= ref(null)
	const scrollContainer 			= ref(null)

	// ================================================================

	const block		  		= computed(() => newestFirst.value ? 'end' : 'start')
	const enableSendButton	= computed(() => message.value?.MessageText?.length ?? 0 > 0) 

	const isCurrentUser		= (userId) =>  userId === currentUserId.value  
	const setSelectedMsgRef = (el) => newestMsg.value = el
	const scrollToNewestMsg = (behavior) => 
	{
		// console.log('scrollToNewestMsg')
		
		if(lockScroll.value)
			return
		
		if (newestMsg.value && scrollContainer.value)
			newestMsg.value.scrollIntoView({ behavior: behavior || 'instant', block: block.value })
	}
	const toggleSortOrder = async () =>  
	{ 
		newestFirst.value = !newestFirst.value
		await nextTick() 
		scrollToNewestMsg()
	}
	
	// ====================================================================
	
	onMounted( async () =>    
    {        
        await startChat()
        scrollToNewestMsg('instant')
    })

	watch( () => messages.value.length,
		async () => 
		{
			await nextTick()
			scrollToNewestMsg()
		}, 
	)

</script>

<template>
	<div class="bg-white border border-blue flex flex-wrap w-full">

		<div class="p-4 w-full md:w-1/2 lg:w-1/4 bg-color-light-blue/50">
			<TextInput v-model.trim="message.MessageText" 
				@keydown.enter.prevent.stop="sendMessage"  
				placeholder="Message" labelName="Message" />

			<TextInput v-model.trim="serverMaxMessageId" labelName="MaxId" />
			<PrimaryButton title="Send" @click="sendMessage" :disabled="!enableSendButton" />
		</div>

		<div class="p-4 w-full md:w-1/2 lg:w-3/4">

			<div class="pb-3 mb-3 font-bold border-b border-blue flex justify-between items-center">
				<span class="">Chat Messages</span>
				<span class="ml-auto badge-button cursor-pointer text-white bg-color-primary hover:bg-orange" 
					@click="toggleSortOrder" title="Toggle message sort order">
					{{ newestFirst ? 'Latest First' : 'Oldest First' }}
				</span>  
			</div>

			<div ref="scrollContainer" 
				:class="['flex pr-4 max-h-[400px] overflow-y-auto scrollbar-thin', 
				(newestFirst ? 'flex-col-reverse' : 'flex-col')]">
				<template v-for="(msg, index) in messages" :key="msg.MessageId">

					<div :class="['flex px-4 py-2 mb-2 border rounded-lg w-fit min-w-[75%]',
							isCurrentUser(msg.CreatorId) ? 'mr-9 border-[#b8d7ed]'
							: 'ml-auto border-color-mid-blue text-color-dark-blue',
							(index === messages.length - 1) ? 'border-red': '']"
						:ref="index === messages.length - 1 ? setSelectedMsgRef : null"
						:title="dateTimeFormat(msg.DateCreated)">

						<span v-if="isCurrentUser(msg.CreatorId)"
							class="font-bold text-color-mid-blue">{{ msg.CreatorName }} :&nbsp; 
						</span>

						{{ msg.MessageText }}
						<!-- <span class="ml-auto">Id: {{ msg.MessageId }}</span> -->
					</div>
					
				</template>
			</div>

			<div v-if="messages?.length === 0" class="">
				No messages to display.
			</div>

		</div>

	</div>
</template>

<style lang="postcss" scoped>
    .chat-user { @apply px-2 pt-[3px] pb-[2px] bg-[#f8ac59] text-red rounded-full text-center text-xs font-bold select-none }
    .current-user{ @apply text-color-dark-gray }
</style>
