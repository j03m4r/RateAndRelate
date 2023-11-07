import RatingCard from "@/components/general/RatingCard";
import { Profile } from "@/types";

interface ProfileRatingFeedProps {
    profile: Profile;
};

const ProfileRatingFeed: React.FC<ProfileRatingFeedProps> = ({ profile }) => {
    return (
        <div>
            {profile.ratings ? (
                <div className="flex flex-col-reverse items-center w-full gap-y-14 md:gap-y-16"> {/* Today's ratings. Twitter-like feed */}
                    {profile.ratings.map((rating) => (
                        <RatingCard key={rating.id} rating={rating} n={0} />
                    ))}
                </div>
            ) : (
                <div className="flex justify-center items-center w-full h-full text-xl font-bold text-yellow">
                    No ratings yet!
                </div>
            )}
        </div>
    );
}

export default ProfileRatingFeed;