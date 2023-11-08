import { Notification } from "@/types";
import Link from "next/link";
import Button from "../buttons/Button";
import useLoadAvatar from "@/hooks/useLoadAvatar";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { MdClose } from "react-icons/md";
import Avatar from "./Avatar";

interface CommentNotificationProps {
    notification: Notification;
};

const CommentNotification: React.FC<CommentNotificationProps> = ({
    notification
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

    return (
        <div className="flex justify-between items-center px-6 py-3">
            <div className="flex flex-row items-center justify-center gap-x-2">
                <Avatar src={avatar_url} />
                <div className="flex justify-center items-center gap-x-1">
                    <Link href={`/profile/${notification.from_profile.id}`} className="cursor-pointer transition text-orange font-semibold hover:underline">
                    {notification.from_profile.username}
                    </Link>
                    <div>rated your rating</div>
                </div>
            </div>
            <Button onClick={deleteNotification} disabled={isLoading} className="hover:text-error transition duration-200">
                    <MdClose size={15} />
            </Button>
        </div>
    );
}

export default CommentNotification;