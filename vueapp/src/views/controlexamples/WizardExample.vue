<script setup></script>

<template>

    <div class="mb-10">

        <div class="text-lg font-bold mb-5">
            Alert &amp; Confirm Composables
        </div>
        <div class="mb-7">
            These composables allow you to programmatically trigger <b>Alert</b> and <b>Confirm</b> dialogs 
            from anywhere in your code — no component markup required. Both return a Promise, so you can 
            <code>await</code> the result inline and branch logic based on the user's response.
            Check the browser console to see the resolved values after interacting with each dialog.
        </div>

        <ComposablesExample class="mb-7" />
        
    </div>

</template>