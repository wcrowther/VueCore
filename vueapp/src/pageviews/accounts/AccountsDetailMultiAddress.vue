<script setup>

	const props = defineProps({
		account: Object,
		isAddingAccount: Boolean,
		usStatesList: Array
	});

</script>

<template>
	
	<!-- EXAMPLE VERSION FOR MULTIPLE ADDRESSES - NOT YET FULLY IMPLEMENTED            -->

	<div v-if="account && account.AccountId > 0 || isAddingAccount" id="MultiAddress"
		class="basis-[300px] min-w-[200px] flex-1 border pt-2 border-color-blue-gray bg-white ">

		<TabsFlowControl :tabList="['Account', 'Second', 'Third']" altDesign flatten class="w-full">

			<template #Account>
				<div class="m-5">
					<TextInput labelName="Street Address" v-model="account.StreetAddress" :v$ />
					<TextInput labelName="City" ruleName="City" v-model="account.City" :v$ />

					<div class="flex justify-between gap-3">
						<SelectInput labelName="State / Province" ruleName="StateProvince"
							v-model="account.StateProvince" :optionsList="usStatesList" defaultText="-- Pick a State --"
							:v$ />
						<TextInput labelName="Postal Code" ruleName="PostalCode" v-model="account.PostalCode" :v$ />
					</div>
				</div>
			</template>

			<template #Second>
				<div class="m-5">
					<TextInput labelName="Street Address" v-model="account.StreetAddress" :v$ />
					<TextInput labelName="City" ruleName="City" v-model="account.City" :v$ />

					<div class="flex justify-between gap-3">
						<SelectInput labelName="State / Province" ruleName="StateProvince"
							v-model="account.StateProvince" :optionsList="usStatesList" defaultText="-- Pick a State --"
							:v$ />
						<TextInput labelName="Postal Code" ruleName="PostalCode" v-model="account.PostalCode" :v$ />
					</div>
				</div>
			</template>

			<template #Third>
				<div class="m-5">
					<TextInput labelName="Street Address" v-model="account.StreetAddress" :v$ />
					<TextInput labelName="City" ruleName="City" v-model="account.City" :v$ />

					<div class="flex justify-between gap-3">
						<SelectInput labelName="State / Province" ruleName="StateProvince"
							v-model="account.StateProvince" :optionsList="usStatesList" defaultText="-- Pick a State --"
							:v$ />
						<TextInput labelName="Postal Code" ruleName="PostalCode" v-model="account.PostalCode" :v$ />
					</div>
				</div>
			</template>

		</TabsFlowControl>
	</div>
</template>
