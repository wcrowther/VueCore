<script setup>

	// import { useElementSize } from '@vueuse/core'
    // const parentBox 	= useTemplateRef('parentBox')
	// const { width } 	= useElementSize(parentBox)

</script>

<template>

    <div class="">

        <PageTitleBox pageTitle="Intro To The Examples" />

        <InfoBox>
            These examples are designed as practical starting points you can copy and adapt, with real patterns for interaction,
            state flow, keyboard behavior, and composable-based logic. They are also useful when you want more control than a typical
            control library gives you, because the component source is yours to inspect and evolve. With modern AI coding assistance,
            full component ownership is much easier than it was in the past, so customizing behavior, refactoring structure, and
            keeping long-term maintainability in your own codebase is more realistic for everyday teams.
        </InfoBox>

        <HelpBox>
            <div class="mb-5">
                <b>Examples List Quick navigation:</b> Type in search to filter by display name or example key,
                then click a row to load that example. As with other list search controls, multiple filters can be applied simultaneously.
            </div>
            <div class="mb-5">
                <b>Keyboard shortcuts:</b> Use <b>↑ / ↓</b> to move through examples,
                <b>Page Up / Page Down</b> to jump by page, and <b>Home</b> to focus the search box.
            </div>
            <div class="mb-5">
                <b>Keyboard icon</b> (<b>record-keys</b>): click to enable or disable list shortcuts.
                When shortcuts are disabled, the icon turns <b>orange</b>. Some control examples automatically
                toggle keyboard shortcuts off when the mouse cursor is over that control.
            </div>
            <div>
                <b>Fullscreen icon</b> (<b>arrows-pointing-out</b>): opens the selected example in fullscreen
                for easier viewing. Click the X in the top-right corner or press <b>Esc</b> to exit.
            </div>
        </HelpBox>

        <div class="mt-8 mb-2">
            <h2 class="text-xl font-bold mb-6 border-b-2 border-color-blue-gray pb-2">Featured Examples</h2>

            <!-- Inputs -->
            <div class="mb-8 overflow-hidden">

                <router-link to="/examples/inputs" class="text-color-dark-blue hover:opacity-60">
                    <img src="/images/inputs example.png"
                        alt="Inputs preview" class="float-right ml-6 mb-3 w-[180px] rounded border border-gray-300 shadow-sm" />
                </router-link>

                <h3 class="font-bold text-base mb-2">
                    <router-link to="/examples/inputs" class="text-color-dark-blue hover:opacity-60">
                        Inputs
                    </router-link>
                </h3>

                <p class="text-sm leading-relaxed text-gray-700">
                    A comprehensive showcase of form input controls — text fields, dropdowns, checkboxes,
                    date pickers, and more — each wired with real validation and composable-based state.
                    Rather than wrapping a third-party library, the source is entirely yours to read,
                    modify, and evolve. This makes it straightforward to add custom validation rules,
                    adjust keyboard behavior, or hook directly into your own stores without fighting
                    an abstraction you didn't write.
                </p>

            </div>

            <!-- Content -->
            <div class="mb-8 after:content-[''] after:block after:clear-both">
            
                <router-link to="/examples/content" class="text-color-dark-blue hover:opacity-60">
                    <img src="/images/content example crop.png"
                        alt="Content preview" class="float-left mr-6 mb-3 w-[180px] rounded border border-gray-300 shadow-sm" />
                </router-link>

                <h3 class="font-bold text-base mb-2">
                    <router-link to="/examples/content" class="text-color-dark-blue hover:opacity-60">
                        Content
                    </router-link>
                </h3>

                <p class="text-sm leading-relaxed text-gray-700">
                    Covers image management features: uploading files, organizing them across folders,
                    moving images between folders, and switching between grid and list views. The
                    interface is designed to feel familiar — browse your content structure, select
                    images, and reorganize without friction. A Markdown-based Content Editor is also
                    part of this example, letting you write on one side and see formatted output live
                    on the other — though that portion is still in development and subject to change.
                </p>
                
            </div>

            <!-- Checkers -->
            <div class="mb-8 overflow-hidden">

                <router-link to="/examples/checkers" class="text-color-dark-blue hover:opacity-60">
                    <img src="/images/checkers example crop.png" 
                        alt="Checkers preview" class="float-right ml-6 mb-3 w-[180px] rounded border border-gray-300 shadow-sm" />
                </router-link>

                <h3 class="font-bold text-base mb-2">
                    <router-link to="/examples/checkers" class="text-color-dark-blue hover:opacity-60">
                        Checkers
                    </router-link>
                </h3>

                <p class="text-sm leading-relaxed text-gray-700">
                    A fully playable Checkers game built entirely with Vue reactive state — no canvas,
                    no game engine, just components and computed logic. It's a practical illustration
                    of how far plain reactivity can take you: turn management, valid-move highlighting,
                    jump chaining, and win detection all driven by plain data. If you've ever wondered
                    how to model non-trivial interaction in Vue without reaching for external state
                    libraries, this example is worth a close read.
                </p>

            </div>
        </div>

	    <!-- CONTENT SIZING INSTEAD OF WINDOW WIDTH 
        <div class="mb-3 font-normal text-sm">ParentBox width: {{ `${Math.trunc(width)}px` }}</div>      

        <div ref="parentBox" 
            class="@container p-3 border border-red mb-5">
            <div class="grid grid-cols-1 @md:grid-cols-[1fr_2fr] gap-[10px]">
                <div class="p-3 bg-blue-200">33%</div>
                <div class="p-3 bg-green-200">66%</div>
            </div>
        </div> 
        -->

    </div>

</template>
