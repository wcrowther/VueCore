<script setup></script>


<template>
	
	<div class="font-bold mb-5">
		Bonus - UploadControls
		<span class="font-normal italic">(Still in progress) </span>
	</div>

    <div class="mb-5">
        These controls are still in progress. The UploadControl works but the 
		FolderExplorer and FileList controls are still in progress.
    </div>

    <div class="flex flex-wrap gap-3">

        <UploadControl accept="image/*" class="w-full mb-5" />

        <FolderExplorer class="w-full border border-gray-400" />
    </div>

</template>