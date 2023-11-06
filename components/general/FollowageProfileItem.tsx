"use state";

import { Profile } from "@/types";
import Link from "next/link";
import Avatar from "./Avatar";
import useLoadAvatar from "@/hooks/useLoadAvatar";

interface FollowageProfileItemProps {
    profile: Profile;
};

const FollowageProfileItem: React.FC<FollowageProfileItemProps> = ({
    profile
}) => {
    const avatar_url = useLoadAvatar(profile.avatar_url);
    return (
        <Link href={`/profile/${profile.username}`} className="flex flex-row w-full py-4 px-8 mt-2 items-center justify-start gap-x-2
        hover:bg-forestGreen hover:text-white text-forestGreen transition duration-300 cursor-pointer rounded-se-xl rounded-bl-xl">
            <Avatar src={avatar_url} />
            <div className="text-lg hover:underline cursor-pointer">{profile.username}</div>
        </Link>
    );
}

export default FollowageProfileItem;