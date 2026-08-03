<script setup>

	const props = defineProps(
	{
		v$: { type: Object, required: true }
	})

	const interviewStore = useInterviewStore()
	const contactInfo = interviewStore.interview.ContactInfo

	const contactTypes =
	{
		Email: 'Email',
		Phone: 'Phone',
		Text: 'Text Message'
	}

	const validateStep = async () => await props.v$.ContactInfo.$validate()

	const autoFillStep = () =>
	{
		Object.assign(contactInfo,
		{
			FullName: 'Avery Morgan',
			Email: 'avery.morgan@example.com',
			Phone: '5553218899',
			PreferredContact: 'Email'
		})

		props.v$.ContactInfo.$reset()
	}

	defineExpose({ validateStep })

</script>

<template>

	<div>

		<TitleBox class="!m-0 !mb-4">Step 1: Name and Contact Info</TitleBox>

		<p class="mb-4 text-sm leading-6">
			Start with your basic interview contact details.
		</p>

		<div class="mb-4">
			<button type="button" class="text-xs font-bold underline underline-offset-2 !text-color-dark-blue hover:!text-orange"
				@click="autoFillStep">
				AutoFill Step
			</button>
		</div>

		<div class="grid grid-cols-1 xl:grid-cols-2 gap-x-5 gap-y-1">

			<TextInput labelName="Full Name" ruleName="FullName"
				v-model="contactInfo.FullName" :v$="props.v$.ContactInfo" />

			<TextInput labelName="Email" ruleName="Email"
				v-model="contactInfo.Email" :v$="props.v$.ContactInfo" />

			<PhoneInput labelName="Phone" ruleName="Phone"
				v-model="contactInfo.Phone" :v$="props.v$.ContactInfo" />

			<SelectInput labelName="Preferred Contact" ruleName="PreferredContact"
				v-model="contactInfo.PreferredContact" :optionsList="contactTypes"
				defaultText="-- Select Contact Type --" :v$="props.v$.ContactInfo" />

		</div>

	</div>

</template>
