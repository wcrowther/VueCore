
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
			<NewChatMessages class="self-center" />
		</template> 

		<NavTab to="/home" class="group">
			<IconSymbol width="18px" class="text-[#bddaef] block xs:hidden
				group-hover:text-navy group-hover:opacity-100" icon="heroicons-solid:home" />
			<span class="hidden xs:block">Home</span>
		</NavTab>

		<!-- <NavTab navText="Content" to="/content" /> -- Hide until Content is complete -->

		<NavTab navText="Accounts" to="/accounts" />

		<NavTab navText="Admin" to="/admin" v-show="adminRoles.includes(authUser.Role)" />

	</NavBar>

</template>

<!-- NOTE: For pages like /account which redirects to /account/main we use the 
	direct path so it does not have to use the redirect. Repeated clicks in quick succession 
	can cause refresh issues in some cases . 
 -->	

