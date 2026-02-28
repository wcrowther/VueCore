 <script setup>

    const event = defineModel('event', { type: Object, required: true })
	const props = defineProps(
	{ 
		editingEventId: { type: Number, default: null }
	})

	const isEdit = computed(() => props.editingEventId === event.value.id)

	const emit = defineEmits(['select','edit'])

	const editEvent = (e) => 
	{ 
		const id = event.value.id

		console.log('editEvent', id)

		e.stopPropagation();

		emit('edit', id);
	}

</script>

<template>
	<div @click="$emit('select', event.id)" :title="`EventId: ${event.id}`" 
		:class="['group border border-b-0 border-blue-200 p-2 flex justify-between items-center',
		event.id === editingEventId ? 'bg-blue-100' : '']">
		<div class="flex justify-center items-center">
			<span class="size-5 mr-1">
				<IconSymbol v-if="event.id === editingEventId" width="20px" 
					class="text-blue-400" icon="material-symbols-light:play-arrow" />
			</span>
			<span class="mr-2">{{ event.time }}</span>
			{{ event.title }}
		</div>
		<IconSymbol @click.stop="editEvent" class="hidden group-hover:block text-color-dark-gray mr-1" icon="heroicons:pencil-square-solid" />

	</div>
	<!-- inline editing form -->
	<div v-if="isEdit" class="border-blue-200 border-x pt-2 px-2">
		<div class="mb-2">
			<TextInput v-model="event.title" placeholder="Title" class="input w-full" />
		</div>
		<div class="flex gap-2">
			<div class="w-1/2">
				<DateInput v-model="event.date" />
			</div>
			<div class="w-1/2">
				<TimeInput v-model="event.time" />
			</div>
		</div>
	</div>
</template>
