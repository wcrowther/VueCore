<script setup>

	const toastStore = useToastStore()
	const { copy }   = useClipboard()

	const isOpen = defineModel('isOpen', { type: Boolean, default: false })

	const props = defineProps(
	{
		json: { type: [Object, Array, String, Number, Boolean, null], required: true },
		label: { type: [Object, Array, String, Number, Boolean, null], default: "" },
	})
	
	const showRawJson 	= ref(false)	

	const toggleView 	  = () =>  showRawJson.value = !showRawJson.value
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
				@click.stop="toggleView" title="Raw Json"
				width="24px" class="text-color-dark-gray" 
				icon="heroicons:code-bracket" />

			<IconSymbol v-else 
				@click.stop="toggleView" title="Formatted Json"
				width="24px" class="text-color-dark-gray" 
				icon="heroicons:bars-3" />

			<IconSymbol @click.stop="jsonToClipboard" title="Copy Json to Clipboard" 
				width="20px" class="text-color-dark-gray ml-2 mb-[2px]" 
				icon="heroicons:clipboard-document" />
		</div>

		<div v-if="showRawJson" @click.stop.prevent="isOpen=!isOpen"
			class="border-b-[3px] border-b-color-primary">

			<div class="bg-transparent border-t-[3px] font-bold select-none flex items-center border-color-primary">
				<RotateButton v-model="isOpen" :noClick="true" icon="material-symbols-light:play-arrow" />
				<div class="p-1">{{ label }}
					<span class="text-gray-400 ml-1 hidden sm:inline">- Raw Json View</span>
				</div> 
			</div>
			
			<pre v-show="isOpen" class="ml-[10px] mt-0 pt-2 border-t border-t-gray-300 "
				>{{ JSON.stringify(json, null, 5) }}
			</pre>
		</div>

		<JsonFormatted v-else 
			:json="json" :label="label" v-model:isOpen="isOpen" />

	</div>

</template>

<!-- Usage: 

    <JsonTreeControl v-if="showJsonEntities" :json="user" class="w-full" 
        label="User Detail Json" :isOpen="false" />

	<JsonTreeControl :label="jsonSource.name" :json="jsonSource.json" :showRawJson="false" />
-->
