import Tooltip from "@/components/general/Tooltip";
import { useUser } from "@/hooks/useUser";
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

const AverageDay: React.FC<AverageDayProps> = ({
    dayNum, mode, user_id
}) => {
    const thisYear = new Date(new Date().getFullYear(), 0).getTime();
    const date = new Date(thisYear+(dayNum*24*60*60*1000));
    date.setDate(date.getDate()+1);
    date.setHours(16);
    date.setMinutes(59);
    const prevDay = calculatePreviousDate(date);

    const { supabaseClient } = useSessionContext();
    const [rating, setRating] = useState<number>(0);

    let rowStart = "row-start-1";
    if (dayNum===0) {
        rowStart = `row-start-${prevDay.getDay()+1}`
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
                    setRating(0);
                }
            }            
        };

        fetchData();
    }, [supabaseClient,user_id]);

    return (
        <Tooltip content={prevDay.toDateString()}>
            <div className={twMerge(`w-4 h-4 md:w-3 md:h-3 cu rounded-sm group`, 
            dayNum===0 ? rowStart : null, rating===0 ? 'hover:border hover:border-forestGreen' : rating>=7 ? 
            'bg-spotifygreen' : rating>=4 ? 'bg-okayday' : 'bg-error')}>
            </div>
        </Tooltip>
    );
}

export default AverageDay;