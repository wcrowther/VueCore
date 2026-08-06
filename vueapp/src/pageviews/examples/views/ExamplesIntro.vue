<script setup></script>

<template>

    <div class="">

        <PageTitleBox pageTitle="Examples Intro" />

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

        <div class="mb-5 grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-[10px]">
            <div class="p-3 bg-blue-200">33%</div>
            <div class="p-3 bg-green-200">66%</div>
        </div>

        <div>
            <router-link to="/examples/calendar" linkName="Calendar" class="font-bold hover:opacity-50">
                Link to Calendar
            </router-link>
            <br />

            <router-link to="/examples/checkers" linkName="Checkers" class="font-bold hover:opacity-50">
                Link to Checkers
            </router-link>
            <br />

            <router-link to="/examples/content" linkName="Content" class="font-bold hover:opacity-50">
                Link to Content
            </router-link>
        </div>

    </div>

</template>
