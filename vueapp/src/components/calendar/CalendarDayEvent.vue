 <script setup>

	const { createConfirm } = useConfirmControl()

    const event 		 = defineModel('event', { type: Object, required: true })
	const editingEventId = defineModel('editingEventId', { type: Number, required: false })
 	const eventTitle	 = ref(null)

	const tempDate 	= ref(event.value.date)
	const isEdit 	= computed(() => editingEventId?.value === event?.value.id ? true : false)
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

	defineEmits(['delete'])

</script>

<template>
	<div @click="editEvent" :title="`EventId: ${event.id}`" 
		:class="['group border border-b-0 border-blue-200 p-2 flex justify-between items-center',
		isEdit ? 'bg-blue-100' : '']">
		<div class="flex justify-center items-center">
			<span class="size-5 mr-1">
				<IconSymbol v-if="isEdit" width="20px" 
					class="text-blue-400" icon="material-symbols-light:play-arrow" />
			</span>
			<span class="mr-2">{{ event.time }}</span>
			{{ event.title }}
		</div>
		<IconSymbol @click.stop="$emit('delete', event.value.id)" 
			class="text-color-dark-gray" icon="heroicons:x-circle-20-solid"/>
	</div>

	<!-- inline editing form -->
	<div v-if="isEdit" class="border-blue-200 border-x pt-2 px-2">
		<div class="mb-2">
			<TextInput ref="eventTitle" v-model="event.title" 
				placeholder="Title" class="input w-full" />
		</div>
		<div class="flex gap-2">
			<div class="w-1/2">
				<DateInput v-model="tempDate" @mouseleave="confirmDateMove" />
			</div>
			<div class="w-1/2">
				<TimeInput v-model="event.time" />
			</div>
		</div>
	</div>
</template>
