<script setup>

    const props = defineProps (
    {
        labelName:  { type: String, required: true }, 
        ruleName:   { type: String },  
        v$:         { type: Object }
    })

    const modelValue        = defineModel()
    const rule              = computed(() => props.ruleName ? props.ruleName : props.labelName.replace(' ','') )
    const phoneDisplay      = computed(
    {
        get()       { return usPhoneFormat(modelValue.value) },
        set(value)  { modelValue.value = numbersOnly(value) }
    })

</script>

<template>

    <div class="mb-3 w-full">

        <div class="pb-1 flex justify-between items-baseline">
            <span class="text-color-dark-blue font-bold whitespace-nowrap text-xs">
                {{props.labelName}}
            </span>
            <template v-if="v$">
                <span class="italic font-bold text-right text-xs text-color-red" 
                    v-for="error in v$[rule].$errors" :key="error.$uid">
                    {{ error.$message }}
                </span>
            </template>
        </div>

        <div class="flex justify-center items-center relative">
            <input class="w-full text-sm" type="text" :id="props.labelName" :name="props.labelName"
                v-model="phoneDisplay" spellcheck="false" />
        </div>
        
    </div>

</template>

