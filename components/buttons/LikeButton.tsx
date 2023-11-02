import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import Button from "./Button";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { LikedRating } from "@/types";

interface LikeButtonProps {
    ratingId: number;
};

const LikeButton: React.FC<LikeButtonProps> = ({
    ratingId
}) => {
    const router = useRouter();
    const { supabaseClient } = useSessionContext();
    const { user, isLoading } = useUser();

    const [isLiked, setIsLiked] = useState(false);
    const [likes, setLikes] = useState<LikedRating[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            if (!user || isLoading) {
                return;
            }
            
            const { data, error } = await supabaseClient.from('liked_ratings').select('*')
            .eq('rating_id', ratingId);

            if (!error && data) {
                setLikes(data);
                const filteredLikes = data.filter((item) => item.profile_id===user.id);
                if (filteredLikes.length) setIsLiked(true);
            }
        };

        fetchData();
    }, [user,isLoading,supabaseClient,ratingId]);

    const Icon = isLiked ? AiFillHeart : AiOutlineHeart;

    const handleLike = async () => {
        if (!user) {
            return;
        }

        if (isLiked) {
            const { error } = await supabaseClient.from('liked_ratings').delete()
            .eq('profile_id', user.id).eq('rating_id', ratingId);

            if (error) {
                toast.error(error.message);
            } else {
                setIsLiked(false);
                setLikes((prev) => (prev.slice(0, prev.length-1)))
            }
        } else {
            const { error } = await supabaseClient.from('liked_ratings').insert({rating_id: ratingId, profile_id: user.id});

            if (error) {
                toast.error(error.message);
            } else {
                setIsLiked(true);
                setLikes((prev) => ([...prev, { rating_id: ratingId, profile_id: user.id}]))
                toast.success('Liked!');
            }
        }

        router.refresh();
    };
    
    return (
        <Button onClick={handleLike} className="relative text-forestGreen hover:text-orange duration-200 transition ease-in-out">
            <Icon size={28} />
            <div className={twMerge(`absolute -right-1 -bottom-1 font-bold text-sm`, 
            likes.length >= 1 ? 'block' : 'hidden')}>
                {likes.length >= 99 ? "99+" : likes.length}
            </div>
        </Button>
    );
}

export default LikeButton;