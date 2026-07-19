<script setup>

    const props = defineProps(
    {
        id: { type: String, default: '' },
        pageTitle: { type: String, required: true }
    })

</script>

<template>

    <div class="w-full flex justify-between items-center mb-5">

        <h2 class="text-2xl text-color-blue font-display font-bold flex-grow">
            <slot name="pageTitle">
                {{ props.pageTitle }}
            </slot>
        </h2>

        <span class="flex flex-wrap gap-1.5">
            <slot />
        </span>

    </div>
    
</template>

<!-- EXAMPLE: 

    <PageTitleBox pageTitle="Account Details" />  // No slot content

    <PageTitleBox pageTitle="Account Details">  // With slot content

        <button class="btn-primary" @click="confirmSave">Save</button>
        <button class="btn-primary" @click="addAccount">Add</button>    

    </PageTitleBox>

    <PageTitleBox pageTitle="Account Details"> // With slot content and custom pageTitle slot

        <template #pageTitle>
            {{ props.pageTitle ?? 'Account' }}
        </template>

        <button class="btn-primary" @click="confirmSave">Save</button>
        <button class="btn-primary" @click="addAccount">Add</button>   

    </PageTitleBox>
-->
