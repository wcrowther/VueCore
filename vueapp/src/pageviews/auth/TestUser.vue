<script setup>

	const testUserName 	= 'testten'
	const testPassword 	= 'GhostBirdhasflown!'
	const modelValue 	= defineModel({default: new AuthRequest(testUserName, testPassword)})

	const setTestUser = () => 
	{
		modelValue.value.UserName = testUserName
		modelValue.value.Password = testPassword
	}

</script>


<template>

	<div class="p-5 pb-7 flex flex-wrap bg-[#b8d7ed]/50" @click="setTestUser">

		<div class="w-full mb-5 select-none italic text-md text-center tracking-wide hover:underline">
			Quick Access: Click here to fill with the test UserName and Password 
			then click the Login button above.
		</div>

		<IconSymbol width="16px" class="text-color-dark-gray hover:text-black mr-3" icon="heroicons:arrow-top-right-on-square"/>

		<div class="flex-grow cursor-text" >
			<b class="select-none">UserName:</b> {{ testUserName }}    
		</div>

		<div class="flex-grow text-end cursor-text">
			<b class="select-none">Password:</b> {{ testPassword }}
		</div>

	</div>

</template>
