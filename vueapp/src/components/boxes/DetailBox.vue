<script setup>

    import { emitDetailBoxEvent, useDetailBoxEventListener } from '@/composables/UseDetailBoxEvents'

    const props = defineProps(
    {
        id: { type: String, default: '' },
        title: { type: String, default: '' },
        group: { type: String, default: '' },
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

    const groupName = computed(() => props.group.trim())
    const hasGroup  = computed(() => Boolean(groupName.value))
    const localOpen = useLocalStorage(name, false)
    const modelOpen = defineModel({ type: Boolean })
    const isOpen    = computed(
    {
        get: () => modelOpen.value ?? localOpen.value,
        set: (value) =>
        {
            const nextValue = Boolean(value)
            localOpen.value = nextValue
            modelOpen.value = nextValue
        }
    })

    const handleDetailBoxEvent = (item) =>
    {
        if (!item || !item.action) return

        const eventGroup = String(item.group ?? '').trim() 

        if (eventGroup && eventGroup !== groupName.value) return

        const excludeList = Array.isArray(item.exclude) ? item.exclude : []

        if (excludeList.includes(name))  return

        if (item.action === 'open' || item.action === 'open-all')
        {
            isOpen.value = true
            return
        }

        if (item.action === 'close' || item.action === 'close-all')
        {
            isOpen.value = false
            return
        }

        if (item.action === 'toggle' || item.action === 'toggle-all')
            isOpen.value = !isOpen.value
    }

    let stopDetailBoxEventListener = null
    onMounted(() =>
    {
        stopDetailBoxEventListener = useDetailBoxEventListener(handleDetailBoxEvent)
    })

    onBeforeUnmount(() =>
    {
        stopDetailBoxEventListener?.()
    })

    const toggleItem = () =>
    {
        const nextValue = !isOpen.value
        isOpen.value = nextValue

        if (hasGroup.value && nextValue)
            emitDetailBoxEvent({ group: groupName.value, action: 'close', exclude: [name] })
    }
    
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

    <DetailBox id="faq-1" title="FAQ One" group="faq" />
    <DetailBox id="faq-2" title="FAQ Two" group="faq" />

    // External controls:
    // emitDetailBoxEvent({ action: 'open-all' })
    // emitDetailBoxEvent({ action: 'close-all' })
    // emitDetailBoxEvent({ group: 'faq', action: 'close', exclude: ['faq-1'] })
-->


