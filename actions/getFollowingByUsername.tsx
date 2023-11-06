import { FollowInstance } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
// import { cookies } from "next/dist/client/components/headers";
import { cookies } from 'next/headers';

const getFollowingByUsername = async (username: string): Promise<FollowInstance[]> => {
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
    .select('target_profile:target_profile_id(*), follower_profile:follower_profile_id(*)')
    .eq('follower_profile.username', username).filter('follower_profile', 'not.is', null);

    if (error) {
        console.log(error);
    }

    if (!data) {
        return [];
    }

    // @ts-ignore
    return data;
};

export default getFollowingByUsername;