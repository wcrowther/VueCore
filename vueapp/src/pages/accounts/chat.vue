<script setup>
    const pageTitle  = ref('Chat')
    const messageStore = useChatStore()

    onMounted(() => 
    {
        messageStore.markMessagesRead()
    })
</script>

<template>

    <div class="relative" id="messages-page">

		<BackGradation />

        <div class="z-20 p-5 pt-5 sm:p-10 sm:pt-5 pb-14">
            <div class="flex justify-between items-center mb-7 relative">
                <h2 class="text-2xl font-display font-bold flex-grow">{{ pageTitle }}</h2>
                <span class="flex flex-wrap gap-1.5">
                    <!-- <button class="btn-primary" >Add</button>-->
                </span>
            </div>
			<div class="z-20w-full min-h-[400px] relative">

				<InfoBox>
					This page demonstrates real-time messaging powered by <b>SignalR</b> — a persistent connection 
					between the browser and the server. Open this page in multiple browser windows and send a message; 
					it will appear instantly across all connected sessions without any page refresh.
				</InfoBox>

				<HelpBox class="mb-7">
					<b>How it works:</b> SignalR automatically negotiates the best available transport — preferring 
					<b>WebSockets</b> for a true full-duplex connection, with fallback to Server-Sent Events or 
					Long Polling when needed. The server pushes each new message to all connected clients in real time 
					by broadcasting on the <code>ReceiveMessage</code> hub event. Duplicate detection prevents the same 
					message from appearing twice even if it arrives via both the API response and the hub broadcast.
					<br /><br />
					<b>Message limit:</b> The server retains only the last <b>20 messages</b> to keep the example 
					lightweight — older messages are automatically dropped.
					<br /><br />
					<b>Tips:</b> Use the sort toggle to switch between newest-first and oldest-first order. 
					The chat session is preserved with <code>&lt;KeepAlive&gt;</code>, so navigating away and back 
					will not disconnect you or re-fetch messages unnecessarily.
				</HelpBox>

				<KeepAlive>
                    <ChatRoom class="mt-5 mb-7" />
                </KeepAlive>

			</div>

        </div>

    </div>  
</template>



<!--
<div class="flex pl-5 gap-3">

    <IconSymbol class="transition-transform duration-500" :class="{'rotate-[-450deg]': isTop}"
        :color="isTop ? 'green': 'red'" @click="isTop=!isTop" width="96px" icon="mdi:arrow-down-thick" />

    <IconSymbol width="96px" :inline="false" :vertical-flip="true" 
        color="red" class="border border-red" icon="mdi:arrow-down-box" />

    <div class="bg-red contents h-fit w-fit">
        <IconSymbol class="" width="96px" icon="heroicons:academic-cap-16-solid" />
    </div> 
</div>
 -->