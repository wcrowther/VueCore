<script setup>

    const props = defineProps (
    {
        labelName:  { type: String, required: true }, 
        ruleName:   { type: String },  
        v$:         { type: Object }
    })

    const showPassword = ref(false)
    const modelValue = defineModel()
    const rule  = computed(() => props.ruleName ? props.ruleName : props.labelName.replace(' ','') )

</script>

<template>
    <div class="mb-3 w-full">
        <div class="pb-1 flex justify-between items-baseline">
            <span class="text-color-dark-blue font-bold whitespace-nowrap text-xs">
                {{props.labelName}}
            </span>
            <template v-if="v$">
                <span class="italic font-bold text-right text-xs text-color-red"
                    v-for="error in v$[rule].$errors" :key="error.$uid" >
                    {{ error.$message }}
                </span>
            </template>
        </div>
        <div class="flex justify-center items-center relative">
            <input class="w-full text-sm pr-12" :id="props.labelName" :name="props.labelName" spellcheck="false"
                :type="showPassword ? 'text' : 'password'" v-model="modelValue" />

                <IconSymbol v-if="!showPassword" @click="showPassword=true" 
                    width="20px" class="eye-symbol" icon="heroicons-solid:eye-slash" />
                <IconSymbol v-if="showPassword" @click="showPassword=false"
                    width="20px" class="eye-symbol" icon="heroicons-solid:eye" />
        </div>
    </div>
</template>

<style lang="postcss" scoped>
    .eye-symbol     { @apply absolute right-3 h-5 w-5 text-color-dark-gray }
</style> 
 
