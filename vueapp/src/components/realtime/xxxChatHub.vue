<script setup>

import * as signalR from '@microsoft/signalr'

const authStore	   = useAuthStore()
const { authUser } = storeToRefs(authStore)  
                  

const connection = new signalR.HubConnectionBuilder()
					.withUrl('https://localhost:9999/v1/chathub')
					.withAutomaticReconnect()
					.build();

const firstName 	= authUser.value ? authUser.value.FirstName : ''
const userId 		= authUser.value ? authUser.value.UserId : 0
const message 		= ref('')
const messages 		= ref([])
const latestFirst 	= ref(false) 

const sendMessage = async () => 
{
	if (firstName && message.value) 
	{
		await connection.invoke('SendMessage', firstName, userId, message.value);
		message.value = ''
	}
};

onMounted(async () => 
{
	connection.on('ReceiveMessage', (userName, userId, message) => 
	{
		messages.value.push({ userName, userId, text: message })
	});

	try 
	{
		await connection.start();
		console.log('SignalR connected');
	} 
	catch (err) 
	{
		console.error('SignalR Connection Error: ', err);
	}
});
</script>

<template>
	<div class="bg-white border border-blue flex flex-wrap w-full">

		<div class="p-4 w-full md:w-1/2 bg-color-light-blue/50">
			<TextInput v-model="message" @keydown.enter.prevent.stop="sendMessage"  
				placeholder="Message" labelName="Message"  />
			<PrimaryButton title="Send" @click="sendMessage" />
		</div>

		<div class="p-4 w-full md:w-1/2">

			<div class="pb-3 mb-3 font-bold border-b border-blue flex justify-between items-center">
				<span class="">Chat Messages</span>
				<span class="ml-auto badge-button cursor-pointer text-white bg-color-primary hover:bg-orange" 
					@click="latestFirst = !latestFirst" title="Toggle message sort order">
					{{ latestFirst ? 'Latest First' : 'Oldest First' }}
				</span>  
			</div>

			<div :class="['flex', (latestFirst ? 'flex-col-reverse' : 'flex-col')]">
				<div v-for="(msg, index) in messages" :key="index"
					:class="['p-2 pl-0', {'ml-5 text-red' : msg.userId !== userId }]">
					<b>{{ msg.userName }} ({{ msg.userId }}):</b> {{ msg.text }}
				</div>
			</div>

			<div v-if="messages.length === 0" class="">
				No messages to display.
			</div>

		</div>

	</div>
</template>
