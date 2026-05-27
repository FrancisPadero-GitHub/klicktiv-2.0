import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
import relativeTime from "dayjs/plugin/relativeTime"
import isoWeek from "dayjs/plugin/isoWeek"

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(relativeTime)
dayjs.extend(isoWeek)

// Detect browser timezone
export const userTimezone = dayjs.tz.guess()

export default dayjs
