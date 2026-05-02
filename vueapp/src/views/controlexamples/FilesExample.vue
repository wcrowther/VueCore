<script setup></script>


<template>
	
	<div class="text-lg font-bold mb-5">
		File, Folder &amp; Upload Examples
	</div>

    <InfoBox class="mb-7">
        These controls are still in progress. The UploadControl works but the 
		FolderExplorer and FileList controls are still in progress.
    </InfoBox>

    <UploadControl accept="image/*" class="bg-gradient-main mb-3" />

    <div class="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-0 mb-7
        border border-gray-400 bg-white">
        <FolderExplorer class="lg:border-r border-gray-400" />
        <FileExplorer class="" />
    </div>

</template>