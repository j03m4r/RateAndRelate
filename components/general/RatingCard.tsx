'use client';

import { Rating, ReplyRating } from "@/types";
import { useEffect, useState } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";
import RatingItem from "./RatingItem";
import CommentForm from "./CommentForm";
import { motion } from "framer-motion"

interface RatingCardProps {
    rating: Rating;
    n: number;
};

const RatingCard: React.FC<RatingCardProps> = ({
    rating, n
}) => {
    const { supabaseClient } = useSessionContext();

    const [replies, setReplies] = useState<ReplyRating[]>([]);
    const [showReplies, setShowReplies] = useState(false);
    const [isCommenting, setIsCommenting] = useState(false);

    const fetchData = async () => {
        const { data, error } = await supabaseClient.from('ratings').select("id, profiles(*), rating, message, replying_to:replying_to_rating_id(profiles(id, username)), created_at")
        .eq('replying_to_rating_id', rating.id).order('created_at', { ascending: false });

        if (!error && data && data.length!==0) {
            const metaData = data.map((rating) => {
                return {
                    ...rating,
                    // @ts-ignore
                    replying_to: rating.replying_to.profiles
                }
            })
            // @ts-ignore
            setReplies(metaData);
        }
    };

    useEffect(() => {
        fetchData();
    }, [rating.id, supabaseClient]);

    return (
        <div className="flex flex-col w-full">
            <RatingItem rating={rating} isCommenting={isCommenting} showReplies={showReplies} n={n} numReplies={replies.length} 
            ratingOnClick={() => setShowReplies((prev) => !prev)} 
            commentOnClick={() => setIsCommenting((prev) => {
                setShowReplies(!prev);
                return !prev;
            })} />
            {replies.length ? (
                n===0 ? ( // Show preview of first reply
                    <div className="flex flex-row w-full h-fit">
                        <div className="flex flex-col justify-start h-[18vh] w-1/6">
                            <div className="h-[7.2vh] w-2/3 md:w-[55%] border-r border-lime">
                            </div>
                            <div className="flex flex-row w-full h-1/3 md:h-2/5 lg:h-3/5">
                                <div className="w-2/3 md:w-[55%] h-full border border-lime rounded-b-full rounded-tl-full">
                                </div>
                                <div className="w-1/3 md:w-[45%] h-full border-t border-lime">
                                </div>
                            </div>
                        </div>
                        <div className="w-5/6 h-fit">
                            <div className="h-[7.2vh] w-full">
                            </div>
                            <div className="flex flex-col gap-y-12">
                                {isCommenting ? (
                                    <CommentForm ratingId={rating.id} profileId={rating.profiles.id} setIsCommenting={(isCommenting) => setIsCommenting(isCommenting)} 
                                    onComment={() => {fetchData(), setIsCommenting((prev) => !prev)}} />
                                ) : null}
                                <div>
                                    <RatingCard rating={replies[0]} n={n+1} />
                                </div>
                                {showReplies&&(
                                    <motion.div layout className="flex flex-col gap-y-12">
                                        {replies.slice(1).map((replyRating) => (
                                            <RatingCard key={replyRating.id} rating={replyRating} n={n+1} />
                                        ))}
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    showReplies && (
                        <div className="flex flex-row w-full h-fit">
                            <div className="flex flex-col justify-start h-[18vh] w-1/6">
                                <div className="h-[7.2vh] w-3/5 border-r border-lime">
                                </div>
                                <div className="flex flex-row w-full h-1/3 md:h-2/5 lg:h-3/5">
                                    <div className="w-3/5 h-full border border-lime rounded-b-full rounded-tl-full">
                                    </div>
                                    <div className="w-2/5 h-full border-t border-lime">
                                    </div>
                                </div>
                            </div>
                            <div className="w-5/6 h-fit">
                                <div className="h-[7.2vh] w-full">
                                </div>
                                <div className="flex flex-col gap-y-12">
                                    {isCommenting ? (
                                        <CommentForm ratingId={rating.id} profileId={rating.profiles.id} setIsCommenting={(isCommenting) => setIsCommenting(isCommenting)} 
                                        onComment={() => {fetchData(), setIsCommenting((prev) => !prev)}} />
                                    ) : null}
                                    {replies.map((replyRating) => (
                                        <RatingCard key={replyRating.id} rating={replyRating} n={n+1} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )
                )
            ) : (
                isCommenting ? (
                    <div className="flex flex-row w-full h-fit">
                        <div className="flex flex-col justify-start h-[18vh] w-1/6">
                            <div className="h-[7.2vh] w-3/5 border-r border-lime">
                            </div>
                            <div className="flex flex-row w-full h-1/3 md:h-2/5 lg:h-3/5">
                                <div className="w-3/5 h-full border border-lime rounded-b-full rounded-tl-full">
                                </div>
                                <div className="w-2/5 h-full border-t border-lime">
                                </div>
                            </div>
                        </div>
                        <div className="w-5/6 h-fit">
                            <div className="h-[7.2vh] w-full">
                            </div>
                            {isCommenting ? (
                                <CommentForm ratingId={rating.id} profileId={rating.profiles.id} setIsCommenting={(isCommenting) => setIsCommenting(isCommenting)} 
                                onComment={() => {fetchData(), setIsCommenting((prev) => !prev)}} />
                            ) : null}
                        </div>
                    </div>
                ) : null
            )}
        </div>
    );
};

export default RatingCard;