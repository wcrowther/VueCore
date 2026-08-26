
<script setup>

	const authStore     		= useAuthStore()
	const { authUser  } 		= storeToRefs(authStore)
	const adminRoles 			= ['Admin', 'SuperAdmin']

	const appStore   			  = useAppStore()
    const { showNewChatMessages } = storeToRefs(appStore)
	
	// onMounted(() => console.log('MainNavBar onMounted'))

</script>

<template>

    <NavBar id="navBar" class="bg-gradient-navbar md:ml-3">

		<template v-if="showNewChatMessages" #leftalign>
			<div class="h-full flex pt-1">
				<NewChatMessages class="self-center ml-1" />
			</div>
		</template> 

		<NavTab to="/home" class="homeGroup">
			<IconSymbol width="18px" class="text-[#bddaef] block xs:hidden
				homeGroup-hover:text-navy homeGroup-hover:opacity-100" icon="heroicons-solid:home" />
			<span class="hidden xs:block">Home</span>
		</NavTab>

		<NavTab navText="Accounts" to="/accounts" />

		<NavTab navText="Examples" to="/examples" /> 

		<NavTab navText="Admin" to="/admin" v-show="adminRoles.includes(authUser.Role)" />

	</NavBar>

</template>

<!-- NOTE: For pages like /account which redirects to /account/main we use the 
	direct path so it does not have to use the redirect. Repeated clicks in quick succession 
	can cause refresh issues in some cases . 
 -->	

