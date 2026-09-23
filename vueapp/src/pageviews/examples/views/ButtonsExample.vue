<script setup>

    // OTHER BUTTON DEMOS
    const boolOneValue      = ref(false)
    const boolTwoValue      = ref(false)
    const boolThreeValue    = ref(false)
    const switchOneValue    = ref(false)
    const switchTwoValue    = ref(false)
    const switchThreeValue  = ref(false)
    const rotateOne         = ref(false)
    const rotateTwo         = ref(false)

</script>

<template>

    <div class="w-full">

        <PageTitleBox pageTitle="Button Examples" />

        <InfoBox>
            The <b>/components/buttons</b> folder has a set of small, focused button components covering 
            styled actions, boolean toggles, and array navigation. Each demo below is labeled with what it's 
            used for - the <b>ListButton</b> demos live in the sidebar to the right.
        </InfoBox>

        <HelpBox>
            <div class="mb-3">
                <b>Right-click to reverse:</b> <b>ListButton</b> and <b>InfoButton</b> both bind their 
                right-click to step backward, so you never need a separate "previous" button.
            </div>
            <div class="mb-3">
                <b>InfoButton drives this page:</b> the demo below is the real, global help-level toggle - 
                click it (or right-click it) and watch this <b>HelpBox</b> and the <b>InfoBox</b> above 
                react, since both are just <code>v-if="infoLevel > ..."</code> wrappers.
            </div>
            <div>
                <b>Container-aware capsule:</b> the bordered row below uses the <b>v-container-width</b> 
                debug directive (see <code>@/helpers/containerWidth</code>) to show which Tailwind 
                <code>@container</code> tier each side currently occupies.
            </div>
        </HelpBox>
        
        <div class="flex flex-wrap gap-[10px] @container" v-container-width>

            <div class="w-full @xl:flex-1 flex flex-col gap-8 mb-5">

                <div class="flex flex-wrap gap-3">
                    <b>PrimaryButton / SecondaryButton</b>
                    <div>
                        Standard styled buttons for primary and secondary actions.
                    </div>
                    <div class="flex gap-3 py-3">
                        <PrimaryButton>Primary</PrimaryButton>
                        <SecondaryButton title="Secondary" />
                    </div>
                </div>

                <div class="flex flex-wrap gap-3">
                    <b>BooleanButton</b>
                    <div>
                        Toggles a boolean <code>v-model</code>, optionally showing different text/icon for each state.
                    </div>
                    <div class="flex gap-3 py-3">

                        <BooleanButton v-model="boolOneValue" trueText="On Button" falseText="Off Button" />    

                        <BooleanButton v-model="boolTwoValue" 
                            text="Button" trueText="On" falseText="Off"
                            trueIcon="heroicons-solid:check" falseIcon="heroicons-solid:x" />

                        <BooleanButton v-model="boolThreeValue" 
                            trueIcon="heroicons-solid:check" falseIcon="heroicons-solid:x" />    
                    </div>
                </div>

                <div class="flex flex-wrap gap-3">
                    <b>SwitchButton</b>
                    <div>
                        An iOS-style switch bound to a boolean <code>v-model</code>.
                    </div>
                    <div class="flex gap-3 py-3">

                        <SwitchButton v-model="switchOneValue" buttonName="Switch" />

                        <SwitchButton v-model="switchTwoValue"
                            buttonName="Active" class="bg-orange text-white" />

                        <SwitchButton v-model="switchThreeValue"
                            buttonName="Status" class="bg-green text-white" />
    
                    </div>
                </div>

                <div class="flex flex-wrap gap-3">
                    <b>RotateButton</b>
                    <div>
                        Rotates an icon to reflect a boolean state - handy for collapsible panels.
                    </div>
                    <div class="flex gap-10 py-3">

                        <RotateButton v-model="rotateOne" rotation="rotate-180" icon="heroicons:chevron-down-solid"/>

                        <RotateButton v-model="rotateTwo" rotation="rotate-90" icon="heroicons:bars-3"/>

                    </div>  
                </div>

                <div>
                    <b>InfoButton</b>
                    <div>
                        Cycles the app's global help level (None / Info / Help) - this is the real toggle, 
                        so watch the <b>InfoBox</b> and <b>HelpBox</b> above react.
                    </div>
                    <InfoButton />
                </div>

            </div>

            <div class="w-full @xl:flex-1 p-5 pb-7 border border-blue">
                <ListButtonExample />                
            </div>  

        </div>

    </div>

</template>