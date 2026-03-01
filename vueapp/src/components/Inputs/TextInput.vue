<script setup>

    const props = defineProps (
    {
        labelName:   { type: String }, 
        placeholder: { type: String }, 
        ruleName:    { type: String }, 
        spellCheck:  { type: Boolean },
        v$:          { type: Object }
    })

    const modelValue = defineModel()
    const rule       = computed(() => props.ruleName ? props.ruleName : props.labelName.replace(' ',''))
    const hasErrors  = computed(() => props.v$ && props.v$[rule.value] && props.v$[rule.value]?.$errors.length > 0 )
    const textInput  = ref(null)
    const focus      = () => 
    { 
        textInput.value.focus();
        textInput.value.setSelectionRange(0,0)
    }

    defineExpose({ focus })
</script>

<template>
    <div class="mb-3">

        <div class="pb-1 flex justify-between items-baseline">
            <label v-if="props.labelName"
                class="text-color-dark-blue font-bold whitespace-nowrap text-xs"
                :for="props.labelName">
                {{props.labelName}}
            </label>
            <template v-if="hasErrors">
                <span class="italic font-bold text-right text-xs text-color-red" 
                    v-for="error in v$[rule].$errors" :key="error.$uid">
                    {{ error.$message }} 
                </span>
            </template>
        </div>

        <div class="flex justify-center items-center relative">
            <input :class="['w-full text-sm', {'border-red': hasErrors}]" 
                type="text" :id="props.labelName" :name="props.labelName"
                v-model="modelValue" v-bind="$attrs" ref="textInput"
                :placeholder="props.placeholder" :spellcheck="props.spellCheck" />
        </div>

    </div>
</template>

<!-- 
EXAMPLES:
    <TextInput labelName="Account Name" v-model="account.AccountName" :v$ />
    <TextInput labelName="Main Email" ruleName="AccountEmail" v-model="account.AccountEmail" :v$ />

    -------------------------------------------------------------------------------------------
    'defineModel' replaced the code below from older vue version and the defineProps modelValue
    -------------------------------------------------------------------------------------------
    (in props)    modelValue: { type: String },
    const emits = defineEmits(['update:modelValue'])
    const value = computed(
    {
        get()       { return props.modelValue },
        set(value)  { emits('update:modelValue', value)  }
    })
    ------------------------------------------------------------------------------------------- 
-->

