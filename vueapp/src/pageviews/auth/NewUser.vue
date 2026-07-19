<script setup>

    const toastStore      	= useToastStore()
	const authStore			= useAuthStore()
	const { signup }		= authStore
	const userData 			= ref(new UserModel())
	const v$ 				= useVuelidate(authSignupValidator, userData.value)

	const signupUser   		= () => signup(userData.value)

	const validateAndSignup	= async () =>
	{
		let isValidAuth = await v$.value.$validate()
	
		if(isValidAuth)	
			return signupUser()

		toastStore.showInfo('Please enter a valid UserName and Password.');

		v$.value.$errors.forEach(error => {
			console.log(`${error.$property} : ${error.$message}`) 
		});
	}

</script>

<template>

	<form id="NewUser">
		<TextInput 		labelName="First Name" 	v-model="userData.FirstName" :v$ />
		<TextInput 		labelName="Last Name"  	v-model="userData.LastName"  :v$ />
		<TextInput 		labelName="User Email" 	v-model="userData.UserEmail" :v$ />
		<TextInput 		labelName="UserName" 	v-model="userData.UserName"  :v$ />
		<PasswordInput  labelName="Password" 	v-model="userData.Password"  :v$ />
	
		<div class="select-none pt-5 flex justify-end gap-3 mb-5">
			<button class="btn-primary" @click.prevent="validateAndSignup">New User Sign Up</button>
			<slot></slot>
		</div>	
	</form>

</template>






