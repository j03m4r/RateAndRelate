'use client';

import { useEffect, useState } from "react";
import { Rating } from "@/types";
import RatingBox from "@/components/general/RatingBox";
import MainFeed from "@/components/general/MainFeed";
import RateDayButton from "@/components/buttons/RateDayButton";
import { twMerge } from "tailwind-merge";
import AverageRatingCalendar from "@/components/general/AverageRatingCalender";
import { useUser } from "@/hooks/useUser";

interface HomePageProps {
    currentRating: Rating | null;
    communityRatings: Rating[];
};

enum StatPages {
    TODAY = 1,
    YEAR = 2
};

const HomePageContent: React.FC<HomePageProps> = ({
    currentRating, communityRatings
}) => {
    const [communityRating, setCommunityRating] = useState(0);
    const [statPage, setStatPage] = useState(StatPages.TODAY);
    const { user } = useUser();

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
        <div className="flex flex-col h-full items-center pt-24 gap-y-10 text-forestGreen overflow-x-hidden"> {/* MAIN CONTAINER OF RIGHT CONTENT */}
            <div className="relative flex justify-center items-center w-full">
                <div className={twMerge(`transition duration-700 flex flex-col-reverse md:flex-row 
                justify-evenly w-full h-fit gap-x-10 md:gap-x-16 gap-y-10 px-10 md:px-16 text-white ease-in-out`, 
                statPage===StatPages.YEAR ? '-translate-y-[150%]' : 'duration-1000')}> {/* Daily stats larger container */}
                        {currentRating ? (
                            <RatingBox header="YOU" rating={currentRating.rating} />
                        ) : (
                            <div className="select-none flex flex-col justify-center items-center w-full h-[36vh] border border-forestGreen">
                                <RateDayButton />
                            </div>
                        )}
                    <RatingBox header="COMMUNITY" rating={Number(communityRating.toFixed(1))}/> {/* Your community's rating of today */}
                </div>
                <div className={twMerge(`absolute -right-full transition duration-700 flex flex-col 
                justify-evenly w-full h-fit gap-y-5 text-white ease-in-out px-10 md:px-16`, 
                statPage===StatPages.YEAR ? '-translate-x-full duration-1000' : null)}>
                    <div className="text-6xl lg:text-7xl font-bold text-forestGreen self-end select-none">THIS YEAR</div>
                    <AverageRatingCalendar mode='home' user_id={user ? user.id : ''} />
                </div>
            </div>
            <div className="flex flex-row gap-x-2 w-fit h-fit">
                <div onClick={() => setStatPage(StatPages.TODAY)} className={twMerge(`cursor-pointer rounded-full p-1 border border-forestGreen hover:bg-forestGreen`,
                statPage===StatPages.TODAY ? 'bg-forestGreen' : 'bg-cream')} />
                <div onClick={() => setStatPage(StatPages.YEAR)} className={twMerge(`cursor-pointer rounded-full p-1 border border-forestGreen hover:bg-forestGreen`,
                statPage===StatPages.YEAR ? 'bg-forestGreen' : 'bg-cream')} />
            </div>
            <MainFeed ratings={currentRating ? [currentRating, ...communityRatings] : communityRatings} /> {/* Twitter-like feed */}
        </div>
    );
}

export default HomePageContent;