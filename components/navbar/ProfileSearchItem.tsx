import { Profile } from "@/types";
import Avatar from "../general/Avatar";
import useLoadAvatar from "@/hooks/useLoadAvatar";
import Link from "next/link";

interface ProfileSearchItemProps {
    profile: Profile;
};

const ProfileSearchItem: React.FC<ProfileSearchItemProps> = ({
    profile
}) => {
    const avatar_url = useLoadAvatar(profile.avatar_url);
    return (
        <Link href={`/profile/${profile.username}`} className="flex flex-row w-full py-2 px-4 mt-2 items-center justify-start gap-x-2
        hover:bg-yellow hover:text-primary text-yellow transition duration-300 cursor-pointer rounded-se-xl rounded-bl-xl">
            <Avatar src={avatar_url} />
            <div className="text-lg hover:underline cursor-pointer">{profile.username}</div>
        </Link>
    );
}

export default ProfileSearchItem;