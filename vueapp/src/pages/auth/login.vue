
<script setup>

	const showNewUser	= ref(false)

</script>

<template>

	<LayoutAuth>

		<div id="login" class="p-10 pb-12 relative h-full"> 

			<LoginView v-if="!showNewUser">
				<span class="btn-secondary" @click="showNewUser=true">New User Signup</span>
			</LoginView>

			<NewUser v-else>
				<button class="btn-delete"  @click="showNewUser=false">Cancel</button>
			</NewUser>

		</div>

	</LayoutAuth>	

</template>