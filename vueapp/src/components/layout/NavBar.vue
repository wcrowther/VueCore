<script setup></script>

<template>

    <div class="px-5 sm:pr-10 h-11 flex gap-x-2 justify-end items-end select-none">

        <div class="mr-auto h-full flex items-center">
            <slot name="leftalign"></slot>
        </div>

        <slot></slot>

    </div>
    
</template>