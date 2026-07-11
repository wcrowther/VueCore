<script setup>
    const props = defineProps(
    {
        id: { type: String, required: true },
        title: { type: String, default: '' },
        defaultOpen: { type: Boolean, default: false }
    })

    const modelOpen = defineModel({ type: Boolean, default: undefined })

    const localOpen = useLocalStorage(props.id, props.defaultOpen)

    const isOpen = computed(
    {
        get: () => modelOpen.value ?? localOpen.value,
        set: (value) =>
        {
            localOpen.value = value
            modelOpen.value = value
        }
    })

    const toggleItem = () =>
    {
        isOpen.value = !isOpen.value
    }
</script>

<template>
    <div class="w-full mb-5">
        <div class="w-full flex justify-between items-center px-3 py-2 text-left font-medium bg-blue-100 hover:bg-gray-100 cursor-pointer"
            @click="toggleItem">

            <slot name="header">
                <span v-if="props.title" class="select-none">{{ props.title }}</span>
            </slot>

            <RotateButton v-model="isOpen" rotation="rotate-180"
                :no-click="true" size="18px" icon="heroicons:chevron-down-solid" />
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

    <DetailBox id="detail-two" v-model="someOpenState" :defaultOpen="true">
        <template #header>Custom Header Title</template>
        Body content
    </DetailBox>
-->


