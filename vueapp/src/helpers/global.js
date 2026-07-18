
import dayjs from 'dayjs'

// Ex: logJson('Detail', this.account)

export const logJson = (title, value) =>  
{ 
    console.log(`log ${title}:\n${JSON.parse(JSON.stringify(value, null, 4))}`)
}

export const hasKeys = (obj) => 
{
    if(typeof obj === 'undefined' || obj === null)
        return false
    
    return Object.keys(obj).length > 0
}

export const isEmpty        = value => value === undefined || value === null

export const isEmptyOrSpace = value => isEmpty(value) || (typeof value === 'string' && value.trim() === '')

export const numbersOnly    = (str, otherCharacters = '') =>
{
    let output = ''

    if(typeof str === 'undefined' || str == null)
        return ''

    for (let i = 0; i < str.length; i++)
    {
        if (("0123456789" + otherCharacters).indexOf(str[i]) != -1)
        {
            output += str[i]
        }
    }
    return output
}

export const usPhoneFormat = (str) =>
{
    if(typeof str === 'undefined' || str == null)
        return ''

    let out = numbersOnly(str)
    let country = ''   

    if(out.length === 11 && out[0] === '1')
    {
        country = out.slice(0,1)
        out     = out.slice(1)
    }

    if( out.length === 10)
    {
        let areacode    =  out.slice(0,3)
        let prefix      =  out.slice(3,6)
        let line        =  out.slice(6,10)

        return `${country}(${areacode}) ${prefix}-${line}`
    }
    return out
}

export const formatFileSize = (value) =>
{
	const bytes = Number(value)

	if (!Number.isFinite(bytes) || bytes < 0) return "-"

	if (bytes < 1024) return `${bytes} B`
	    const kb = bytes / 1024

	if (kb < 1024) return `${kb.toFixed(1)} KB`
	    const mb = kb / 1024
    
	if (mb < 1024) return `${mb.toFixed(1)} MB`
	    const gb = mb / 1024

	return `${gb.toFixed(1)} GB`
}

// USING DAYJS :  https://day.js.org/docs/en/display/format

export const dateTimeFormat     = (date, format) => dayjs(date).format(format || "MM-DD-YYYY h:mm:ss a")
export const dateFormat         = (date) => dayjs(date).format("MM-DD-YYYY")
export const dateTimeISO        = (date) => dayjs(date).toISOString()
export const dateISO            = (date) => dayjs(date).toISOString().slice(0,10)
export const weekdayFull        = (date) => dayjs(date).format('dddd - MMMM D, YYYY')
export const timeFormat         = (date) => dayjs(date).format("HH:mm:ss")
export const addDays            = (date, days) => 
{
    const newDate = new Date(date); 
    newDate.setDate(newDate.getDate() + days);
    return newDate; 
}

export const IsDuplicateMessage = (message, self)  =>
{
    let lastDate        = Date.parse(self.lastDateTime) 
    let milliseconds    = !isNaN(lastDate)  ? Date.now() - lastDate : undefined
    let isDuplicate     = milliseconds && milliseconds < self.duplicateThreshold && message === self.lastMessage

    // if(isDuplicate) console.log(`Duplicate Message: '${message}' ${milliseconds} shown ms ago`)

    return isDuplicate
}

export const MinutesToMs = (mins, minMinutes = 1)  => Number(Math.max(minMinutes, mins)) * 60 * 1000

export const stringToSafeArray = (value) => (value || '').toLowerCase().split(',').map((term) => term.trim()).filter(Boolean)
