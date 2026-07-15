<script setup></script>

<template>

    <PageTitleBox pageTitle="Intro" />

    <div class="">
       <router-link to="/examples/calendar" linkName="Calendar" class="font-bold hover:opacity-50">
            Link to Calendar
        </router-link>
        <br />
        <router-link to="/examples/checkers" linkName="Checkers" class="font-bold hover:opacity-50">
            Link to Checkers
        </router-link>
        <br />
        <router-link to="/examples/files" linkName="Files" class="font-bold hover:opacity-50">
            Link to Files
        </router-link>
    </div>

</template>

