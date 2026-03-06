<script setup>

	const props = defineProps(
	{
		json: { type: [Object, Array, String, Number, Boolean, null], required: true },
		label: { type: [Object, Array, String, Number, Boolean, null], default: "" },
		level: { type: Number, default: 0 },
		isOpen: { type: Boolean, default: true }
	})

	const emit = defineEmits(['toggle-siblings', 'update:isOpen'])

	const open 			= ref(props.isOpen)
	const childrenRefs 	= ref([])

	watch(() => props.isOpen, (v) => open.value = v)
	watch(open, (v) => emit('update:isOpen', v))

	const isObject 	= computed(() => typeof props.json === "object" && props.json !== null)
	const isArray 	= computed(() => Array.isArray(props.json))

	const openAll = () => 
	{
		open.value = true
		childrenRefs.value.forEach(c => c?.openAll?.())
	}

	const closeAll = () => 
	{
		open.value = false
		childrenRefs.value.forEach(c => c?.closeAll?.())
	}

	const toggleChildren = (shouldOpen) => 
	{
		childrenRefs.value.forEach(child =>
			shouldOpen ? child?.openAll?.() : child?.closeAll?.()
		)
	}

	const onRightClick = (e) => 
	{
		e.preventDefault()
		emit('toggle-siblings', !open.value)
	}

	const rowClasses = computed(() => 
	[
		isArray.value || isObject.value ? 'border-t-[3px] border-color-primary' : 'border-t border-gray-300',
		props.level !== 0 ? 'ml-[10px]' : ''
	])

	const levelHint = computed(() => `level ${props.level}`)

	defineExpose({ openAll, closeAll })

</script>

<template>

	<div :class="['bg-transparent', {'border-b-[3px] select-none border-color-primary': level === 0}]"
		:style="{ marginLeft: level * 10 + 'px' }">

		<div @contextmenu="onRightClick"
  			:class="[rowClasses, 'cursor-pointer flex items-center group']"
			:title="`Right-click to toggle siblings for ${levelHint}`">

			<RotateButton v-if="isObject" v-model="open" icon="material-symbols-light:play-arrow" /> 

			<div class="font-bold p-1 whitespace-break-spaces inline-flex select-all">
				{{ label }}
				<span v-if="level !== 0"
					class="mr-2">:</span>
			</div>

			<div v-if="isArray" 
				class="py-1 text-gray-400">
				[ Array ] 
			</div>

			<div v-else-if="isObject" 
				class="py-1 text-gray-400">
				{ Object } 
			</div>

			<div v-else 
				class="py-1 select-all">
				{{ json }}
			</div>
		</div>

		<!-- children -->
		<div v-if="open && isObject" class="ml-3">
			<JsonFormatted v-for="(value, key) in json" ref="childrenRefs" 
				:key="key" :json="value" :label="key"
				:level="level + 1" @toggle-siblings="toggleChildren" />
		</div>
	</div>

</template>