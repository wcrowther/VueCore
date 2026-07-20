<script setup>

    const floaterOne = ref(true)
    const floaterTwo = ref(true)

</script>

<template>

    <PageTitleBox pageTitle="Floater Control">
    
        <BooleanButton v-model="floaterOne"
            trueText="Hide Floater One" falseText="Show Floater One" /> 

        <BooleanButton v-model="floaterTwo"
            trueText="Hide Floater Two" falseText="Show Floater Two" />

    </PageTitleBox>

    <InfoBox>
        Info about floater controls.
    </InfoBox>

    <FloaterControl v-model.show="floaterOne" 
        name="FloaterOne" title="Floater One"
        class="bg-white w-[400px] h-[300px]">

        <div class="p-5">
            <SimpleCounter />
        </div>
    </FloaterControl>

    <FloaterControl v-model.show="floaterTwo" 
        name="FloaterTwo" title="Floater Two"
        class="bg-white w-[400px] h-[300px]">

        <div class="p-5">
            <SimpleCounter />
        </div>
    </FloaterControl>
				
				
</template>