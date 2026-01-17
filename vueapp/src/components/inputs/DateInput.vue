<script setup>

    const props = defineProps (
    {
        labelName:  { type: String, required: true }, 
        ruleName:   { type: String }, 
        spellCheck: { type: Boolean },
        v$:         { type: Object }
    })

    const modelValue = defineModel()
    const rule       = computed(() => props.ruleName ? props.ruleName : props.labelName.replace(' ',''))
    const hasErrors  = computed(() => props.v$ && props.v$[rule.value] && props.v$[rule.value]?.$errors.length > 0 )

</script>

<template>
    <div class="mb-3">

        <div class="pb-1 flex justify-between items-baseline">
            <label class="text-color-dark-blue font-bold whitespace-nowrap text-xs"
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
                type="date" :id="props.labelName" :name="props.labelName"
                v-model="modelValue" v-bind="$attrs" :spellcheck="props.spellCheck" />
        </div>

    </div>
</template>

<!-- 
EXAMPLES:
    <DateInput labelName="DateCreated" v-model="account.DateCreated" :v$ />
-->

