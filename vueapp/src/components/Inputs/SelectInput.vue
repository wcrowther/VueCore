<script setup>

    const props = defineProps (
    {
        showDefault:        { type: Boolean, default: true },       // show a default empty value
        defaultText:        { type: String,  default: '-----' },    // text for default item
        disableDefault:     { type: Boolean, default: true },       // initial value but default cannot be selected
        optionsList:        { type: Object,  required: true },      // list of options
        labelName:          { type: String,  required: true },      // label for select
        ruleName:           { type: String },                       // rule for valiadation. if not set, uses labelName removing spaces
        v$:                 { type: Object }                        // pass in vuelidate validator (validation ignored if not set)
    })

    const modelValue = defineModel()
    const rule       = computed(() => props.ruleName ? props.ruleName : props.labelName.replace(' ','') )
    const hasErrors  = computed(() => props.v$ && props.v$[rule.value] && props.v$[rule.value]?.$errors.length > 0 )

</script>

<template>

    <div class="mb-3 w-full">

        <div class="pb-1 flex justify-between items-baseline">
            <span class="text-color-dark-blue font-bold whitespace-nowrap text-xs">
                {{props.labelName}}
            </span>
            <template v-if="hasErrors">
                <span v-for="error in v$[rule].$errors" :key="error.$uid"
                    class="italic font-bold text-right text-xs text-color-red">
                    {{ error.$message }}
                </span>
            </template> 
        </div>

        <select :class="['w-full p-2.5 text-sm', {'border-red': hasErrors}]" 
            :name="rule" :id="rule" v-bind="$attrs" v-model="modelValue">
            <option v-if="showDefault" :disabled="disableDefault" value="">{{ defaultText }}</option>
            <option v-for="(value,key) in optionsList" :key="key" :value="key" class="text-sm">
                {{ value }}
            </option>
        </select>

    </div>

</template>



<!-- EXAMPLES:
    
    <SelectInput labelName="State / Province" ruleName="StateProvince" v-model="account.StateProvince" 
        :optionsList="usStatesList" :v$ />
-->
