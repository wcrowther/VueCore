<script setup>

    const props = defineProps(
    {
        id: { type: String, default: '' },
        title: { type: String, default: '' },
        hideCaret: { type: Boolean, default: false }
    })

    const name = (() =>
    {
        const hasIdValue = Boolean(props.id?.trim())
        const value      = hasIdValue ? props.id : props.title.replace(/\s+/g, '_')

        if (!value || !value.trim())
            throw new Error('[DetailBox] Missing name. Provide a non-empty id or title.')

        return value
    })()

    const localOpen = useLocalStorage(name, false)
    const modelOpen = defineModel({ type: Boolean })
    const isOpen = computed(
    {
        get: () => modelOpen.value ?? localOpen.value,
        set: (value) =>
        {
            const nextValue = Boolean(value)
            localOpen.value = nextValue
            modelOpen.value = nextValue
        }
    })

    const toggleItem = () =>  isOpen.value = !isOpen.value
    
</script>

<template>
    <div class="w-full mb-5">
        <div class="w-full flex justify-between items-center px-3 py-2 text-left font-medium bg-blue-100 hover:bg-gray-100 cursor-pointer"
            @click="toggleItem">

            <slot name="header">
                <span v-if="props.title" class="select-none">
                    {{ props.title }}
                </span>
            </slot>

            <RotateButton v-if="!props.hideCaret"
                v-model="isOpen" rotation="rotate-180"
                :noClick="true" size="18px" icon="heroicons:chevron-down-solid" />
        </div>

        <div v-show="isOpen" class="overflow-hidden">
            <div class="p-4 border border-t-0">
                <slot />
            </div>
        </div>
    </div>
</template>


<!--
USE: Wrap around content to show/hide details with a clickable header.
EXAMPLE:
    <DetailBox id="detail-one" title="Detail One">
        Body content
    </DetailBox>

    <DetailBox id="detail-two" v-model="someOpenState">
        <template #header>Custom Header Title</template>
        Body content
    </DetailBox>
-->


