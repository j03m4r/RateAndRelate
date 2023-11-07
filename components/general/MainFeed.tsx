'use client';

import RatingCard from "@/components/general/RatingCard";
import { Rating } from "@/types";
import { motion } from "framer-motion";

interface MainFeedProps {
    ratings: Rating[];
};

const MainFeed: React.FC<MainFeedProps> = ({
    ratings
}) => {
    return (
        <motion.div layout className="flex flex-col items-center w-full px-10 md:px-16 pb-16 gap-y-14 md:gap-y-16"> {/* Today's ratings. Twitter-like feed */}
            {ratings.map((rating) => (
                <RatingCard key={rating.id} rating={rating} n={0} />
            ))}
        </motion.div>
    );
}

export default MainFeed;