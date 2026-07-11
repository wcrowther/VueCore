
<script setup>

    const appStore   			= useAppStore()
    const { showNotification }	= storeToRefs(appStore)

	const props = defineProps({ id: {type: String, default: 'NotificationControl'} })

</script>

<template>

	<Teleport v-if="showNotification" 
		to="#modals" :id="props.id">

		<div class="fixed left-5 right-5 bottom-16 z-[1000] ">
			<div class="relative p-5 bg-orange-300">
				<div class="absolute top-2 right-2" @click="showNotification=false">
					<div class="h-7 w-7 bg-white/50 hover:bg-white/30 rounded-full flex-center">
						<IconSymbol width="18px" class="text-color-dark-gray" icon="heroicons-solid:x" />
					</div>
				</div>
				<div class="mr-5">
					<slot>
						This is a one-time message for showing notifications, for things 
						like cookies, etc. After you dismiss it, it will not show 
						again for that browser. The state is stored in localStorage 
						which can be toggled on/off in the UserPopout.
					</slot>
				</div>
			</div>
		</div>

	</Teleport>

</template>

<!-- Usage: To show a one-time notification message. Status persisted in localStorage.
	Example:
 
    <NotificationControl />  // Defaults to text in slot above
	<NotificationControl>
		Custom message here.
	</NotificationControl>
-->

