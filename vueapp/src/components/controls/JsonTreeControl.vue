<script setup>

	const props = defineProps({
		json: { type: [Object, Array, String, Number, Boolean, null], required: true },
		label: { type: [Object, Array, String, Number, Boolean, null], default: "" },
		isOpen: { type: Boolean, default: true }
	})

	// preserve the formatted view open state across Raw/Formatted toggles
	const formattedOpen = ref(props.isOpen)
	watch(() => props.isOpen, (v) => formattedOpen.value = v)

	const showRawJson 	= ref(false)	
	const isRawOpen 	= ref(false)	
	const toggleView 	= () => {
		showRawJson.value = !showRawJson.value
		// do not modify formattedOpen here; keep previous state
	}

</script>

<template>

	<div class="relative">

		<button class="absolute right-0 top-2 text-xs text-blue-500 hover:underline select-none" 
			@click="toggleView" id="toggleFormattedOrRaw">
			{{ showRawJson ? 'Formatted' : 'Raw' }}
		</button>

		<div v-if="showRawJson">
			<div class="bg-transparent border-y-[3px] font-bold select-none flex items-center border-color-primary">
				<RotateButton v-model="isRawOpen" icon="material-symbols-light:play-arrow" />
				<div class="p-1">{{ label }}
					<span class="text-gray-400">| Raw |</span>
				</div> 
			</div>
			
			<pre v-show="isRawOpen" class="ml-[10px] mt-0 pt-2 border-t border-gray-300"
				>{{ JSON.stringify(json, null, 5) }}
			</pre>
		</div>

		<JsonFormatted v-else 
			:json="json" :label="label" :is-open="formattedOpen" />

	</div>

</template>
