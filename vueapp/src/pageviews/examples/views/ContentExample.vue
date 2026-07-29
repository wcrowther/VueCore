<script setup></script>


<template> 
	
	<PageTitleBox pageTitle="Content Examples">
		<ContentEditor height="90%" width="90%" />
	</PageTitleBox>

    <InfoBox>
        This section demonstrates a complete content workflow: upload files,
		browse folders, and open files in the explorer panel. The <b>ContentEditor</b>
		button in the header provides a popup editing experience as an alternative
		presentation, so you can edit content in a larger focused view without
		leaving this page layout.
    </InfoBox>

	<HelpBox>
		<b>Upload tips:</b> Drag and drop files onto the upload area, or click to browse.
		This example accepts images and markdown files and saves them into a folder on the server.
		<br /><br />
		<b>Browse flow:</b> Select a folder in the left panel, then choose a file in the
		right panel to inspect or edit its content.
		<br /><br />
		<b>Two file views:</b> The left <b>FolderExplorer</b> view shows the folder hierarchy
		for navigation, while the right <b>FileExplorer</b> view shows files and content for
		the selected folder. On smaller screens these views stack vertically, but the flow
		remains the same: pick a folder first, then work with its files.
	</HelpBox>

    <UploadControl accept="image/*,.md" class="bg-gradient-main mb-3" />

    <div class="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-0 mb-7
        border border-gray-400 bg-white">
        <FolderExplorer class="lg:border-r border-gray-400" />
        <FileExplorer class="border-t border-gray-400 lg:border-none" />
    </div>

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