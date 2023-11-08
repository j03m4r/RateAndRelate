import { ReplyRating } from "@/types";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import Avatar from "./Avatar";
import useLoadAvatar from "@/hooks/useLoadAvatar";
import Button from "../buttons/Button";
import { AiOutlineComment } from 'react-icons/ai';
import LikeButton from "../buttons/LikeButton";

interface RatingItemProps {
    rating: ReplyRating;
    isCommenting: boolean;
    showReplies: boolean;
    n: number;
    numReplies: number;
    ratingOnClick: () => void;
    commentOnClick: () => void;
};

const RatingItem: React.FC<RatingItemProps> = ({
    rating, isCommenting, showReplies, n, numReplies, ratingOnClick, commentOnClick
}) => {
    const avatar_url = useLoadAvatar(rating.profiles.avatar_url || '');

    return (
        <div className="group relative flex flex-col w-full h-fit" id={rating.id.toString()} style={{ scrollMargin: '80px' }}>
            <div onClick={ratingOnClick} className={twMerge(`select-none flex flex-col justify-center items-center w-full px-4 md:px-20 py-5 gap-y-5 text-forestGreen
            rounded-se-xl rounded-bl-xl cursor-pointer border border-forestGreen shadow-md hover:shadow-lg duration-200 transition ease-in-out`, 
            n===0 ? 'h-[36vh] min-h-[36vh]' : 'h-[26vh] min-h-[26vh]', showReplies&&'h-fit')}>
                <div className="flex justify-around items-center w-full h-fit gap-x-10 gap-y-5 lg:gap-y-0">
                    <div className={twMerge(`font-bold w-full lg:w-1/2 text-center align-top pb-2 text-orange`,
                    n===0 ? 'text-8xl md:text-9xl' : 'text-7xl md:text-8xl', rating.rating>=7 ? 'text-spotifygreen' 
                    : rating.rating>=4 ? 'text-okayday' : 'text-error')}>{rating.rating}</div> {/* Rating Number */}
                    <div className="flex flex-col justify-center items-center h-full w-full lg:w-1/2 lg:pt-1">
                        <div className="hidden md:block">
                            <Avatar size={2} src={avatar_url} />
                        </div>
                        <div className="block md:hidden">
                            <Avatar size={1} src={avatar_url} />
                        </div>
                        <Link href={`/profile/${rating.profiles.id}`} className={twMerge(`h-[2rem] lg:h-[3rem] font-semibold truncate 
                        hover:underline transition`, n===0 ? 'text-xl md:text-2xl lg:text-4xl' : 'text-xl md:text-2xl lg:text-3xl')}>
                            {rating.profiles.username}
                        </Link>
                    </div>
                </div>
                <div className={twMerge(`select-text w-full text-sm xl:text-base line-clamp-3 font-normal break-words align-middle 
                text-left`, !rating.message ? 'hidden' : 'block', showReplies ? 'h-fit max-h-fit' : 'max-h-[4em] xl:max-h-[5em]')}>
                    {rating.message}
                </div>
            </div>
            {/* Rating interaction buttons */}
            <div className={twMerge(`absolute right-3 -bottom-9 flex flex-row h-fit w-fit`,
            numReplies >= 1 ? 'gap-x-3' : 'gap-x-2', (numReplies >= 10)&&'gap-x-4', (numReplies >= 99)&&'gap-x-5')}>
                <Button onClick={commentOnClick} className={twMerge(`relative hover:text-orange duration-200 transition ease-in-out`,
                n <= 1 ? 'block' : 'hidden', isCommenting ? 'text-orange' : 'text-forestGreen')}>
                    <AiOutlineComment size={28} />
                    <div className={twMerge(`absolute -right-2 -bottom-1 font-bold text-sm`, 
                    numReplies >= 1 ? 'block' : 'hidden')}>
                        {numReplies >= 99 ? "99+" : numReplies}
                    </div>
                </Button>
                <LikeButton ratingId={rating.id} />
            </div>
            {rating.replying_to ? (
                <div className="absolute -top-8 left-0 text-forestGreen">
                    Replying to <Link href={`/profile/${rating.replying_to.id}`} className="font-semibold text-orange hover:underline">
                        {rating.replying_to.username}
                    </Link>
                </div>
            ) : null}
            <div className="absolute top-3 right-3 font-extralight text-sm select-none opacity-0 group-hover:opacity-100 transition
            duration-300 ease-in-out">
                {new Date(rating.created_at).toDateString()}
            </div>
        </div>
    );
}

export default RatingItem;