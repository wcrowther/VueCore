
<template>

	<div class="font-bold mt-10 mb-5">BONUS - AccordionControl</div>
    <div class="mb-5">
        This is an example of a fully functioning AccordianControl (utilizing nested AccordianControls), 
        configurable to have either single or multiple open items. By default, the AccordianItem 
        takes a string title but this can be modified by overriding the default title template.
    </div>

    <AccordionControl :multiple="false" :defaultOpen="[0]" class="mt-5 mb-7">

        <AccordionItem title="What is Vue?" class="mb-2">
            Vue is a progressive JavaScript framework.
        </AccordionItem>

        <AccordionItem title="What is Tailwind?" class="mb-2">
            <div class="mb-5">Tailwind is a utility-first CSS framework. </div>
			Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aperiam mollitia nemo ut 
			nesciunt praesentium quasi, tempora sapiente, et consectetur, corporis cumque 
			laudantium quibusdam nihil id minus quaerat quidem beatae voluptatum.
						Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aperiam mollitia nemo ut 
			nesciunt praesentium quasi, tempora sapiente, et consectetur, corporis cumque 
			laudantium quibusdam nihil id minus quaerat quidem beatae voluptatum.

        </AccordionItem>

        <AccordionItem class="mb-2">
            <template #header>
                Why use an accordion? 
                <button @click.stop.prevent="console.log('Test Button clicked.')" 
                    class="border border-blue px-3 py-1 rounded-full">
                    Test Button
                </button>
            </template>
            Accordions organize large content into collapsible sections. This example
            has a customizable header template when the Accordian header needs to have a different design.
        </AccordionItem>

    </AccordionControl>

</template>