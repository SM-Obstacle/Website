import dayjs from "dayjs"
import calendar from 'dayjs/plugin/calendar';

dayjs.extend(calendar);

function formatTimeAgo(date: string) {
    const day = dayjs(date);
    return day.calendar(null, { lastWeek: 'dddd [at] h:mm A', sameElse: 'MMMM D, YYYY h:mm A' });
}

const TimeAgoComponent = ({ date }: { date: string }) => (
    <span>{formatTimeAgo(date)}</span>
);

export default TimeAgoComponent;
