import { calculatePreviousDate } from "@/libs/DateCalculations";
import { Rating } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
// import { cookies } from "next/dist/client/components/headers";
import { cookies } from 'next/headers';

const getCurrentRatingById = async (id: string): Promise<Rating|null> => {
    const supabase = createServerComponentClient({
        cookies: cookies
    });

    const {
        data: {
            session
        }
    } = await supabase.auth.getSession();

    if (!session) { return null }

    const today = new Date();
    const prevDay = calculatePreviousDate(today);

    const { data, error } = await supabase.from('ratings')
    .select('*, profiles!inner(id, username, avatar_url)').eq('profiles.id', id)
    .gte('created_at', prevDay.toISOString()).lte('created_at', today.toISOString()).is('replying_to_rating_id', null);

    if (error) {
        console.log(error);
    }

    if (!data) {
        return null;
    }

    return data[0] as Rating;
};

export default getCurrentRatingById;