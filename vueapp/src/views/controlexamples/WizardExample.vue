<script setup>

    const uploaded = (data) => console.log("uploaded",data)

</script>

<template>

    <div class="mb-10">
        <div class="font-bold mb-5">WizardControl Example</div>
        <div class="mb-10">
            Aspernatur maiores odio possimus
            tempore accusamus asperiores! Minus sit enim sapiente id fugiat rem optio! Perferendis recusandae
            corporis odio, modi sunt nulla?
        </div>
        <div class="font-bold mb-5">UploadControl - Bonus</div>
        <div class="mb-5">
            Aspernatur maiores odio possimus
            tempore accusamus asperiores! Minus sit enim sapiente id fugiat rem optio! Perferendis recusandae
            corporis odio, modi sunt nulla?
        </div>

        <div class="flex flex-wrap gap-5">

            <FolderExplorer class="!w-1/2 border border-gray-400" />

            <UploadControl url="/content/upload" accept="image/*"
                :maxSizeMB="5" @uploaded="uploaded" class="mb-10 !w-1/2" />
        </div>
    </div>

</template>