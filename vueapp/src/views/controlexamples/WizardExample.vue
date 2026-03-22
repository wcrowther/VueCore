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

        <div class="flex flex-wrap gap-3 lg:flex-row-reverse">

            <UploadControl url="/content/upload" accept="image/*"
                :maxSizeMB="5" @uploaded="uploaded" class="w-full lg:flex-1" />

            <FolderExplorer class="w-full lg:flex-[2] border border-gray-400" />

        </div>
    </div>

</template>