import Tooltip from "@/components/general/Tooltip";
import { calculatePreviousDate } from "@/libs/DateCalculations";
import { RatingLimited } from "@/types";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

interface AverageDayProps {
    dayNum: number;
    mode: string;
    user_id: string;
};

const Day: React.FC<AverageDayProps> = ({
    dayNum, mode, user_id
}) => {
    let _dayNum;
    if (dayNum < 105) {
        _dayNum = Math.floor(dayNum / 53) + ((dayNum % 53) * 7);
    } else if (dayNum<157) {
        _dayNum = Math.floor(dayNum / 52) + ((dayNum % 105) * 7);
    } else if (dayNum<208) {
        _dayNum = Math.floor(dayNum / 52) + ((dayNum % 157) * 7);
    } else if (dayNum<260) {
        _dayNum = Math.floor(dayNum / 52) + ((dayNum % 209) * 7);
    } else if (dayNum<312) {
        _dayNum = Math.floor(dayNum / 52) + ((dayNum % 261) * 7);
    } else {
        _dayNum = Math.floor(dayNum / 52) + ((dayNum % 313) * 7);
    }

    if (dayNum===104) {
        _dayNum = 358;
    } else if (dayNum===156) {
        _dayNum = 359;
    } else if (dayNum===208) {
        _dayNum = 360;
    } else if (dayNum===260) {
        _dayNum = 361;
    } else if (dayNum===312) {
        _dayNum = 362;
    } else if (dayNum===364) {
        _dayNum = 363;
    }

    const thisYear = new Date(new Date().getFullYear(), 0).getTime();
    const date = new Date(thisYear+(_dayNum*24*60*60*1000));
    date.setDate(date.getDate()+1);
    date.setHours(5);
    date.setMinutes(59);
    const prevDay = calculatePreviousDate(date);

    const { supabaseClient } = useSessionContext();
    const [rating, setRating] = useState<number>(-1);
    const [ratingId, setRatingId] = useState<number>(-1);

    let rowStart = "row-start-2";
    if (dayNum===0) {
        rowStart = `row-start-${prevDay.getDay()+2}`
    }

    useEffect(() => {
        const fetchData = async () => {
            if (mode==='explore') {
                const { data, error } = await supabaseClient.from('ratings')
                .select('id, rating, created_at').gte('created_at', prevDay.toISOString())
                .gte('created_at', prevDay.toISOString()).lte('created_at', date.toISOString())
                .is('isPublic', true).is('replying_to_rating_id', null);

                if (!error && data) {
                    if (data.length===0) return;
                    const averageRating = data.reduce((sum, rating) => sum + rating.rating, 0) / data.length;
                    setRating(averageRating);
                } else {
                    setRating(-1);
                }
            } else if (mode==='home'&&user_id) {
                const { data, error } = await supabaseClient.from('followers')
                .select('target_profile:target_profile_id(ratings(*, profiles(*))), follower_profile:follower_profile_id(ratings(*, profiles(*)))')
                .eq('follower_profile.id', user_id).filter('follower_profile', 'not.is', null).filter('target_profile', "not.is", null)
                .gte('target_profile.ratings.created_at', prevDay.toISOString()).lte('target_profile.ratings.created_at', date.toISOString())
                .is('target_profile.ratings.replying_to_rating_id', null).filter('target_profile.ratings', "not.is", null)
                .order('created_at', { ascending: false });

                if (!data) return;

                if (!error && data) {
                    if (data.length===0) return;
                    // @ts-ignore
                    const averageRating = data.reduce((sum, rating) => sum + rating.target_profile.ratings[0].rating, 0) / data.length;
                    setRating(averageRating);
                } else {
                    setRating(-1);
                }
            } else {
                const { data, error } = await supabaseClient.from('ratings')
                .select('id, rating, created_at').eq('user_id', user_id)
                .gte('created_at', prevDay.toISOString()).lte('created_at', date.toISOString())
                .is('replying_to_rating_id', null);

                if (!error && data) {
                    if (data[0]===undefined) return;
                    setRating(data[0].rating);
                    setRatingId(data[0].id);
                } else {
                    setRating(-1);
                }
            }
        };

        fetchData();
    }, [supabaseClient,user_id]);

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
            <div onClick={rating!==-1&&mode==='profile' ? () => scrollIntoTheView(ratingId.toString()) : () => {}} className={twMerge(`w-4 h-4 md:w-3 md:h-3 rounded-sm`, 
            dayNum===0 ? rowStart : null, rating===-1 ? 'hover:border hover:border-forestGreen' : rating>=7 ? 
            'bg-spotifygreen' : rating>=4 ? 'bg-okayday' : 'bg-error', mode==='profile'&&rating!==-1&&'cursor-pointer',
            (dayNum===104||dayNum===156||dayNum===208||dayNum===260||dayNum===312)&&'col-span-2')}>
            </div>
        </Tooltip>
    );
}

export default Day;