<script setup>

</script>

<template>
    <div class="relative h-14 pl-5 pr-10 flex justify-end items-center overflow-hidden select-none">
        
        <div class="mr-auto flex items-center gap-3">
            <slot name="leftalign"></slot>
        </div>

        <slot name="default"></slot>

        <InfoButton />
        
    </div>
</template>

