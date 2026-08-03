<script setup>

    const toastStore      	= useToastStore()
	const authStore			= useAuthStore()

	const { login }			= authStore
	const authModel			= new AuthRequest()
	const authRequest 		= ref(authModel)
	
	const v$ 				= useVuelidate(authRequestValidator, authRequest.value)
	const validateAndLogin	= async () =>
	{
		let isValidAuth = await v$.value.$validate()

		if(isValidAuth)	
			return loginUser()

		toastStore.showInfo('Please enter a valid UserName and Password');
		console.log(v$.value.$errors.map(e => `${e.$property} : ${e.$message}`).join('\n'))

		// Alternate version:
		// v$.value.$errors.forEach(error => { console.log(`${error.$property} : ${error.$message}`) });
	}

	const loginUser   		= async () => login(authRequest.value)

</script>

<template>

	<form id="LoginView">
		<TextInput 		labelName="UserName" autocomplete="username" v-model="authRequest.UserName" :v$ />
		<PasswordInput 	labelName="Password" autocomplete="password" v-model="authRequest.Password" :v$ />
		<div class="select-none pt-5 flex justify-between has-[>:only-child]:justify-end gap-3 mb-5">
			<slot></slot>
			<button class="btn-primary" @click.prevent="validateAndLogin">Login</button>
		</div>
	</form>

	<div class="mb-5 italic">
		User data will be persisted but will be wiped on an intermittent basis. 
		The test login is not secure and is only for demonstration purposes.
	</div>

	<TestUser v-model="authRequest" />

</template>


