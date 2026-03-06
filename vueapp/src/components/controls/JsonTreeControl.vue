<script setup>

	const toastStore = useToastStore()

	const props = defineProps(
	{
		json: { type: [Object, Array, String, Number, Boolean, null], required: true },
		label: { type: [Object, Array, String, Number, Boolean, null], default: "" },
		isOpen: { type: Boolean, default: true }
	})
	
    const { copy }   = useClipboard()

	const formattedOpen = ref(props.isOpen)
	watch(() => props.isOpen, (v) => formattedOpen.value = v)

	const showRawJson 	= ref(false)	
	const isRawOpen 	= ref(false)	
	const toggleView 	= () =>  showRawJson.value = !showRawJson.value

	const jsonToClipboard = () => 
    { 
        copy(JSON.stringify(props.json, null, 5)); 
        toastStore.showInfo('Json copied to the clipboard.'); 
    }

</script>

<template>

	<div class="relative">

		<div class="absolute right-0 top-1 select-none">

			<IconSymbol v-if="showRawJson" 
				@click="toggleView" title="Raw Json"
				width="24px" class="text-color-dark-gray" 
				icon="heroicons:code-bracket" />
			<IconSymbol v-else 
				@click="toggleView" title="Formatted Json"
				width="24px" class="text-color-dark-gray" 
				icon="heroicons:bars-3" />

			<IconSymbol @click="jsonToClipboard" title="Copy Json to Clipboard" 
				width="20px" class="text-color-dark-gray ml-2 mb-[2px]" 
				icon="heroicons:clipboard-document" />
		</div>

		<div v-if="showRawJson" class="border-b-[3px] border-b-color-primary">
			<div class="bg-transparent border-t-[3px] font-bold select-none flex items-center border-color-primary">
				<RotateButton v-model="isRawOpen" icon="material-symbols-light:play-arrow" />
				<div class="p-1">{{ label }}
					<span class="text-gray-400 ml-1">- Raw Json View</span>
				</div> 
			</div>
			
			<pre v-show="isRawOpen" class="ml-[10px] mt-0 pt-2 border-t border-t-gray-300 "
				>{{ JSON.stringify(json, null, 5) }}
			</pre>
		</div>

		<JsonFormatted v-else 
			:json="json" :label="label" v-model:isOpen="formattedOpen" />

	</div>

</template>
