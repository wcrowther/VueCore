<template>

	<div class="flex flex-wrap gap-y-5 bg-[#e9f3fa] p-10" id="HomeContentVuejs">

		<h3 class="font-bold text-lg">Vue.js App w/ Vite & Pinia</h3>

		<p class="w-full">
			The Vue.js 3.5 project uses the Composition Api with Vite to build and Pinia as a
			data store. To minimize boilerplate, we use Unplugin for page-based routing, auto-configure Vue imports,
			and your auto-import your custom components. Rather than use a UI import library we build
			simple reusable components for things like list pagers, toasts, modals, form inputs, etc,
			to reduce outside dependencies.
		</p>

		<h4 class="text-base font-bold tracking-wide">Features</h4>

		<ol class="ol-list">
			<li>
				<span>Vite</span>
				Our Vue project uses Vite for our builds, allowing for instantaneous feedback when you make changes
				to a Vue page or component with it's lightning fast HMR (hot model replacement).
			</li>
			<li>
				<span>Page-based Routing</span>
				Uses page-based routing with 'unplugin-vue-router' that auto configures Vue Router based on the
				hierarchy of the src/Pages folder. Our SiteMap component dynamically shows the site layout.
			</li>
			<li>
				<span>SPA Site Navigation</span>
				The site dynamically loads nested components without page reload and provides two levels of
				tabbed navigation.
			</li>
			<li>
				<span>Removing Boilerplate Code</span>
				We use 'unplugin-vue-components' and 'unplugin-auto-import' to remove
				boilerplate code by auto-importing Vue and custom components on demand leaving
				the code to more succinctly express the logic.
			</li>
			<li>
				<span>Custom Components</span>
				Rather than focusing on an external UI library, we have many example custom components for
				you to build on such as form inputs (w/ validation), modal and confirmation controls,
				layout controls, and a flexible icon control.
			</li>
			<li>
				<span>List Pager w/ Debugger</span>
				For lists, we have an integrated list pager (with debugger) with an advanced search feature.
				For mobile, the user can easily switch between list or detail views.
			</li>
			<li>
				<span>Search / Advanced Search</span>
				The integrated search allows the user to use multiple search terms in a single query and
				further narrow their search with additional parameters in a modal window.
			</li>
			<li>
				<span>TailwindCss</span>
				The site is build using TailwindCss so that you can look at a component and see how it is
				styled but also utilizes css variables so that you can switch out designs on the fly. Components
				can have there own isolated classes when that is required.
			</li>
			<li>
				<span>Adaptive Mobile / Web Design</span>
				The site is designe to be adaptive for the web at higher resolutions and for mobile when space
				is limited. The design features a left collapsible menu area for displaying lists.
			</li>
			<li>
				<span>Keyboard Shortcuts</span>
				For maximum productivity on the web, contextual keyboard shortcuts are integrated into the UI.
				Ctrl + S to save. Esc to hide left navigation. Arrow keys to move the prev / next record, etc.
			</li>
			<li>
				<span>Pinia Datastores</span>
				We use Pinia for global state management and to access services and data stores. This allows
				flexibility for cross-cutting concerns and components to be loosely coupled.
			</li>
			<li>
				<span>Custom API</span>
				Our simple custom setup for API access manages JWT tokens / Cookies and return message with
				built-in toasts for when errors occur.
			</li>
			<li>
				<span>VueUse</span>
				We utilize 'VueUse' to extend Vue functionality for local storage, clipboard copying,
				app screen size, etc. and it contains many other useful capabilities.
			</li>
			<li>
				<span>Local Storage</span>
				Utilizing local storage in our datastores it is very easy to persist user preferences.
			</li>
			<li>
				<span>Model Validation w/ Vuelidate</span>
				We use Vuelidate to do model validation on an object before it is sent to the server.
			</li>
			<li>
				<span>Help System</span>
				The system has a global help system that can be
				<b>None</b>, <b>Info</b>, or <b>Help</b> to provide an easy
				way for the user to get as much or as little assistance as they need.
			</li>
		</ol>

	</div>

</template>

<style lang="postcss" scoped>

    .ol-list                { @apply w-full list-decimal pl-8 }
    .ol-list li             { @apply mb-3 }
    .ol-list li span        { @apply text-base font-bold mr-1 text-color-dark-blue }
    .ol-list li span:after  { content: '\00a0 \00a0- ' }

</style>