"use state";

import useLoadAvatar from "@/hooks/useLoadAvatar";
import { Notification } from "@/types";
import Avatar from "./Avatar";
import Button from "../buttons/Button";
import { MdClose } from "react-icons/md";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

interface FollowNotificationProps {
    notification: Notification;
};

enum FollowState {
    UNDEFINED = 0,
    FOLLOWING = 1,
    UNFOLLOWED = 3
};

const FollowNotification: React.FC<FollowNotificationProps> = ({
    notification,
}) => {
    const avatar_url = useLoadAvatar(notification.from_profile.avatar_url);
    const { supabaseClient } = useSessionContext();

    const [isLoading, setIsLoading] = useState(false);
    const [followState, setFollowState] = useState<FollowState>(FollowState.UNDEFINED);

    const router = useRouter();

    const deleteNotification = async () => {
        setIsLoading(true);

        try {
            const { error } = await supabaseClient.from('notifications').delete()
            .eq('id', notification.id);

            if (error) {
                toast.error(error.message);
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
            router.refresh();
        }
    };

    const handleClick = async () => {
        setIsLoading(true);
        try {
            if (followState===FollowState.UNFOLLOWED) {
                const target_profile_id = notification.to_profile_id;
                const follower_profile_id = notification.from_profile.id;

                const { error } = await supabaseClient.from('followers').insert({
                    target_profile_id: follower_profile_id,
                    follower_profile_id: target_profile_id
                });

                if (error) {
                    toast.error(error.message);
                } else {
                    toast.success('Following +1!');
                    deleteNotification();
                }
            } else {
                const { error } = await supabaseClient.from('followers').delete()
                .eq('target_profile_id', notification.from_profile.id).eq('follower_profile_id', notification.to_profile_id);

                if (error) {
                    toast.error(error.message);
                } else {
                    toast.success("Unfollowed");
                    deleteNotification();
                }
            }
        } catch {
            toast.error("Something went wrong")
        } finally {
            setIsLoading(false);
            router.refresh();
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await supabaseClient.from('followers').select('target_profile_id, follower_profile_id')
            .eq('follower_profile_id', notification.to_profile_id).eq('target_profile_id', notification.from_profile.id);

            if (!error && data && data.length!==0) {
                setFollowState(FollowState.FOLLOWING);
            } else {
                setFollowState(FollowState.UNFOLLOWED);
            }
        };

        fetchData();
    }, [notification]);

    const buttonContent = followState===FollowState.FOLLOWING ? "Unfollow" : "Follow back";

    return (
        <div className="flex flex-row justify-between items-center px-6 py-3 text-sm">
            <div className="flex flex-row justify-center items-center gap-x-2 max-w-1/2 overflow-x-hidden">
                <Avatar src={avatar_url} />
                <div className="flex flex-col justify-center items-start">
                    <Link href={`/profile/${notification.from_profile.id}`} className="cursor-pointer transition hover:underline">{notification.from_profile.username}</Link>
                    <div className="text-orange text-md">followed you</div>
                </div>
            </div>
            <div className="flex flex-row gap-x-2">
                <Button onClick={handleClick} disabled={isLoading} className={twMerge(`text-sm px-2 py-1 hover:text-orange hover:scale-105
                rounded-se-xl rounded-bl-xl duration-300`, followState===FollowState.UNDEFINED ? 'hidden' : 'block')}>
                    {buttonContent}
                </Button>
                <Button onClick={deleteNotification} disabled={isLoading} className="hover:text-error transition duration-200">
                    <MdClose size={15} />
                </Button>
            </div>
        </div>
    );
}

export default FollowNotification;