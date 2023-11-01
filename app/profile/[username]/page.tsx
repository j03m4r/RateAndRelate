import getProfileByUsername from "@/actions/getProfileByUsername";
import ProfilePageContent from "./components/ProfilePageContent";
import getCurrentRatingByUsername from "@/actions/getCurrentRatingByUsername";
import getFollowersByUsername from "@/actions/getFollowersByUsername";
import getFollowingByUsername from "@/actions/getFollowingByUsername";

interface IParams {
    username: string;
};

const ProfilePage = async ({ params }: { params: IParams }) => {
    const profile = await getProfileByUsername(params.username);

    if (!profile) {
        return (
            <div className="flex justify-center items-center w-full h-full text-xl font-bold text-yellow">
                No profile with username '{params.username}'
            </div>
        );
    }

    const currentRating = await getCurrentRatingByUsername(params.username);
    const followers = await getFollowersByUsername(params.username);
    const following = await getFollowingByUsername(params.username);

    return (
        <ProfilePageContent profile={profile} currentRating={currentRating} followers={followers} following={following} />
    );
};

export default ProfilePage;