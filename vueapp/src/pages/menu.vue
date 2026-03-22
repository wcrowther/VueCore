<script setup>

	const menuRef = ref(null)

	const files = ref([
		{ id: 1, name: 'file1.txt', locked: false },
		{ id: 2, name: 'file2.txt', locked: true },
		{ id: 3, name: 'file3.txt', locked: false },
		{ id: 4, name: 'file4.txt', locked: false }
	])

	// selection state
	const selected = ref([])
	const activeFile = ref(null)

	// helpers
	function isSelected(file) 
	{
		return selected.value.some(f => f.id === file.id)
	}

	// click selection (supports ctrl/cmd multi-select)
	function onLeftClick(e, file) 
	{
		if (e.ctrlKey || e.metaKey) 
		{
			if (isSelected(file)) 
			{
				selected.value = selected.value.filter(f => f.id !== file.id)
			} 
			else 
			{
				selected.value.push(file)
			}
		} 
		else 
		{
			selected.value = [file]
		}

		activeFile.value = file
	}

	// right-click behavior
	function onRightClick(e, file) 
	{
		// if not already selected → select only this file
		if (!isSelected(file)) 
		{
			selected.value = [file]
		}

		activeFile.value = file

		menuRef.value.open(e, 
		{
			file,
			selected: selected.value
		})
	}

	// 🔥 Dynamic menu based on selection
	const menuItems = computed(() => 
	{
		const count = selected.value.length
		const hasLocked = selected.value.some(f => f.locked)

		return [
			{
				label: count === 1 ? 'Open' : `Open ${count} Files`,
				action: ({ selected }) => { console.log('Open:', selected) }
			},
			{
				label: 'Rename',
				disabled: count !== 1,
				action: ({ file }) => { console.log('Rename:', file) }
			},
			{
				label: 'Delete',
				disabled: hasLocked,
				action: ({ selected }) => { console.log('Delete:', selected) }
			},
			{
				label: 'Properties',
				action: ({ file }) => { console.log('Properties:', `${file.name} (${file.id}) locked: ${file.locked}`) }
			}
		]
	})
</script>

<template>
	<div class="w-80 border rounded-lg overflow-hidden">
		<div v-for="file in files" :key="file.id" 
			@click="(e) => onLeftClick(e, file)"
			@contextmenu="(e) => onRightClick(e, file)"
			class="px-4 py-2 cursor-pointer select-none flex justify-between" 
			:class="[isSelected(file)? 'bg-blue-100': 'hover:bg-gray-100']">

			<span>{{ file.name }}</span>
			<span v-if="file.locked" class="text-xs text-gray-400">🔒</span>
		</div>
	</div>

	<ContextMenu ref="menuRef" :items="menuItems" />

	<div class="mt-3">
		<span>Selected:</span>
		{{ selected.map(m => m.id).join(', ') }}
	</div>	
</template>