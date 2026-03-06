<script setup>

	const props = defineProps(
	{
		dateInMonth: { type: [Date, String], required: true },
		weeks: { type: Number, default: 5 }
	})

	const emit = defineEmits(['drop'])

	const firstOfMonth 	= ref(normalize(props.dateInMonth))
	const timeZone 		= Intl.DateTimeFormat().resolvedOptions().timeZone
	const monthYear 	= computed(() =>
		firstOfMonth.value.toLocaleDateString(undefined, 
		{
			month: 'long', year: 'numeric', timeZone
		})
	)

	// Calendar Cells  ===================================================================

	const days = 7

	const startOfGrid = computed(() => {

		const first = new Date(firstOfMonth.value)

		const weekday = first.getDay()   // 0 = Sunday

		const start = new Date(first)
		start.setDate(first.getDate() - weekday)

		return start
	})

	const cells = computed(() => {

		const result = []
		const base = new Date(startOfGrid.value)

		const currentMonthIndex = firstOfMonth.value.getMonth()

		const totalCells = props.weeks * days

		for (let i = 0; i < totalCells; i++) {

			const date = new Date(base)
			date.setDate(base.getDate() + i)

			result.push({
				date,
				isCurrentMonth: date.getMonth() === currentMonthIndex,
				isToday: isSameDate(date, new Date())
			})
		}

		return result
	})


	const onDrop = (e, date) => 
	{
		const eventId = e.dataTransfer.getData('event-id')
		emit('drop', { eventId, date })
	}

	// Date Helpers  ===================================================================

	function toLocalDate(input) 
	{

		// If already Date → extract Y/M/D in LOCAL calendar terms
		if (input instanceof Date) 
		{
			return new Date(
				input.getFullYear(),
				input.getMonth(),
				input.getDate(),
				12, 0, 0, 0
			)
		}

		// YYYY-MM-DD (date only)
		if (typeof input === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(input)) 
		{
			const [y, m, d] = input.split('-').map(Number)
			return new Date(y, m - 1, d, 12, 0, 0, 0)
		}

		// ISO string with timezone
		const temp = new Date(input)

		return new Date( temp.getFullYear(), temp.getMonth(), temp.getDate(), 12, 0, 0, 0)
	}

	function normalize(date) 
	{
		const d = toLocalDate(date)
		return new Date( d.getFullYear(), d.getMonth(), 1, 12, 0, 0, 0)
	}

	function addMonths(date, amount) 
	{
		const d = new Date(date)
		return new Date(d.getFullYear(), d.getMonth() + amount, 1, 12, 0, 0, 0)
	}

	function prevMonth() 
	{
		firstOfMonth.value = addMonths(firstOfMonth.value, -1)
	}

	function nextMonth() 
	{
		firstOfMonth.value = addMonths(firstOfMonth.value, 1)
	}

	function toToday() 
	{
		firstOfMonth.value = normalize(new Date())
	}

	function isSameDate(a, b) 
	{
		return a.getFullYear() === b.getFullYear()
			&& a.getMonth() === b.getMonth()
			&& a.getDate() === b.getDate()
	}

	defineExpose({ prevMonth, nextMonth, toToday })

</script>

<template>
	<div class="bg-white">

		<slot name="title" :monthYear :timeZone :firstOfMonth 
			:prevMonth :nextMonth :toToday >
			<!-- Default Title can be modified using custom title slot -->
			<div class="text-center">
				<div class="text-lg font-bold">
					{{ monthYear }}
				</div>
				<div class="text-xs text-gray-500">
					{{ timeZone }}
				</div>
			</div>
		</slot>
		<div class="grid grid-cols-7 gap-px bg-blue-200">
			<div class="p-1 text-center bg-blue-100">Sunday</div>
			<div class="p-1 text-center bg-blue-100">Monday</div>
			<div class="p-1 text-center bg-blue-100">Tuesday</div>
			<div class="p-1 text-center bg-blue-100">Wednesday</div>
			<div class="p-1 text-center bg-blue-100">Thursday</div>
			<div class="p-1 text-center bg-blue-100">Friday</div>
			<div class="p-1 text-center bg-blue-100">Saturday</div>
		</div>
		<div class="border grid grid-cols-7 grid-rows-5 gap-px bg-slate-300">
			<div v-for="cell in cells" 
				:key="cell.date.toISOString()" 
				:class="['bg-white min-h-[100px]',
					cell.isToday ? '!bg-blue-50 ring-1 ring-blue-400' : '',
				    cell.isCurrentMonth ? 'bg-white' : 'bg-gray-200 text-gray-400']"
				@dragover.prevent @drop="onDrop($event, cell.date)">
				<slot :date="cell.date" :time-zone="timeZone"></slot>
			</div>
		</div>

	</div>
</template>
