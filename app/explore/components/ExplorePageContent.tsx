'use client';

import RatingBox from "@/components/general/RatingBox";
import MainFeed from "@/components/general/MainFeed";
import RateDayButton from "@/components/buttons/RateDayButton";
import { Rating } from "@/types";
import { useEffect, useState } from "react";

interface ExplorePageProps {
    currentRating: Rating | null;
    publicRatings: Rating[];
};

const ExplorePageContent: React.FC<ExplorePageProps> = ({
    publicRatings, currentRating
}) => {
    const [publicRating, setPublicRating] = useState(0);

    useEffect(() => {
        if (publicRatings.length) {
            if (currentRating?.isPublic) {
                setPublicRating([...publicRatings, currentRating].reduce((sum, rating) => sum + rating.rating, 0) / (publicRatings.length+1));
            } else {
                setPublicRating(publicRatings.reduce((sum, rating) => sum + rating.rating, 0) / publicRatings.length);
            }
        } else if (currentRating?.isPublic) {
            setPublicRating(currentRating.rating);
        }
    }, [currentRating, publicRatings.length]);

    return (
        <div className="flex flex-col h-full items-center pt-24 gap-y-10 md:gap-y-16 text-forestGreen"> {/* MAIN CONTAINER OF RIGHT CONTENT */}
            <div className="flex flex-col-reverse md:flex-row justify-evenly w-full h-fit gap-x-10 md:gap-x-16 gap-y-10 px-10 md:px-16 text-white"> {/* Daily stats larger container */}
                    {currentRating ? (
                        <RatingBox header="You" rating={currentRating.rating} />
                    ) : (
                        <RateDayButton />
                    )}
                <RatingBox header="Global" rating={Number(publicRating.toFixed(1))} /> {/* Your community's rating of today */}
            </div>
            <MainFeed ratings={publicRatings} /> {/* Twitter-like feed */}
        </div>
    );
}

export default ExplorePageContent;