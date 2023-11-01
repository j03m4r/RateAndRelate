import { calculatePreviousDate } from "@/libs/DateCalculations";
import { Rating } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/dist/client/components/headers";

const getPublicRatings = async (): Promise<Rating[]> => {
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

    const { data, error } = await supabase.from('ratings')
    .select('*, profiles(*)').gte('created_at', prevDay.toISOString()).lte('created_at', today.toISOString())
    .order('created_at', { ascending: false })
    .is('isPublic', true).is('replying_to_rating_id', null);

    if (error) {
        console.log(error);
    }

    if (!data) {
        return [];
    }

    // @ts-ignore
    return (data as Rating[]);
};

export default getPublicRatings;