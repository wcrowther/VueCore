<script setup></script>

<template>

    <div class="text-lg font-bold mb-5">
        Intro
    </div>

    <div class="">
       <router-link to="/admin/examples/calendar" linkName="Calendar" class="font-bold hover:opacity-50">
            Link to Calendar
        </router-link>
        <br />
        <router-link to="/admin/examples/checkers" linkName="Checkers" class="font-bold hover:opacity-50">
            Link to Checkers
        </router-link>
        <br />
        <router-link to="/admin/examples/files" linkName="Files" class="font-bold hover:opacity-50">
            Link to Files
        </router-link>
    </div>

</template>

