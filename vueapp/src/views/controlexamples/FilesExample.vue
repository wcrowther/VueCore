<script setup></script>


<template> 
	
	<ContentEditorExample />
	
	<div class="text-lg font-bold mb-5">
		File, Folder &amp; Upload Examples
	</div>

    <InfoBox class="mb-7">
        These controls are still in progress. The UploadControl works but the 
		FolderExplorer and FileList controls are still in progress.
    </InfoBox>

    <UploadControl accept="image/*,.md" class="bg-gradient-main mb-3" />

    <div class="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-0 mb-7
        border border-gray-400 bg-white">
        <FolderExplorer class="lg:border-r border-gray-400" />
        <FileExplorer class="border-t border-gray-400 lg:border-none" />
    </div>

    <ImageCropperExample />

</template>

<!-- Usage:

	// Images only (file picker + drag-and-drop)
	<UploadControl accept="image/*" />

	// Images and markdown files
	<UploadControl accept="image/*,.md" />

	// Explicit types with custom message
	<UploadControl accept=".jpg,.jpeg,.png,.gif,.webp" uploadMessage="Drag images here or click to upload" />

	// Folder browser + file list side by side
	<div class="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-0 border border-gray-400 bg-white">
		<FolderExplorer class="lg:border-r border-gray-400" />
		<FileExplorer />
	</div>

-->