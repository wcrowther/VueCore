
<script setup>

	const { messagesCount, 
			monitorChat } = useChatHub()  

	onMounted(() => 
	{
        monitorChat()
		console.log('NewChatMessages onMounted')
    })

</script>

<template>

	<router-link  
		v-if="messagesCount > 0"
		to="/accounts/chat"
		class="badge-button text-color-blue-gray bg-white hover:opacity-50"
		title="You have new Messages">
		{{ messagesCount }} Message{{ messagesCount === 1 ? '' : 's'}} 
	</router-link>  

</template>

<!-- USAGE 
	<NewChatMessages class="self-center" />
-->

