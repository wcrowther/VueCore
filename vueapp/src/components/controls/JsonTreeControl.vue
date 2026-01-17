<script setup>

	const props = defineProps(
	{
		json: 		 { type: [Object, Array, String, Number, Boolean, null], required: true },
		label: 		 { type: [Object, Array, String, Number, Boolean, null], default: "" },
		level: 		 { type: Number, default: 0 },
		isOpen:  	 { type: Boolean, default: true },
		showRawJson: { type: Boolean, default: false } 
	})

	const open 			= ref(props.isOpen)
	const childrenRefs 	= ref([]);
	const isObject 		= computed(() => typeof props.json === "object" && props.json !== null)
	const isArray  		= computed(() => Array.isArray(props.json))
	const openAll 		= () =>  open.value = true;  childrenRefs.value.forEach(c => c?.openAll?.())
	const closeAll 		= () =>  open.value = false; childrenRefs.value.forEach(c => c?.closeAll?.())

	defineExpose({ openAll, closeAll });

	const rowClasses = computed(() => [
  		isArray.value || isObject.value ? 'border-t-[3px] border-color-primary' : 'border-t border-gray-300',
  		props.level !== 0 ? 'ml-[10px]' : ''
	])

</script>

<template>

	<div v-if="props.showRawJson" 
		class="py-2 border-y-[3px] border-color-primary">
		<div class="font-bold" @click="open=!open">
			<span v-if="props?.label.length > 0">{{ props.label }} - </span>Raw
		</div>
		<pre v-if="open">{{ JSON.stringify(json,null,5) }}</pre>
	</div>
	<div v-else
		class="bg-transparent mb-1" :class="{'border-b-[3px] border-color-primary' : props.level === 0 }"
		:style="{ marginLeft: level * 10 + 'px' }">
		
		<!-- header -->
		<div @click="open=!open" 
			:class="[rowClasses,'cursor-pointer select-none']">
			<div v-if="isObject" class="py-1 pr-2 inline-block bg-slate-00">
				{{ open ? "▼" : "▶" }}
			</div>
			<div class="font-bold inline-block">
				{{ label }}
				<span v-if="level !== 0" class="p-1 pr-2 inline-block">:</span>
			</div>
			<div v-if="isArray" class="p-1 text-gray-400 inline-block">
				[ Array ]
			</div>
			<div v-else-if="isObject && !isArray" class="p-1 text-gray-400 inline-block">
				{ Object }
			</div>
			<div v-else class="inline-block">
				{{ json }}
			</div>
		</div>

		<!-- children -->
		<div v-if="open && isObject">
			<JsonTreeControl 
				v-for="(value, key) in json" ref="childrenRefs"
				:key="key" :json="value" :label="key" :level="level + 1" />
		</div>
	</div>

</template>

<!--
    <JsonTreeControl :json="jsonTree" :label="jsonName" ref="treeRef" 
        class="border-b-[3px] border-color-primary" />
-->