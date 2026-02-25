
export default class EventModel 
{
    constructor(id, date, title) 
    {
		this.id			= id || 0
		this.date		= this.parseDate(date),
		this.title		= title || 'New Event'
    }

	parseDate(value) 
	{
		if (!value) return null
		if (value instanceof Date) return value.toISOString().slice(0, 10)
		return value
	}
}