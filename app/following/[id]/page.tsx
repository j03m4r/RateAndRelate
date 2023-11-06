import getFollowingById from "@/actions/getFollowingById";
import getProfileById from "@/actions/getProfileById";
import FollowagePageContent from "@/components/general/FollowagePageContent";

interface IParams {
    id: string;
};

const FollowingPage = async ({ params }: { params: IParams }) => {
    const profile = await getProfileById(params.id);

    if (!profile) {
        return (
            <div className="flex justify-center items-center w-full h-full text-xl font-bold text-yellow">
                No profile with id &apos;{params.id}&apos;
            </div>
        );
    }

    const following = await getFollowingById(params.id);

    return (
        <FollowagePageContent followage={following} isFollowers={false} />
    );
};

export default FollowingPage;