<script setup>
    const pageTitle  = ref('.Net Notes')
</script>

<template>

    <div class="relative" id="dotnetNotes">

        <div class="z-0 bg-gradient-main h-[500px] absolute top-0 left-0 right-0"></div>

        <div class="relative p-5 pt-5 sm:p-10 sm:pt-5 pb-14">

            <div class="flex justify-between items-center mb-7 relative z-20">
                <h2 class="text-2xl font-display font-bold flex-grow">{{ pageTitle }}</h2>
            </div> 

            <InfoBox class="mb-8">
                This page is still under construction but will contain information on the 
                structure of the Asp.Net Minimal API backend project.
            </InfoBox> 

            <HelpBox class="mb-8">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Soluta unde ipsum nam neque 
                quibusdam iusto inventore accusantium animi vel asperiores, sint necessitatibus magni  
                nesciunt quas nobis doloremque quidem nulla. Commodi.
            </HelpBox> 

        </div>
	
    </div>  

</template>
