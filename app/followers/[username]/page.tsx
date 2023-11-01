import getProfileByUsername from "@/actions/getProfileByUsername";
import getFollowersByUsername from "@/actions/getFollowersByUsername";
import FollowagePageContent from "@/components/general/FollowagePageContent";

interface IParams {
    username: string;
};

const FollowersPage = async ({ params }: { params: IParams }) => {
    const profile = await getProfileByUsername(params.username);

    if (!profile) {
        return (
            <div className="flex justify-center items-center w-full h-full text-xl font-bold text-yellow">
                No profile with username '{params.username}'
            </div>
        );
    }

    const followers = await getFollowersByUsername(params.username);

    return (
        <FollowagePageContent followage={followers} isFollowers={true} />
    );
};

export default FollowersPage;