<template>

	<div class="flex flex-wrap gap-y-3 bg-white/50 p-10" id="HomeContentSolution">
       
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

        <HelpBox>
            Additional help information - add here.
        </HelpBox>

    </div>

</template>

<style lang="postcss" scoped>

    .ol-list                { @apply w-full list-decimal pl-8 }
    .ol-list li             { @apply mb-3 }
    .ol-list li span        { @apply text-base font-bold mr-1 text-color-dark-blue }
    .ol-list li span:after  { content: '\00a0 \00a0- ' }

</style>