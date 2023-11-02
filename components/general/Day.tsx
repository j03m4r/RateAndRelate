import Tooltip from "@/components/general/Tooltip";
import { useUser } from "@/hooks/useUser";
import { calculatePreviousDate } from "@/libs/DateCalculations";
import { RatingLimited } from "@/types";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

interface DayProps {
    dayNum: number;
    user_id: string;
};

const Day: React.FC<DayProps> = ({
    dayNum, user_id
}) => {
    const thisYear = new Date(new Date().getFullYear(), 0).getTime();
    const date = new Date(thisYear+(dayNum*24*60*60*1000));
    date.setDate(date.getDate()+1);
    date.setHours(16);
    date.setMinutes(59);
    const prevDay = calculatePreviousDate(date);

    const { supabaseClient } = useSessionContext();
    const { user } = useUser();
    const [rating, setRating] = useState<RatingLimited|null>();

    let rowStart = "row-start-1";
    if (dayNum===0) {
        rowStart = `row-start-${prevDay.getDay()+1}`
    }

    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await supabaseClient.from('ratings')
            .select('id, rating, created_at').eq('user_id', user_id)
            .gte('created_at', prevDay.toISOString()).lte('created_at', date.toISOString())
            .is('replying_to_rating_id', null);

            if (!error && data) {
                if (data[0]===undefined) return;
                setRating(data[0] as RatingLimited);
            } else {
                setRating(null);
            }
        };

        fetchData();
    }, [supabaseClient, user?.id]);

    const scrollIntoTheView = (id: string) => {
        let element = document.getElementById(id) as HTMLElement;
        if (!element) return;
    
        element.scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "center",
        });
    };

    return (
        <Tooltip content={prevDay.toDateString()}>
            <div onClick={rating ? () => scrollIntoTheView(rating.id.toString()) : () => {}} className={twMerge(`w-4 h-4 md:w-3 md:h-3 cu rounded-sm group`, 
            dayNum===0 ? rowStart : null, !rating ? 'hover:border hover:border-forestGreen' : rating.rating>=7 ? 
            'bg-spotifygreen cursor-pointer' : rating.rating>=4 ? 'bg-okayday cursor-pointer' : 'bg-error cursor-pointer')}>
            </div>
        </Tooltip>
    );
}

export default Day;