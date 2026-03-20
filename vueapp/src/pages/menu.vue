<script setup>

	const menuRef = useTemplateRef('menuRef');

	const items = 
	[
		{
			label: 'Edit',
			icon: '✏️',
			action: () => console.log('Edit clicked')
		},
		{
			label: 'Delete',
			icon: '🗑️',
			action: () => console.log('Delete clicked')
		},
		{
			label: 'Disabled Item',
			disabled: true
		}
	]

	const handleRightClick = (e) => 
	{
		menuRef.value.open(e)
	}

</script>

<template>
	<div class="h-64 border flex items-center justify-center" 
		@contextmenu="handleRightClick">
		Right-click anywhere in this box
	</div>

	<ContextMenu ref="menuRef" :items="items" />
</template>