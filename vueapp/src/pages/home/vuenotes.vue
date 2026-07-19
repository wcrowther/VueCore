<script setup>

    import '@/styles/markdown.css'
	import FilesFolders_md 	            from '@/markdown/FilesFolders.md'
	import FilesFoldersHierarchy_md 	from '@/markdown/FilesFoldersHierarchy.md'

</script>

<template>

    <div class="relative" id="vueNotes">

		<BackGradation />

        <div class="relative p-5 pt-5 sm:p-10 sm:pt-5 pb-14">

            <PageTitleBox pageTitle="Vue Notes" />

            <InfoBox>
                This page is to provide information on all the files and folders in the Vue/Vite 
                project to provide guidance on what they are used for and why.
            </InfoBox> 

            <HelpBox class="mb-8">
                The content for this page resides in two Markdwon (.md) files stored in the /markdown 
                folder to show how referenced .md files can be embedded. Look for references to .md and
                Markdown in the vite.conig.mjs file to enable this capability.
            </HelpBox> 
          
            <div class="flex gap-5 min-h-[400px] relative z-20">
                <FilesFolders_md class="markdown !max-w-none w-2/3 lg:w-3/4" />
                <FilesFoldersHierarchy_md class="markdown !max-w-none w-1/3 lg:w-1/4" />
            </div>
        </div>
	
    </div>  

</template>


<style>

    hr {
        border-color: gray !important;
    }
    /* .prose pre { @apply bg-slate } */

</style>