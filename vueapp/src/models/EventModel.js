
export default class EventModel 
{
    constructor(date, id, title) 
    {
		this.id			= id || 0
		this.date		= date.toISOString().slice(0, 10),
		this.title		= title || 'New Event'
    }
}