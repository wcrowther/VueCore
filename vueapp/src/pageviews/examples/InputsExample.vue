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

    const resetInputDemo = () => { Object.assign(new InputDemoModel());  v$.value.$reset() }

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

    <InfoBox class="text-sm text-slate-600">
        Demo all input controls in one model.
    </InfoBox>

    <div class="p-5 pb-10 border border-gray-400 grid grid-cols-1 xl:grid-cols-2 3xl:grid-cols-3 gap-x-6 gap-y-4 
        [&>*]:!mb-0 xl:[&>*]:min-h-[80px] 3xl:[&>*]:min-h-0"  id="inputDemo">

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
            class="xl:col-span-2 3xl:col-span-3" />

    </div>

    <ModalControl id="InputDemoJson" v-model="showJson"
        title="InputDemo Json" width="700px" height="600px" :showFooter="false">
        <JsonTreeControl label="InputDemo" :json="inputDemo"  class="p-5" :isOpen="true" />
    </ModalControl>

</template>

