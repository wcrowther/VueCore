<script setup></script>

<template>

    <div class="pb-5" id="HomeTwoView">

        <div class="flex flex-wrap gap-y-3 bg-white/50 p-10">

            <!-- <HelpBox>
                Voluptates accusamus repudiandae quam officiis temporibus dicta ipsa iure? 
                Iusto dicta nulla error. Fugit aspernatur odit voluptate, quo libero id minus.
            </HelpBox> -->
            
            <h3 class="font-bold text-lg">Vue / Asp.net Combined Solution</h3>

            <p class="w-full">
                The VueCore solution is structured to establish a clear separation of concerns by isolating
                the frontend (Vue) and backend (Asp.net Minimal Api) into distinct projects. Despite this separation,
                the template integrates the build and publish processes so that both layers can be compiled and deployed
                as a single web application, simplifying hosting while maintaining a modular architecture.
            </p>

            <h4 class="text-base font-bold tracking-wide">Features</h4>

            <ol class="ol-list">
                <li>
                    <span>Utilizes the .slnx Solution format</span> 
                    The solution uses the new human-readable, streanlined .slnx (Xml Solution File) solution format 
                    which simplifies the code and reduces it to 1/3 the size.
                </li>
                <li>
                    <span>Utilizes the .esproj Javascript Project format</span> 
                    The Vuejs project uses the javascript .esproj project format. This allows the code to be nested inside 
                    a Visual Studio Solution as a discreet project instead of just content in a folder.
                </li>
                <li>
                    <span>One-Click Start</span>
                    You can run both projects in <b>Visual Studio 2022</b> using a normal
                    <b>Start</b> command that deploys both projects to a single web site.
                </li>
                    <!-- Possibly add help details
                    <HelpBox class="mt-2" :compact="true">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem necessitatibus non
                    </HelpBox> 
                    -->
                <li>
                    <span>Multiple Starts</span>
                    Alternately, you can elect to edit the C# project in <b>Visual Studio 2022</b> and
                    use <b>VSCode</b> for the <b>Vuejs</b> project, launching them separately for debugging 
                    but combined into a single site for production.
                </li>
                <li>
                    <span>EZ Publish</span>
                    Deploy the C# Asp.net project using the Visual Studio 2022 <b>Publish</b> feature
                    and the Vuejs project is built in Release mode and deployed to a single web site.
                </li>
                 <li>
                    <span>API Documentation</span> 
                    The C# code deploys a Swagger API documentation page that lists all the endpoints
                    and how to call them. This can be configured to not display in Production.
                </li>
            </ol>

        </div>
    
        <div class="flex flex-wrap gap-y-5 bg-[#e9f3fa] p-10">

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
                    boilerplate code by auto-importing Vue and custom components on demand  leaving
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
                    We use Vuelidate to do model validation on an object before is sent to the server.
                </li>
                <li>
                    <span>Help System</span>
                    The system has a global help system that can be None, Info, or Help to provide an easy 
                    way for the user to get as much or as little assistance as they need.
                </li>
            </ol>

        </div>
    
        <div class="flex flex-wrap gap-y-5 bg-white p-10">      

            <h3 class="font-bold text-lg">DotNet Minimal Api Server Backend</h3>

            <p class="w-full">
                The c# Asp.net Minimal API  project is built with simple but powerful examples of
                features that can used to get you started building out your own project.
            </p>

            <h4 class="text-base font-bold tracking-wide">Features</h4>

            <ol class="ol-list">
                <li>
                    <span>SQLite</span>
                    We use Entity Framework accessing a SQLite database but should be
                    easy to convert to another database like SQL server or MySQL.
                </li>
                <li>
                    <span>JWT Tokens</span>
                    Role-based user authentication using JWT tokens in .NET for securing Vue.js API 
                    requests, backed by an editable user table.
                </li>
               <li>
                    <span>PagedList</span>
                    Custom PagedList examples for an example Account entity using Linqkit PredicateBuilder making
                    it easy to customize and add in multiple search conditions.
                </li>
                <li>
                    <span>Attribute Validation</span>
                    Our custom Minimal API model validation uses a simple validation routine to evaluate
                    server model property attributes (this is not available in .NET 9).
                </li>
                <li>
                    <span>Debug Middleware</span>
                    We added a custom middleware debugging component to help troubleshoot incoming HttpContext requests. 
                    It is especially useful for diagnosing model binding and API issues. When the request is an 
                    HttpContext.Request.Post and includes a JSON body, the payload is captured with sensitive values masked.
                </li>
                <li>
                    <span>Server Event Logging</span>
                    File-based logging of events using ILogger with Serilog.
                </li>
                <li>
                    <span>Endpoint Registration</span>
                    Works with a custom simple convention-based registration of endpoints to declutter your Program.cs file.
                </li>
                <li>
                    <span>DI Registration</span>
                    Service registration moved to an external file to simplify your Program.cs.
                </li>
                <li>
                    <span>API Documentation</span>
                    Out of the box Swagger endpoints documentation with authorization and look-and-feel customization.
                </li>

            </ol>

        </div>

    </div>

</template>

<style lang="postcss" scoped>

    .ol-list                { @apply w-full list-decimal pl-8 }
    .ol-list li             { @apply mb-3 }
    .ol-list li span        { @apply text-base font-bold mr-1 text-color-dark-blue }
    .ol-list li span:after  { content: '\00a0 \00a0- ' }

</style>