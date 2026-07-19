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
        
            <input :id="props.labelName" :name="props.labelName" 
                class="w-full text-sm pr-12" spellcheck="false"
                :type="showPassword ? 'text' : 'password'" v-model="modelValue" />

            <IconSymbol v-if="showPassword" 
                width="18px" class="absolute right-3 text-color-dark-gray" 
                @click="showPassword=false" icon="heroicons-solid:eye" />
            <IconSymbol v-else 
                width="18px" class="absolute right-3 text-color-dark-gray" 
                @click="showPassword=true" icon="heroicons-solid:eye-slash" />
        </div>
    </div>
</template>


