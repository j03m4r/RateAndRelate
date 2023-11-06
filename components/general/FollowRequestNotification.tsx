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

interface FollowRequestNotificationProps {
    notification: Notification;
};

const FollowRequestNotification: React.FC<FollowRequestNotificationProps> = ({
    notification,
}) => {
    const avatar_url = useLoadAvatar(notification.from_profile.avatar_url);
    const { supabaseClient } = useSessionContext();

    const [isLoading, setIsLoading] = useState(false);

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

    const handleAccept = async () => {
        setIsLoading(true);

        try {
            const target_profile_id = notification.to_profile.id;
            const follower_profile_id = notification.from_profile.id;

            const { error } = await supabaseClient.from('followers').insert({
                target_profile_id: target_profile_id,
                follower_profile_id: follower_profile_id
            });

            if (error) {
                toast.error(error.message);
            } else {
                toast.success('Followers +1!');
                deleteNotification();
            }
        } catch {
            toast.error("Something went wrong")
        } finally {
            setIsLoading(false);
            router.refresh();
        }
    };

    return (
        <div className="flex flex-row justify-between items-center px-6 py-3 text-sm">
            <div className="flex flex-row justify-center items-center gap-x-2 max-w-1/2 overflow-x-hidden">
                <Avatar src={avatar_url} />
                <div className="flex flex-col justify-center items-start">
                    <div className="text-orange text-md">Follow Request</div>
                    <Link href={`/profile/${notification.from_profile.id}`} className="cursor-pointer transition hover:underline">{notification.from_profile.username}</Link>
                </div>
            </div>
            <div className="flex flex-row gap-x-2">
                <Button onClick={handleAccept} disabled={isLoading} className="text-sm px-2 py-1 hover:text-orange
                rounded-se-xl rounded-bl-xl duration-200"> {/* write an "handleAccept" internal function that handles friend request acceptions AND make this button conditionally appear based on what type of notification it is OR make separate notification items */}
                    Accept
                </Button>
                <Button onClick={deleteNotification} disabled={isLoading} className="hover:text-error transition duration-200">
                    <MdClose size={15} />
                </Button>
            </div>
        </div>
    );
}

export default FollowRequestNotification;