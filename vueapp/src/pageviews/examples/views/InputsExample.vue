<script setup>

    const { createConfirm } = useConfirmControl()

    const showJson          = ref(false)
    const inputDemo         = reactive(new InputDemoModel())
    const savedInputDemo    = ref(JSON.parse(JSON.stringify(inputDemo))) 
    const v$                = useVuelidate(inputDemoValidator, inputDemo)

    const isDirty = computed(() => JSON.stringify(inputDemo) !== JSON.stringify(savedInputDemo.value) )

    const saveInputDemo = async () =>
    {
        const isValid = await v$.value.$validate()
        if (!isValid) return

        const confirmed = await createConfirm('Save Input Demo data?')
        if (!confirmed) return

        savedInputDemo.value = JSON.parse(JSON.stringify(inputDemo))
        showJson.value = true

        v$.value.$reset()
    }

    const resetInputDemo = () => { Object.assign(inputDemo, new InputDemoModel());  v$.value.$reset() }

</script>

<template>

    <div class="w-full flex justify-between items-center mb-4">
        <div class="text-lg font-bold mb-5">
            Input Examples
        </div>
        <span class="flex flex-wrap gap-1.5">
            <button class="btn-cancel" :disabled="!isDirty" @click="resetInputDemo">
                Reset
            </button>
            <button class="btn-primary" :disabled="!isDirty" @click="saveInputDemo">
                Save
            </button>
        </span>
    </div>

    <InfoBox class="text-sm text-slate-600 leading-6">
        This page is an input playground that binds many controls to one reactive
        <b>InputDemoModel</b>, so you can quickly test values, validation, and UI feedback
        in a single form. As fields change, the page compares current values to the last
        saved snapshot; that dirty-state check controls when <b>Save</b> and <b>Reset</b>
        are enabled. Saving runs Vuelidate, asks for confirmation, stores a new baseline,
        and opens a JSON preview modal. Reset restores model defaults and clears validation
        for a clean edit cycle.
    </InfoBox>

    <HelpBox class="">
        <b>Validation behavior:</b> Required and rule-based fields show errors inline as you interact.
        Use this page to verify both input formatting and validation messaging across controls.
        <br /><br />
        <b>Control tips:</b> <b>SearchInput</b> supports advanced search via the <b>+</b> button,
        <b>SliderInput</b> moves in step increments, and <b>MultiSelectInput</b> supports selecting
        multiple items while keeping the model synchronized.
        <br /><br />
        <b>Save and reset flow:</b> Buttons activate only after edits are detected. <b>Save</b> validates,
        asks for confirmation, and opens a JSON preview modal so you can inspect the final payload.
        <b>Reset</b> restores default model values and clears validation state for a clean retest.
    </HelpBox>

    <div id="inputDemo" class="p-5 pb-10 border border-gray-400 
        grid grid-cols-1 xl:grid-cols-2 3xl:grid-cols-3 gap-x-6 gap-y-4 
        [&>*]:!mb-0 xl:[&>*]:min-h-[80px] 3xl:[&>*]:min-h-0" >

        <TextInput labelName="TextInput" v-model="inputDemo.TextInput" :v$ />
        <PhoneInput labelName="PhoneInput" v-model="inputDemo.PhoneInput" :v$ />
        <TextAreaInput labelName="TextAreaInput" v-model="inputDemo.TextAreaInput" :v$ />
        <PasswordInput labelName="PasswordInput" v-model="inputDemo.PasswordInput" :v$ />
        <DateInput labelName="DateInput" v-model="inputDemo.DateInput" :v$ />
        <TimeInput labelName="TimeInput" v-model="inputDemo.TimeInput" :v$ />
        <SliderInput labelName="SliderInput" v-model="inputDemo.SliderInput"
            :min="0" :max="100" :step="5" :hideLabel="false" />
        <CheckboxInput labelName="CheckboxInput" v-model="inputDemo.CheckboxInput" />
        <SelectInput labelName="SelectInput" v-model="inputDemo.SelectInput" 
            :optionsList="usStatesList" defaultText="-- SelectInput --" :v$ />
        <SearchInput v-model="inputDemo.SearchInput" :showAdvSearchButton="true" 
            labelName="SearchInput" :compact="false" />
        <MultiSelectInput labelName="MultiSelectInput" v-model="inputDemo.MultiSelectInput" :optionsList="usStatesList" :v$ 
            class="xl:mt-5 xl:col-span-2 3xl:col-span-3" />

    </div>

    <ModalControl id="InputDemoJson" v-model="showJson" class="p-5" 
        title="Example Json to Save" width="700px" height="620px" :showFooter="false">
        <JsonTreeControl label="InputDemo" :json="inputDemo" class="w-full" :isOpen="true" />
    </ModalControl>

</template>

