<script setup>

    const props = defineProps (
    {
        labelName:  { type: String, default: '' },
        compact:    { type: Boolean, default: false } 
    })

    const modelValue = defineModel()
    const inputId    = computed(() => props.labelName.replace(/\s+/g, ''))

</script>

<template>
    <div v-if="props.compact || !props.labelName" 
        class="flex items-center gap-x-2">
        <input type="checkbox" :id="inputId" :name="props.labelName" v-model="modelValue" 
            class="focus:ring-offset-0">
        <label :for="inputId" class="text-color-dark-blue font-bold whitespace-nowrap text-xs">
            {{props.labelName}}
        </label>
    </div>

    <div v-else 
        class="mb-3">
        <div class="flex justify-between items-baseline">
            <label :for="inputId" class="text-color-dark-blue font-bold whitespace-nowrap text-xs">
                {{props.labelName}}
            </label>
        </div>
        <div class="h-8 flex items-center">
            <input type="checkbox" :id="inputId" :name="props.labelName" 
                v-model="modelValue">
        </div>
    </div>
</template>

<!--
Examples: 
    <CheckboxInput labelName="Is Active" v-model="account.IsActive" compact />
    <CheckboxInput labelName="Is Active" v-model="account.IsActive" />
-->
