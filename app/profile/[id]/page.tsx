import ProfilePageContent from "./components/ProfilePageContent";
import getCurrentRatingById from "@/actions/getCurrentRatingById";
import getFollowersById from "@/actions/getFollowersById";
import getFollowingById from "@/actions/getFollowingById";
import getProfileById from "@/actions/getProfileById";

interface IParams {
    id: string;
};

const ProfilePage = async ({ params }: { params: IParams }) => {
    const profile = await getProfileById(params.id);

    if (!profile) {
        return (
            <div className="flex justify-center items-center w-full h-full text-xl font-bold text-yellow">
                No profile with id &apos;{params.id}&apos;
            </div>
        );
    }

    const currentRating = await getCurrentRatingById(params.id);
    const followers = await getFollowersById(params.id);
    const following = await getFollowingById(params.id);

    console.log(profile.ratings)
    return (
        <ProfilePageContent profile={profile} currentRating={currentRating} followers={followers} following={following} />
    );
};

export default ProfilePage;