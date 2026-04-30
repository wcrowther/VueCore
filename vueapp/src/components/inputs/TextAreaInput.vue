<script setup>

    const props = defineProps(
    {
        hideLabel:   { type: Boolean },
        labelName:   { type: String },
        placeholder: { type: String },
        ruleName:    { type: String },
        spellCheck:  { type: Boolean },
        rows:        { type: Number, default: 4 },
        resizable:   { type: Boolean, default: true },
		v$:          { type: Object },

    })

    const modelValue = defineModel()
    const rule       = computed(() => props.ruleName ? props.ruleName : props.labelName?.replace(' ', ''))
    const hasErrors  = computed(() => props.v$ && props.v$[rule.value] && props.v$[rule.value]?.$errors.length > 0)
    const textArea   = ref(null)
    const focus      = () =>
    {
        textArea.value.focus()
        textArea.value.setSelectionRange(0, 0)
    }

    const resizeClass = computed(() => props.resizable ? 'resize-y' : 'resize-none')

    defineExpose({ focus })
</script>

<template>
    <div class="mb-3 w-full">

        <div :class="['flex justify-between items-baseline', { 'pb-1': !props.hideLabel }]">
            <label v-if="props.labelName && !props.hideLabel"
                class="text-color-dark-blue font-bold whitespace-nowrap text-xs"
                :for="props.labelName">
                {{ props.labelName }}
            </label>
            <template v-if="hasErrors">
                <span class="italic font-bold text-right text-xs text-color-red"
                    v-for="error in v$[rule].$errors" :key="error.$uid">
                    {{ error.$message }}
                </span>
            </template>
        </div>

        <textarea :class="['w-full text-sm min-h-[34px] scrollbar-thin', resizeClass, { 'border-red': hasErrors }]"
            :id="props.labelName" :name="props.labelName"
            v-model="modelValue" v-bind="$attrs" ref="textArea"
            :rows="props.rows"
            :placeholder="props.placeholder"
            :spellcheck="props.spellCheck" />

    </div>
</template>

<!--
EXAMPLES:
    <TextAreaInput labelName="Notes" v-model="account.Notes" />
    <TextAreaInput labelName="Description" v-model="item.Description" :rows="6" :resizable="false" />
    <TextAreaInput labelName="Comments" ruleName="Comments" v-model="form.Comments" :v$ :rows="3" />
-->
