<script setup>

    const showModal = ref(false)
    const overlayClosesModal = ref(false)

</script>

<template>

    <PageTitleBox pageTitle="Modal Control">
        <BooleanButton v-model="overlayClosesModal" trueText="Overlay Closes" falseText="Overlay Stays Open" />
        <PrimaryButton title="Open Modal" @click="showModal=true" />
    </PageTitleBox>

    <InfoBox>
        <b>ModalControl</b> displays focused content above the page whenever its <b>v-model</b> boolean is
        true. It includes a title header with a close button, a scrollable content area, and a footer with an
        Ok button by default. Use the <b>header</b> and <b>footer</b> slots to replace those sections, or set
        <b>:showFooter="false"</b> when no footer is needed. The component locks page scrolling while open.
    </InfoBox>

    <HelpBox>
        <div class="mb-4">
            Use <b>height</b> and <b>width</b> to size the dialog. Content passed to the default slot
            scrolls independently when it exceeds the available height.
        </div>
        <div>
            Set <b>:overlayClosesModal="true"</b> to allow clicking outside the dialog to close it, or
            provide <b>header</b> and <b>footer</b> slots when the default controls do not fit the workflow.
        </div>
        <div class="mt-4">
            By default, <b>teleportToModals</b> moves the modal to the page's <b>#modals</b> container. This
            keeps the overlay above page content and avoids clipping or stacking-context issues from parent
            elements. Set <b>:teleportToModals="false"</b> to render it in its original location instead.
        </div>
    </HelpBox>

    <ModalControl v-model="showModal" title="ModalControl Example" height="360px" width="560px"
        :overlayClosesModal="overlayClosesModal">

        <div class="p-5">
            <p class="mb-4">
                This is the modal content area. It receives attributes and classes placed on
                <b>ModalControl</b>, so it can be styled for forms, details, or other focused tasks.
            </p>
            <InfoBox class="mb-0">
                The overlay is currently configured to
                <b>{{ overlayClosesModal ? 'close when clicked' : 'remain open when clicked' }}</b>.
            </InfoBox>
        </div>

        <template #footer>
            <button class="btn-delete" @click="showModal=false">Close</button>
        </template>

    </ModalControl>

</template>