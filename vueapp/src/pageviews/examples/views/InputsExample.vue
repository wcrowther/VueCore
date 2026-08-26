<script setup>

    const { createConfirm } = useConfirmControl()
    const toastStore         = useToastStore()

    const showJson          = ref(false)
    const showCode          = ref(false)
    const showAdvSearch     = ref(false)
    const inputDemo         = reactive(new InputDemoModel())
    const savedInputDemo    = ref(JSON.parse(JSON.stringify(inputDemo))) 
    const v$                = useVuelidate(inputDemoValidator, inputDemo)

    const isDirty = computed(() => JSON.stringify(inputDemo) !== JSON.stringify(savedInputDemo.value) )

    watch(showAdvSearch, (isAdvSearchShown) =>
    {
        if (!isAdvSearchShown) return

        const msg = 'AdvSearch is not enabled for this instance. See the Account Search page for an example.'   
        toastStore.showInfo(msg)
        showAdvSearch.value = false
    })

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

    // Listeners   =============================================================================

    const keys = 
    {
        'Ctrl+KeyS': () => saveInputDemo()
    }

	KeyboardListeners(keys);

// ======================================================================
// CodeBlock Example
// ======================================================================

const codeContent = 
`
// The input form markup for this example is succinct but does a lot, including 
// full  validation behavior - passed into components using the 'v$' prop.
 
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
<SearchInput v-model="inputDemo.SearchInput" v-model:showAdvSearch="showAdvSearch"
    :showAdvSearchButton="true" labelName="SearchInput" :compact="false" />
<MultiSelectInput labelName="MultiSelectInput" v-model="inputDemo.MultiSelectInput" 
    :optionsList="usStatesList" class="xl:mt-5 xl:col-span-2 3xl:col-span-3" :v$  />
`
</script>

<template>

    <PageTitleBox pageTitle="Input Examples">
        <button :disabled="!isDirty" class="btn-primary flex items-center" 
            @click="resetInputDemo" title="Revert unsaved changes to Input Demo">
            Reset 
            <!-- <IconSymbol width="18px" class="text-warm-600" icon="heroicons:arrow-left-20-solid" /> -->
        </button>
        <button class="btn-primary" title="Example Save action for demo shows output in JSON preview"
            :disabled="!isDirty" @click="saveInputDemo">
            Save
        </button>
    </PageTitleBox>

    <InfoBox>
        <p class="mb-5">
            This page is an input playground that binds many controls to one reactive
            <b>InputDemoModel</b>, so you can quickly test values, validation, and UI feedback
            in a single form. The <b>CodeBlock</b> below shows how concise the markup stays.
            As fields change, the page compares values to the last saved snapshot, which controls
            when <b>Save</b> and <b>Reset</b> are enabled.
        </p>
        <p>
            Saving runs <b>Vuelidate</b>
            - passed in as <b>:v$</b>, asks for confirmation, and opens a JSON preview modal.
            Reset restores model defaults and clears validation for a clean retest.
        </p>
    </InfoBox>

    <HelpBox>
        <div class="mb-5">
            <b>Code preview:</b> Open the <b>CodeBlock</b> to see the full input markup in one place.
            It is intentionally concise, but still handles rich validation and synchronized model updates.
        </div>
        <div class="mb-5">
            <b>Validation behavior:</b> Required and rule-based fields show errors inline as you interact.
            Use this page to verify both input formatting and validation messaging across controls.
        </div>
        <div class="mb-5">
            <b>Control tips:</b> <b>SearchInput</b> supports advanced search via the <b>+</b> button,
            <b>SliderInput</b> moves in step increments, and <b>MultiSelectInput</b> supports selecting
            multiple items while keeping the model synchronized.
        </div>
        <div>
            <b>Save and reset flow:</b> Buttons activate only after edits are detected. <b>Save</b> validates,
            asks for confirmation, and opens a JSON preview modal so you can inspect the final payload.
            <b>Reset</b> restores default model values and clears validation state for a clean retest.
        </div>
    </HelpBox>

    <CodeBlock :codeContent title="Input Controls Markup" v-model="showCode" ></CodeBlock>

    <div id="inputDemo" class="p-5 pb-10 border border-gray-400 
        grid grid-cols-1 xl:grid-cols-2 3xl:grid-cols-3 gap-x-6 gap-y-4 
        [&>*]:!mb-0 xl:[&>*]:min-h-[80px] 3xl:[&>*]:min-h-0" >

        <TextInput labelName="TextInput" v-model="inputDemo.TextInput" :v$ />
        <PhoneInput labelName="PhoneInput" v-model="inputDemo.PhoneInput" :v$ />
        <TextAreaInput labelName="TextAreaInput" autogrow v-model="inputDemo.TextAreaInput" :v$ />
        <PasswordInput labelName="PasswordInput" v-model="inputDemo.PasswordInput" :v$ />
        <DateInput labelName="DateInput" v-model="inputDemo.DateInput" :v$ />
        <TimeInput labelName="TimeInput" v-model="inputDemo.TimeInput" :v$ />
        <SliderInput labelName="SliderInput" v-model="inputDemo.SliderInput"
            :min="0" :max="100" :step="5" :hideLabel="false" />
        <CheckboxInput labelName="CheckboxInput" v-model="inputDemo.CheckboxInput" />
        <SelectInput labelName="SelectInput" v-model="inputDemo.SelectInput" 
            :optionsList="usStatesList" defaultText="-- SelectInput --" :v$ />
        <SearchInput v-model="inputDemo.SearchInput" v-model:showAdvSearch="showAdvSearch"
            :showAdvSearchButton="true" labelName="SearchInput" :compact="false" />
        <MultiSelectInput labelName="MultiSelectInput" v-model="inputDemo.MultiSelectInput" :optionsList="usStatesList" :v$ 
            class="xl:mt-3 xl:col-span-2 3xl:col-span-3" />

    </div>

    <ModalControl id="InputDemoJson" v-model="showJson" class="p-5" 
        title="Example Json to Save" width="700px" height="620px">

        <JsonTreeControl label="InputDemo" :json="inputDemo" class="w-full" :isOpen="true" />

        <template #footer>
            <button class="btn-primary"  @click="showJson=false">Close</button>
        </template>

    </ModalControl>

</template>

