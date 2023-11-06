import { useUser } from "@/hooks/useUser";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BsFillPersonPlusFill, BsFillPersonDashFill, BsClockHistory } from "react-icons/bs";
import { twMerge } from "tailwind-merge";

interface FollowageButtonProps {
    targetProfileId: string;
};

enum FollowState {
    UNDEFINED = 0,
    FOLLOWING = 1,
    REQUESTED = 2,
    UNFOLLOWED = 3
};

const FollowageButton: React.FC<FollowageButtonProps> = ({
    targetProfileId
}) => {
    const router = useRouter();
    const { supabaseClient } = useSessionContext();

    const { user } = useUser();

    const [isOwnProfile, setIsOwnProfile] = useState(true);
    const [followState, setFollowState] = useState<FollowState>(FollowState.UNDEFINED);

    useEffect(() => {
        if (!user) {
            return;
        }

        const fetchData = async () => {
            const { data, error } = await supabaseClient.from('followers').select('target_profile:target_profile_id(*), follower_profile:follower_profile_id(*)')
            .eq('follower_profile.id', user.id).eq('target_profile.id', targetProfileId).filter('follower_profile', 'not.is', null)
            .filter('target_profile', 'not.is', null);

            if (!error && data && data.length!==0) {
                setFollowState(FollowState.FOLLOWING);
            } else {
                const { data, error } = await supabaseClient.from('notifications').select('*')
                .eq('from_profile_id', user.id).eq('to_profile_id', targetProfileId).eq('type', 1);

                if (!error && data && data.length!==0) {
                    setFollowState(FollowState.REQUESTED);
                } else {
                    setFollowState(FollowState.UNFOLLOWED);
                }
            }
        };

        fetchData();
    }, [targetProfileId, supabaseClient, user]);

    useEffect(() => {
        if (!user) {
            return;
        } else if (user.id!==targetProfileId) {
            setIsOwnProfile(false);
        }
    }, [user]);

    const Icon = followState===FollowState.FOLLOWING ? BsFillPersonDashFill : (followState===FollowState.UNFOLLOWED ? BsFillPersonPlusFill : BsClockHistory);
    // const toolTipContent = followState===FollowState.FOLLOWING ? "Unfollow" : (followState===FollowState.UNFOLLOWED ? "Follow" : "Cancel Request");

    const handleClick = async () => {
        if (!user) {
            return;
        }

        if (followState===FollowState.FOLLOWING) {
            const { error } = await supabaseClient.from('followers').delete()
            .eq('target_profile_id', targetProfileId).eq('follower_profile_id', user.id);

            if (error) {
                toast.error(error.message);
            } else {
                toast.success("Unfollowed");
                setFollowState(FollowState.UNFOLLOWED);
            }
        } else if (followState===FollowState.REQUESTED) {
            const { error } = await supabaseClient.from('notifications').delete()
            .eq('to_profile_id', targetProfileId).eq('from_profile_id', user.id).eq("type", 1);

            if (error) {
                toast.error(error.message);
            } else {
                toast.success("Follow Request Cancelled")
                setFollowState(FollowState.UNFOLLOWED);
            }
        } else {
            const { error } = await supabaseClient.from('notifications')
            .insert({type: 1, to_profile_id: targetProfileId, from_profile_id: user.id});

            if (error) {
                toast.error(error.message);
            } else {
                toast.success('Follow request sent!');
                setFollowState(FollowState.REQUESTED);
            }
        }

        router.refresh();
    };
    
    return (
        // <Tooltip content={toolTipContent}>
            <div onClick={handleClick} className={twMerge(`select-none flex justify-center items-center p-6 rounded-full bg-forestGreen text-cream
            cursor-pointer transition hover:scale-105`, isOwnProfile||followState===FollowState.UNDEFINED ? 'hidden' : 'block')}>
                <Icon size={35} />
            </div>
        // </Tooltip>
    );
}

export default FollowageButton;