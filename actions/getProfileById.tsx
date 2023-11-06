import { Profile } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
// import { cookies } from "next/dist/client/components/headers";
import { cookies } from 'next/headers';

const getProfileById = async (id: string): Promise<Profile|null> => {
    const supabase = createServerComponentClient({
        cookies: cookies
    });

    const {
        data: {
            session
        }
    } = await supabase.auth.getSession();

    if (!session) { return null }

    const { data, error } = await supabase.from('profiles')
    .select('*, ratings(*, profiles(id, username, avatar_url), replying_to:replying_to_rating_id(profiles(username)))').eq('id', id);

    if (error) {
        console.log(error);
    }

    if (!data) {
        return null;
    }

    let metaData = data[0]
    // @ts-ignore
    metaData.ratings = metaData.ratings.map((rating) => {
        if (!rating.replying_to) return rating;
        return {
            ...rating,
            // @ts-ignore
            replying_to: rating.replying_to.profiles.username
        }
    });

    return metaData;
};

export default getProfileById;