<script setup>

    const homeTitle     = ref("Welcome to VueCore Dev Starter")

</script>

<template>

    <div class="px-5 pt-5 pb-0 grow leading-relaxed h-full bg-gradient-main 
        sm:px-10 sm:pt-5" id="HomeOneView">

        <div class="flex flex-wrap gap-5 mb-7">
            <div class="w-full flex justify-between items-center">
                <h2 class="text-2xl font-display font-bold flex-grow">{{ homeTitle }}</h2>
                <span class="flex flex-wrap gap-1.5"> 
                    <!-- <button  class="btn-primary" @click="confirmSave">Save</button> -->
                </span>
            </div>
        </div> 

        <div class="flex flex-wrap gap-y-5">

            <div class="pr-5 w-2/3 grow">
                <p class="mb-8 text-lg">
                    <b>VueCore</b> is an educational open source project to promote using <b>Vue.js</b> with a
                    <b>DotNet</b> backend to create a simple yet powerful application environment. 
                    We integrated a <b>VueJs </b> SPA project (.esproj) built using <b>Vite</b> with a 
                    separate backend <b>.Net Minimal API </b> project so that it can be easily built into
                    a single deployment with a simple Visual Studio <b>Publish</b>.
                </p> 
                <p class="mb-3">    
                    We've included real-world examples demonstrating how to integrate client-side <b>Pinia</b> stores using 
                    <b>JWT tokens</b> for secure API access to your .NET backend. The client project features page-based 
                    routing and automatic component dependency imports.
                </p>
                <p class="mb-3">
                    Rather than relying on third-party UI libraries, we focus on building clean, powerful components that 
                    reflect your <b>code intent</b> and are easy to adapt to your challenges. This project isn’t meant to be 
                    the definitive way to build an app — just a solid starting point.
                </p>
                <p class="mb-3">
                    You'll find a number of innovative techniques throughout both the <b>Vue.js</b> and <b>.NET</b> 
                    Minimal API projects. We welcome contributions and suggestions as the project evolves.
                </p>
                <HelpBox :pin="true" class="mt-5">
                    This application includes an example of a progressive, inline help system with <b>Help</b> styled like this block. 
                    The other levels are <b>None</b> or <b>Info</b> which can be toggled through using the button on the right of the NavBar.
                </HelpBox>
            </div>

            <HomeSidebarView />

        </div>

    </div>  

</template>
