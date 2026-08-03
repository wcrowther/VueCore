<script setup>

    const props = defineProps (
    {
        labelName:  { type: String }, 
        ruleName:   { type: String }, 
        step:       { type: Number,  default: 300}, // seconds - 5 mins
        v$:         { type: Object }
    })

    const modelValue = defineModel()
    const rule       = computed(() => props.ruleName ? props.ruleName : props.labelName.replace(' ',''))
    const hasErrors  = computed(() => props.v$ && props.v$[rule.value] && props.v$[rule.value]?.$errors.length > 0 )

</script>

<template>
    <div class="mb-3 w-full">

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
                type="time" :id="props.labelName" :name="props.labelName"
                v-model="modelValue" v-bind="$attrs" :step="props.step" />
        </div>

    </div>
</template>

<!-- 
EXAMPLES:
    <TimeInput labelName="Time" v-model="event.time" :v$ />
-->

