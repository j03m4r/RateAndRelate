import Button from "@/components/buttons/Button";
import FollowageButton from "@/components/buttons/FollowageButton";
import Avatar from "@/components/general/Avatar";
import RateDayButton from "@/components/buttons/RateDayButton";
import useLoadAvatar from "@/hooks/useLoadAvatar";
import { useUser } from "@/hooks/useUser";
import { Profile, Rating } from "@/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

interface ProfileHeaderProps {
    profile: Profile;
    currentRating: Rating|null;
    followerCount: number;
    followingCount: number;
};

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
    profile, currentRating, followerCount, followingCount
}) => {
    const avatar_url = useLoadAvatar(profile.avatar_url || '');

    const { user } = useUser();

    const [isOwnProfile, setIsOwnProfile] = useState(false);

    let averageRating = -1;
    if (profile.ratings) {
        // @ts-ignore
        const filteredRatings = profile.ratings.filter((rating) => rating.replying_to===null);
        averageRating = filteredRatings.reduce((sum, rating) => sum + rating.rating, 0) / filteredRatings.length
    }

    useEffect(() => {
        if (!user) {
            return;
        } else if (user.id!==profile.id) {
            setIsOwnProfile(false);
        } else {
            setIsOwnProfile(true);
        }
    }, [user]);

    return (
        <div className="flex flex-col lg:flex-row items-center gap-x-10 gap-y-5"> {/* Header container */}
            <div className="flex flex-col gap-y-5 justify-center items-center text-center w-1/3"> {/* Profile picture container */}
                <div className="relative">
                    <Avatar size={3} src={avatar_url} />
                    <div className="absolute right-0 bottom-0">
                        <FollowageButton targetProfileId={profile.id} />
                    </div>
                </div>
                <div className="text-5xl font-semibold text-yellow">{profile.username}</div>
                <div className="select-none flex flex-row justify-center items-center w-full gap-x-5 text-yellow font-light text-lg cursor-pointer">
                    <Link href={`/followers/${profile.id}`} className="hover:underline hover:text-orange">{followerCount} Followers</Link>
                    <Link href={`/following/${profile.id}`} className="hover:underline hover:text-orange">{followingCount} Following</Link>
                </div>
            </div>
            <div className="flex flex-col-reverse md:flex-row justify-evenly items-center w-2/3 h-full gap-x-10"> {/* Daily stats larger container */}
                <div className="select-none flex flex-col justify-center items-center w-full md:w-1/2 h-[36vh] 
                rounded-se-xl rounded-bl-xl"> {/* Your rating today container */}
                    {currentRating ? (
                        <> {/* Your rating of today */}
                            <div className="text-yellow text-md font-light text-center">TODAY</div>
                            <div className={twMerge(`select-none text-8xl lg:text-9xl font-bold`, currentRating.rating>=7 ? 'text-spotifygreen' 
                            : currentRating.rating>=4 ? 'text-okayday' : 'text-error')}> 
                                {currentRating.rating}
                            </div>
                        </>
                    ) : isOwnProfile ? (
                        <RateDayButton />
                    ) : (
                        <> {/* Your rating of today */}
                            <div className="text-yellow text-md font-light text-center">TODAY</div>
                            <div className={twMerge(`select-none text-4xl font-bold text-forstGreen text-center`)}> 
                                NONE &#40;YET&#41;
                            </div>
                        </>
                    )}
                </div>
                <div className="select-none flex flex-col justify-center items-center w-full md:w-1/2 h-[36vh]
                rounded-se-xl rounded-bl-xl"> {/* Your rating today container */}
                    <div className="text-yellow text-md font-light text-center">AVERAGE</div>
                    <div className={twMerge(`select-none text-8xl lg:text-9xl font-bold`, averageRating>=7 ? 'text-spotifygreen' 
                    : averageRating>=4 ? 'text-okayday' : averageRating>=0 ? 'text-error' : 'text-forestGreen')}> 
                        {!Number.isNaN(averageRating) ? averageRating.toFixed(1) : "NONE"} {/* Right now average rating is calculated using ALL ratings. Maybe it should only be 
                        daily ratings */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfileHeader;