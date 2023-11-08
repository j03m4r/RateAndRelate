import { calculatePreviousDate } from "@/libs/DateCalculations";
import { Rating } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from 'next/headers';

const getCommunityRatings = async (): Promise<Rating[]> => {
    const supabase = createServerComponentClient({
        cookies: cookies
    });

    const {
        data: {
            session
        }
    } = await supabase.auth.getSession();

    if (!session) { return [] }

    const today = new Date();
    const prevDay = calculatePreviousDate(today);

    const { data, error } = await supabase.from('followers')
    .select('target_profile:target_profile_id(ratings(*, profiles(*))), follower_profile:follower_profile_id(ratings(*, profiles(*)))')
    .eq('follower_profile.id', session.user.id).filter('follower_profile', 'not.is', null).filter('target_profile', "not.is", null)
    .gte('target_profile.ratings.created_at', prevDay.toISOString()).lte('target_profile.ratings.created_at', today.toISOString())
    .is('target_profile.ratings.replying_to_rating_id', null).filter('target_profile.ratings', "not.is", null)
    .order('created_at', { ascending: false });

    if (error) {
        console.log(error);
    }

    if (!data) {
        return [];
    }

    // @ts-ignore
    return (data.map((followageInstance) => {
        return {
            // @ts-ignore
            ...followageInstance.target_profile.ratings[0]
        }
    }) as Rating[]);
};

export default getCommunityRatings;