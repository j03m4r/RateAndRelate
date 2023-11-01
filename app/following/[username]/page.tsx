import getFollowingByUsername from "@/actions/getFollowingByUsername";
import getProfileByUsername from "@/actions/getProfileByUsername";
import FollowagePageContent from "@/components/general/FollowagePageContent";

interface IParams {
    username: string;
};

const FollowingPage = async ({ params }: { params: IParams }) => {
    const profile = await getProfileByUsername(params.username);

    if (!profile) {
        return (
            <div className="flex justify-center items-center w-full h-full text-xl font-bold text-yellow">
                No profile with username '{params.username}'
            </div>
        );
    }

    const following = await getFollowingByUsername(params.username);

    return (
        <FollowagePageContent followage={following} isFollowers={false} />
    );
};

export default FollowingPage;