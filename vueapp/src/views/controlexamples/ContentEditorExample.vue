<script setup>

	const imageData = ref(null)

</script>

<template>

	<div class="mb-10">

		<div class="text-lg font-bold mb-5">Content Editor</div>
	
		<div class="flex flex-wrap justify-between mt-10 mb-5">


			<InfoBox>
				A full-featured content editing modal combining a Markdown editor, file manager, and image editor in one tabbed interface.
				Opens in a clean overlay — keeping your page uncluttered while giving users everything they need to manage content.
        	</InfoBox>

			<ContentEditor height="90%" width="90%" />

		</div>


	</div>

</template>