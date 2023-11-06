import { FollowInstance } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from 'next/headers';

const getFollowersById = async (id: string): Promise<FollowInstance[]> => {
    const supabase = createServerComponentClient({
        cookies: cookies
    });

    const {
        data: {
            session
        }
    } = await supabase.auth.getSession();

    if (!session) { return [] }

    const { data, error } = await supabase.from('followers')
    .select('target_profile_id, follower_profile:follower_profile_id(*)')
    .eq('target_profile_id', id);

    if (error) {
        console.log(error);
    }

    if (!data) {
        return [];
    }

    // @ts-ignore
    return data;
};

export default getFollowersById;
