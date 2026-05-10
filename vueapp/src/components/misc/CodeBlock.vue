<script setup>

	import { useClipboard } from '@vueuse/core'

	const props = defineProps(
	{
		codeContent: 		{ type: String,  required: true },
		language: 			{ type: String,  default: 'Code' },
		showLineNumbers: 	{ type: Boolean, default: false },
		trimEmptyLine: 		{ type: Boolean, default: true }, 
		showDark: 			{ type: Boolean, default: false }
	});

	const { copy, copied: copiedToClipboard, isSupported } = useClipboard({ legacy: true })
	const displayContent = computed(() => 
	{
		let content = props.codeContent
		if (props.trimEmptyLine) 
		{
			const firstNewline = content.indexOf('\n')
			if (firstNewline !== -1 && content.slice(0, firstNewline).trim() === '') 
			{
				content = content.slice(firstNewline + 1)
			}
		}
		return content
	})
	const lineCount 		= computed(() => displayContent.value.split('\n').length)

	// =================================================================================

	const wrapperClass		= computed(() => props.showDark ? 'bg-slate-900 border border-slate-800' : 'bg-gray-100 border border-gray-300')
	const headerClass		= computed(() => props.showDark ? 'bg-slate-800/50 border-slate-600' : 'bg-gray-200 border-gray-300')
	const languageClass		= computed(() => props.showDark ? 'text-slate-400' : 'text-gray-500')
	const lineNumberClass	= computed(() => props.showDark ? 'text-slate-500 border-slate-600' : 'text-gray-400 border-gray-300')
	const displayClass		= computed(() => props.showDark ? 'text-slate-300' : 'text-gray-800')
	const copiedClass		= computed(() => props.copied   ? 'bg-emerald-500/20 text-emerald-600' : 
								   		 	 props.showDark ? 'text-slate-400 hover:bg-slate-700 hover:text-slate-100'
								  			 				: 'text-gray-500 hover:bg-gray-300 hover:text-gray-800')
</script>

<template>
	<div v-if="isSupported"
		:class="['group relative my-4 rounded-lg overflow-hidden', wrapperClass]">

		<!-- Header -->
		<div :class="['flex items-center justify-between px-4 py-1 border-b', headerClass]">

			<span :class="['text-xs font-bold uppercase tracking-widest', languageClass]">
				{{ language }}
			</span>

			<button @click="copy(codeContent)" 
				:class="['flex items-center rounded-md py-1 text-xs font-medium transition-all duration-200', copiedClass]">
			
				<span v-if="copiedToClipboard" class="min-w-12 text-right font-bold text-blue">
					{{ 'Copied!'}}
				</span>
				<span v-else class="min-w-12 text-right">
					{{ 'Copy' }}
				</span>

				<IconSymbol v-if="copiedToClipboard" 
					title="Code Copied to Clipboard" width="18px" 
					class="text-blue ml-2 mb-[2px]" icon="heroicons:check-circle" />
				<IconSymbol v-else
					title="Copy Code to Clipboard" width="18px" 
					class="text-color-dark-gray ml-2 mb-[2px]" icon="heroicons:clipboard-document" />
					
			</button>
		</div>

		<!-- Code Block -->
		<div class="flex overflow-x-auto custom-scrollbar p-2 font-mono text-sm leading-6">

			<!-- Line Numbers Column -->
			<div v-if="showLineNumbers"
				:class="['mr-4 flex flex-col text-right select-none border-r pr-4', lineNumberClass]">
				<span v-for="n in lineCount" :key="n">{{ n }}</span>
			</div>

			<!-- Code Column -->
			<pre :class="displayClass"><code>{{ displayContent }}</code></pre>

		</div>
	</div>

	<div v-else 
		class="rounded-lg border border-red-900/20 bg-red-950/50 p-4 text-red-400 text-sm">
		Browser clipboard access restricted.
	</div>
</template>

<style scoped>
	.custom-scrollbar::-webkit-scrollbar { height: 8px; }
	.custom-scrollbar::-webkit-scrollbar-thumb { 
		background: theme('colors.slate.700');
		border-radius: 4px;
	}
	pre { margin: 0; }
</style>


<!-- Example: 


-->
