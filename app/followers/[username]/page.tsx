import getProfileByUsername from "@/actions/getProfileByUsername";
import getFollowersByUsername from "@/actions/getFollowersByUsername";
import FollowagePageContent from "@/components/general/FollowagePageContent";

interface IParams {
    username: string;
};

export default async function FollowersPage(params: IParams) {
    const profile = await getProfileByUsername(params.username);

    if (!profile) {
        return (
            <div className="flex justify-center items-center w-full h-full text-xl font-bold text-yellow">
                No profile with username &apos;{params.username}&apos;
            </div>
        );
    }

    const followers = await getFollowersByUsername(params.username);

    return (
        <FollowagePageContent followage={followers} isFollowers={true} />
    );
};