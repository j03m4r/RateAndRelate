import { twMerge } from "tailwind-merge";

interface RatingBoxProps {
    header: string;
    rating: number;
};

const RatingBox: React.FC<RatingBoxProps> = ({
    header, rating
}) => {
    return (
        <div className="select-none flex flex-col justify-center items-center w-full h-[36vh] px-8 py-4 
        rounded-se-xl rounded-bl-xl text-center text-forestGreen border border-forestGreen"> {/* Your community's rating of today */}
            <div className="text-yellow text-md font-light">{header}</div>
            <div className={twMerge(`text-7xl lg:text-9xl font-bold`, rating>=7 ? 'text-spotifygreen' 
            : rating>=4 ? 'text-okayday' : rating>=0 ? 'text-error' : 'text-forestGreen text-4xl lg:text-4xl')}>
                {rating!==-1 ? rating : "BE FIRST!"}
            </div>
        </div>
    );
}

export default RatingBox;