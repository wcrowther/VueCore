<script setup>

    const currentYear = new Date().getFullYear()

</script>

<template>
    <div class="p-3 md:mx-3 mb-5 relative z-20 flex justify-center items-center bg-gradient-footer">
        <slot><span class="text-color-theme-footer-text">&copy; {{currentYear}} - Will Crowther</span></slot>
    </div>
</template>

