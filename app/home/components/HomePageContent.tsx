'use client';

import { useEffect, useState } from "react";
import useRateModal from "@/hooks/useRateModal";
import { Rating } from "@/types";
import RatingBox from "@/components/general/RatingBox";
import MainFeed from "@/components/general/MainFeed";
import RateDayButton from "@/components/general/RateDayButton";

interface HomePageProps {
    currentRating: Rating | null;
    communityRatings: Rating[];
};

export const revalidate = 0;

const HomePageContent: React.FC<HomePageProps> = ({
    currentRating, communityRatings
}) => {
    const [communityRating, setCommunityRating] = useState(0);

    useEffect(() => {
        if (communityRatings.length) {
            if (currentRating) {
                setCommunityRating([...communityRatings, currentRating].reduce((sum, rating) => sum + rating.rating, 0) / (communityRatings.length+1));
            } else {
                setCommunityRating(communityRatings.reduce((sum, rating) => sum + rating.rating, 0) / communityRatings.length);
            }
        } else if (currentRating) {
            setCommunityRating(currentRating.rating);
        }
    }, [currentRating, communityRatings.length]);

    return (
        <div className="flex flex-col h-full items-center pt-24 gap-y-10 md:gap-y-16"> {/* MAIN CONTAINER OF RIGHT CONTENT */}
            <div className="flex flex-col-reverse md:flex-row justify-evenly w-full h-fit gap-x-10 md:gap-x-16 gap-y-10 px-10 md:px-16 text-white"> {/* Daily stats larger container */}
                    {currentRating ? (
                        <RatingBox header="You" rating={currentRating.rating} />
                    ) : (
                        <div className="select-none flex flex-col justify-center items-center w-full h-[36vh] border border-forestGreen">
                            <RateDayButton />
                        </div>
                    )}
                <RatingBox header="Community" rating={Number(communityRating.toFixed(1))}/> {/* Your community's rating of today */}
            </div>
            <MainFeed ratings={currentRating ? [currentRating, ...communityRatings] : communityRatings} /> {/* Twitter-like feed */}
        </div>
    );
}

export default HomePageContent;