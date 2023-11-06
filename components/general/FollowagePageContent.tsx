"use client";

import { FollowInstance, Profile } from "@/types";
import FollowageProfileItem from "./FollowageProfileItem";
import { useEffect } from "react";
import { useUser } from "@/hooks/useUser";
import useSetupProfileModal from "@/hooks/useSetupProfileModal";
import { useRouter } from "next/navigation";

interface FollowagePageContentProps {
    followage: FollowInstance[];
    isFollowers: boolean;
};

const FollowagePageContent: React.FC<FollowagePageContentProps> = ({
    followage, isFollowers
}) => {
    const { profile } = useUser();
    const setupProfileModal = useSetupProfileModal();
    const router = useRouter();

    useEffect(() => {
        if (!profile) return;
        if (!profile.username) setupProfileModal.onOpen();
        else {
            setupProfileModal.onClose();
            router.refresh();
        }
    }, [setupProfileModal.isOpen,profile]);

    return (
        <div className="flex flex-col gap-y-2 pt-24 pb-10 md:pb-16 md:px-16">
            <div className="text-4xl font-semibold text-forestGreen">{followage.length} {isFollowers ? "Followers" : "Following"}</div>
            {followage.map((followInstance, i) => {
                let followageProfile: Profile;
                if (isFollowers) {
                    followageProfile = followInstance.follower_profile;
                } else {
                    followageProfile = followInstance.target_profile;
                }

                return <FollowageProfileItem key={i} profile={followageProfile} />
            })}
        </div>
    );
}

export default FollowagePageContent;