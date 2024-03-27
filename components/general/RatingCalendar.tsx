import { twMerge } from "tailwind-merge";
import Day from "./Day";
import { usePathname } from "next/navigation";

interface RatingCalendarProps {
    user_id: string;
    mode: string;
};

const RatingCalendar: React.FC<RatingCalendarProps> = ({ user_id, mode }) => {
    const days = Array(365).fill(0).map((_, i) => i);
    const pathname = usePathname();
    return (
        <div className="select-none flex flex-col w-full h-fit gap-y-2 -mt-4">
            <div className="flex justify-around w-full text-yellow overflow-x-scroll text-forestGreen">
                <div>Jan</div>
                <div>Feb</div>
                <div>Mar</div>
                <div>Apr</div>
                <div>May</div>
                <div>Jun</div>
                <div>Jul</div>
                <div>Aug</div>
                <div>Sep</div>
                <div>Oct</div>
                <div>Nov</div>
                <div>Dec</div>
            </div>
            <div className={twMerge(`grid grid-cols-53 grid-rows-7 grid-flow-col gap-x-6 gap-y-2 md:gap-x-4 md:gap-y-1 xl:gap-1 overflow-x-scroll`,
            pathname==='/'&&'overflow-x-hidden')}>
                {days.map((day) => (
                    <Day key={day} dayNum={day} mode={mode} user_id={user_id} />
                ))}
            </div>
        </div>

    );
}

export default RatingCalendar;