import FollowagePageContent from "@/components/general/FollowagePageContent";
import getProfileById from "@/actions/getProfileById";
import getFollowersById from "@/actions/getFollowersById";

interface IParams {
    id: string;
};

const FollowersPage = async ({ params }: { params: IParams }) => {
    const profile = await getProfileById(params.id);

    if (!profile) {
        return (
            <div className="flex justify-center items-center w-full h-full text-xl font-bold text-yellow">
                No profile with id &apos;{params.id}&apos;
            </div>
        );
    }

    const followers = await getFollowersById(params.id);

    return (
        <FollowagePageContent followage={followers} isFollowers={true} />
    );
};

export default FollowersPage;