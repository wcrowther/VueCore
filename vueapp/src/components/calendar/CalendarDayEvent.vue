 <script setup>

	const { createConfirm } = useConfirmControl()

    const event 		 = defineModel('event', { type: Object, required: true })
	const editingEventId = defineModel('editingEventId', { type: Number, required: false })
 	const eventTitle	 = ref(null)

	const tempDate 	= ref(event.value.date)
	const isEdit 	= computed(() => editingEventId?.value === event?.value.id ? true : false)
	const nullEvent = (e) => {e.stopPropagation()} // stops click from propagation
	const editEvent = () => 
	{
		if(!isEdit.value) 
		{
			editingEventId.value = event.value.id
			nextTick(() => { if (eventTitle.value) eventTitle.value.focus() })
		} 
		else
		{
			editingEventId.value = null
		}
	}

	const confirmDateMove = async () => 
	{
		if(tempDate.value === event.value.date) 
			return

		const confirmed = await createConfirm(`Move this event to ${tempDate.value}?`)

		if(confirmed) 
			event.value.date = tempDate.value  // apply change
		else
			tempDate.value = event.value.date  // revert back
	}

	defineEmits(['deleteEvent'])

	onMounted(() => 
	{ 
		nextTick(() => { if (eventTitle.value) eventTitle.value.focus() })
	})

</script>

<template>
	<div>

		<div @click="editEvent" :title="`EventId: ${event.id}`"
			@keydown.enter.prevent.stop="editEvent"  
			:class="['group border border-blue-400 p-2 flex items-center',
			isEdit ? 'bg-gradient-to-b from-blue-100 to-white border-b-0' : '']">
			<!-- <div class="w-full bg-green">ss</div> -->
			<div class="flex items-center grow">
				<span class="size-5 mr-1">
					<IconSymbol v-if="isEdit" width="20px"
						class="text-blue-400" icon="material-symbols-light:play-arrow" />
				</span>
				<div v-if="isEdit" class="grow mr-2">
					<TextInput ref="eventTitle" v-model="event.title"
						placeholder="Title" @click="nullEvent"
						labelName="Title" :hideLabel="true"
						class="w-full !mb-0" />
				</div>
				<div v-else class="select-none">
					<span class="mr-2 select-none">{{ event.time }}</span>
					{{ event.title || 'No Title' }}
				</div>
			</div>
			<IconSymbol @click.stop="$emit('deleteEvent', event.id)"
				class="text-color-dark-gray ml-auto mr-1" icon="heroicons:x-circle-20-solid"/>
		</div>

		<div v-if="isEdit"
			@keydown.enter.prevent.stop="editEvent"  
			class="border-blue-400 border-x border-b px-8">
			<div class="flex gap-2">
				<div class="w-1/2">
					<TimeInput v-model="event.time" :step="900" />
				</div>
				<div class="w-1/2">
					<DateInput v-model="tempDate" @mouseleave="confirmDateMove" />
				</div>
			</div>
		</div>

	</div>
</template>
