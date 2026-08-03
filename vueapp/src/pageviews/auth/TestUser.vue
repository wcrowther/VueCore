<script setup>

	const userName 		= 'testten'
	const password 		= 'GhostBirdhasflown!'
	const modelValue 	= defineModel({default: new AuthRequest(userName, password)})

	const setTestUser = () => 
	{
		modelValue.value.UserName = userName
		modelValue.value.Password = password
	}

</script>


<template>

	<div class="p-5 pb-7 flex flex-wrap bg-[#b8d7ed]/50" @click="setTestUser">

		<div class="w-full mb-5 select-none">New users click
			<span class="italic font-bold">New User Signup</span> above or use the 
			<b>test login</b> below. 
		</div>

		<IconSymbol width="16px" class="text-color-dark-gray hover:text-black mr-3" icon="heroicons:arrow-top-right-on-square"/>

		<div class="flex-grow cursor-text" >
			<b class="select-none">UserName:</b> {{ userName }}    
		</div>

		<div class="flex-grow text-end cursor-text">
			<b class="select-none">Password:</b> {{ password }}
		</div>

	</div>

</template>
