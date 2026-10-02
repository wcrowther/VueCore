<script setup>

    import '@/styles/markdown.css'
	import DotNetOverview_md 	from '@/markdown/DotNetOverview.md'
	import DotNetHierarchy_md 	from '@/markdown/DotNetHierarchy.md'

</script>

<template>

    <div class="relative" id="dotnetNotes">

        <BackGradation />

        <div class="@container relative p-5 pt-5 sm:p-10 sm:pt-5 pb-14">

            <PageTitleBox pageTitle=".Net Notes" />

            <InfoBox>
                VueCore's backend is a plain <b>ASP.NET Core Minimal API</b> project targeting <b>.NET 9</b>,
                split into four separate class libraries so that concerns stay isolated: an API host, a
                business-logic layer, a data-access layer, and a shared helpers/models library. All four are
                referenced from the solution root (<code>VueCore.slnx</code>) alongside the <code>vueapp</code>
                frontend, and are restored/built with the normal <code>dotnet restore</code> /
                <code>dotnet build</code> / <code>dotnet publish</code> CLI commands or from Visual Studio.
                <br /><br />
                The API host, <b>coreApi</b>, is the only project that runs as a web server&mdash;it wires up
                dependency injection, authentication, SignalR, Swagger, and logging in <code>Program.cs</code>,
                then exposes convention-registered Minimal API endpoint groups (Accounts, Users, Content,
                Messages, Authentication) under <code>/Endpoints</code>. Authentication uses cookie-carried
                <b>JWT</b> tokens (<code>HttpOnly</code>, <code>Secure</code>), validated by the standard
                <code>Microsoft.AspNetCore.Authentication.JwtBearer</code> middleware, with an editable
                <code>Users</code> table backing role-based authorization.
                <br /><br />
                Underneath the host, <b>coreLogic</b> holds the business rules: <code>Managers</code> implement
                one interface each (e.g. <code>IAccountManager</code> &rarr; <code>AccountManager</code>) and are
                what the endpoints call into, while <code>Adapters</code> translate between EF Core entities
                (from <code>coreData</code>) and the view models (<code>Models</code>) returned to the Vue
                client. <b>coreData</b> is the <b>Entity Framework Core</b> layer&mdash;a single
                <code>DataContext</code> (SQLite by default, easily swapped for SQL Server/MySQL), one
                <code>Repo</code> class per entity implementing an interface, and a <code>Migrations</code>
                folder of EF Core migrations that can be applied with <code>Update-Database</code>.
                <b>coreLibrary</b> sits below both and holds small, dependency-free helpers and DTOs
                (<code>PagedList</code>, <code>Pager</code>, <code>Search</code>, <code>Returns</code>,
                <code>Error</code>) that are reused across the other three projects without pulling in EF Core
                or ASP.NET references.
                <br /><br />
                Because <code>coreApi.csproj</code> holds a <code>ProjectReference</code> to
                <code>vueapp.esproj</code>, a normal Visual Studio <b>Publish</b> (or
                <code>dotnet publish coreApi</code>) also runs the Vue app's production build and copies its
                <code>dist</code> output into the published site, so the SPA and the Minimal API deploy together
                as one web application (<code>app.MapFallbackToFile("/index.html")</code> serves the SPA for any
                unmatched route). The remainder of this page walks through what each of the four backend
                projects and the solution-level files are used for.
            </InfoBox> 

            <HelpBox class="mb-8">
                The content for this page resides in two Markdown (.md) files stored in the /markdown
                folder to show how referenced .md files can be embedded. Look for references to .md and
                Markdown in the vite.config.mjs file to enable this capability.
            </HelpBox> 

            <div class="grid grid-cols-1 @3xl:grid-cols-2 @6xl:grid-cols-3 gap-10">

                <DotNetOverview_md class="markdown @6xl:col-span-2" />

                <div class="bg-black text-white">
                    <div class="p-5 pb-0">
                        <div class="text-lg tracking-wide font-bold mb-5">
                            DotNet Folders and Files Hierarchy
                        </div>
                        <hr class="border-t !border-white" />
                    </div>
                    <DotNetHierarchy_md class="markdown " />
                </div>
            </div>
        </div>
	
    </div>  

</template>


<style>

    hr {
        border-color: gray !important;
    }

</style>
