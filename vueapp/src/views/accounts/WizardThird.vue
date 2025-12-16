<script setup>

    onMounted(() => console.log('Accounts Wizard Third Mounted'))   

</script>

<template>

    <div class="font-bold mb-3">Component Persistence</div>
    <div class="">
        This simple counter is meant to show that the component state is maintained
        after switching to other tabs. Add to the count then go to another tab. 
        When you come back to this tab the counter will maintain the value.
        <SimpleCounter class="mt-5" />
    </div>

</template>