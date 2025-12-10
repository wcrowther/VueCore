<script setup>

    const pageTitle  = ref('Wizard')

</script>

<template>

    <div class="relative" id="messages-page">

        <div class="z-0 bg-gradient-main h-[500px] absolute top-0 left-0 right-0"></div>

        <div class="z-20 p-5 pt-5 sm:p-10 sm:pt-5 pb-14">

            <div class="flex justify-between items-center mb-7 relative">
                <h2 class="text-2xl font-display font-bold flex-grow">{{ pageTitle }}</h2>
            </div>

			<div class="w-full min-h-[400px] relative">

				<InfoBox class="mb-5">
					This page is a demonstration of a Wizard Control.
				</InfoBox>

				<!-- FloaterControl here 
				<FloaterControl :show="true" name="FloaterOne"
					class="bg-white w-[400px] h-[300px] p-5">
					Some floating content here.
				</FloaterControl>
				-->

				<WizardControl class="mb-10" :tabList="['First', 'Second', 'Third', 'Fourth', 'Fifth']">

					<template #First>
						<AccountsWizardFirst /> 
					</template>

					<template #Second>
						<AccountsWizardSecond />
					</template>

					<template #Third>
						<AccountsWizardThird />
					</template>
				
					<template #Fourth>
						<div class="font-bold mb-3">Fourth Content</div>
						<div class="">
							Aspernatur maiores odio possimus 
							tempore accusamus asperiores! Minus sit enim sapiente id fugiat rem optio! Perferendis recusandae 
							corporis odio, modi sunt nulla?
						</div>
					</template>

					<template #Fifth></template>

				</WizardControl>

			</div>

        </div>
    </div>  
</template>