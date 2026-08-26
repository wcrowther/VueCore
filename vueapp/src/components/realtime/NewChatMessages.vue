<script setup>
	
	const route     = useRoute()
	const CHATPAGE  = "/accounts/chat"
	const { messagesCount, 
			monitorChat } = useChatHub()  

	const chatStore = useChatStore()

	onMounted(() => { if (!chatStore.monitorInitialized) monitorChat();	})

	const clearCountIfOnChatPage = () => 
	{ 
		console.log('Clear Count If On Chat Page.')	
		if (route.path === CHATPAGE)  
			chatStore.markMessagesRead() 
	}
	const messageText = computed(() => messagesCount.value === 1 ? 'Message' : 'Messages')

</script>

<template>

	<router-link  
		v-if="messagesCount > 0"
		:to="CHATPAGE" @click="clearCountIfOnChatPage"
		class="badge-button text-color-blue-gray bg-white hover:opacity-50"
		:title="`You have ${messagesCount} new ${messageText}`">
			{{ messagesCount }}
			<span class="hidden sm:inline">{{ messageText }}</span>
	</router-link>  

</template>

<!-- USAGE 
	<NewChatMessages class="self-center" />
-->

