 <script setup>

    const event = defineModel('event', { type: Object, required: true })
	const props = defineProps(
	{ 
		selectedEventId: { type: Number, default: null},	
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
		emit('select', id);
	}

</script>

<template>
	<div @click="$emit('select', event.id)" :title="`EventId: ${event.id}`" 
		:class="['group border border-b-0 border-blue-200 p-2 flex justify-between items-center',
		event.id === selectedEventId ? 'bg-blue-100' : '']">
		<div class="flex justify-center items-center">
			<span class="size-5 mr-1">
				<IconSymbol v-if="event.id === selectedEventId" width="20px" 
					class="text-blue-400" icon="material-symbols-light:play-arrow" />
			</span>
			<span class="mr-2">{{ event.time }}</span>
			{{ event.title }}
		</div>
		<IconSymbol @click.stop="editEvent" class="hidden group-hover:block text-color-dark-gray mr-1" icon="heroicons:pencil-square-solid" />

	</div>
	<!-- inline editing form -->
	<div v-if="isEdit" class="border-blue-200 border-x p-3">
		<div class="mb-2">
			<input type="text" v-model="event.title" class="input w-full" />
		</div>
		<div class="flex gap-2 mb-2">
			<div class="w-1/2">
				<input type="date" v-model="event.date" class="input" />
			</div>
			<div class="w-1/2">
				<input type="time" v-model="event.time" class="input" />
			</div>
		</div>
	</div>
</template>
