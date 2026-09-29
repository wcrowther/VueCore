<script setup>

    import '@/styles/markdown.css'
	import FilesFolders_md 	            from '@/markdown/FilesFolders.md'
	import FilesFoldersHierarchy_md 	from '@/markdown/FilesFoldersHierarchy.md'

</script>

<template>

    <div class="relative" id="vueNotes">

		<BackGradation />

        <div class="relative p-5 pt-5 sm:p-10 sm:pt-5 pb-14">

            <PageTitleBox pageTitle="VueJs Notes" />

            <InfoBox>
                This application is built on <b>Vue 3.5</b>, using the <b>Composition API</b> with
                <code>&lt;script setup&gt;</code> throughout. Instead of spreading a component's logic across
                <code>data</code>, <code>methods</code>, and <code>computed</code> options, the Composition API lets
                related state, computed values, and functions be grouped together and extracted into reusable
                <b>composables</b> (see <code>/src/composables</code>). Shared, cross-component state lives in
                <b>Pinia</b> stores (<code>/src/stores</code>), and routing is file-based via
                <code>unplugin-vue-router</code>, which turns the folder structure under <code>/src/pages</code>
                into the app's routes automatically.
                <br /><br />
                All of this is styled with <b>Tailwind CSS</b>, a utility-first CSS framework where components are
                styled by composing small, single-purpose classes (like <code>flex</code>, <code>p-5</code>,
                <code>text-lg</code>) directly in the markup rather than writing separate CSS files. Tailwind scans
                the source files, generates only the CSS actually used, and is configured in
                <code>tailwind.config.js</code> and processed through <code>postcss.config.js</code>.
                <br /><br />
                Tying it together is <b>Vite</b>, the build tool and dev server that compiles <code>.vue</code>
                files, runs Tailwind's PostCSS pipeline, enables hot-module replacement during development, and
                bundles everything into the optimized <code>/dist</code> folder for production. Vite itself runs on
                <b>Node.js</b>, the JavaScript runtime that executes build tooling outside the browser, while
                <b>npm</b> (Node Package Manager) installs and manages every dependency listed in
                <code>package.json</code>&mdash;Vue, Vite, Tailwind, Pinia, and the rest&mdash;into
                <code>node_modules</code>, and exposes the scripts (<code>npm run dev</code>,
                <code>npm run build</code>) used to start and build the project. The remainder of this page
                documents the files and folders in the Vue/Vite project to explain what they're used for and why.
            </InfoBox> 

            <HelpBox class="mb-8">
                The content for this page resides in two Markdwon (.md) files stored in the /markdown 
                folder to show how referenced .md files can be embedded. Look for references to .md and
                Markdown in the vite.conig.mjs file to enable this capability.
            </HelpBox> 
          
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">

                <FilesFolders_md class="markdown xl:col-span-2" />

                <div class="bg-black text-white">
                    <div class="p-5 pb-0">
                        <div class="text-lg tracking-wide font-bold mb-5">
                            Vue Folders and Files Hierarchy
                        </div>
                        <hr class="border-t !border-white" />
                    </div>
                    <FilesFoldersHierarchy_md class="markdown " />
                </div>
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