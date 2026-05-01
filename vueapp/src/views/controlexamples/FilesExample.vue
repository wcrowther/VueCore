<script setup></script>


<template>
	
	<div class="text-lg font-bold mb-5">
		File, Folder &amp; Upload Examples
	</div>

    <InfoBox class="mb-7">
        These controls are still in progress. The UploadControl works but the 
		FolderExplorer and FileList controls are still in progress.
    </InfoBox>

    <div class="flex flex-wrap gap-3">

        <UploadControl accept="image/*" class="w-full mb-1 bg-gradient-main" />

        <FolderExplorer class="w-full border border-gray-400 mb-7" 
            v-slot="{ selectedPath }">
            <FileExplorer :selectedPath />
        </FolderExplorer>
    </div>

</template>