'use client';

import useAuthModal from "@/hooks/useAuthModal";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { twMerge } from "tailwind-merge";

import ratingImg from '@/public/images/rating.jpeg';
import AverageRatingCalendar from "@/components/general/AverageRatingCalender";

interface animChar {
    char: string;
    translate:string;
};

const LandingPageContent = () => {
    const authModal = useAuthModal();
    const titleArr: animChar[] = [{char:'R', translate:'group-hover:translate-y-5 group-hover:-translate-x-4'}, {char:'A', translate:'group-hover:translate-y-2'}, {char:'T', translate:'group-hover:-translate-y-2'},
    {char:'E',translate:'group-hover:translate-y-4'}, {char:' ',translate:''}, {char:'&',translate:''}, {char:' ',translate:''}, {char:'R',translate:'group-hover:translate-y-8'}, 
    {char:'E',translate:'group-hover:-translate-y-8'}, {char:'L',translate:'group-hover:translate-y-10'}, {char:'A',translate:'group-hover:-translate-y-10'}, {char:'T',translate:'group-hover:translate-y-12'}, 
    {char:'E',translate:'group-hover:-translate-y-12'}];
    const description1Arr = "RATE THE DAY".split("");
    const description2Arr = "KEEP A DIGITAL JOURNAL".split("");
    const seeWhatsHappeningArr: animChar[] = [{char:'S', translate:'group-hover:-translate-x-20'}, {char:'E', translate:'group-hover:-translate-x-16'}, {char:'E', translate:'group-hover:-translate-x-14'},
    {char:' ',translate:'group-hover:-translate-x-12'}, {char:'W',translate:'group-hover:-translate-x-10'}, {char:'H',translate:'group-hover:-translate-x-8'}, {char:'A',translate:'group-hover:-translate-x-6'}, {char:'T',translate:'group-hover:-translate-x-4'}, 
    {char:"'",translate:'group-hover:-translate-x-2'}, {char:'S',translate:''}, {char:' ',translate:''}, {char:'H',translate:'group-hover:translate-x-2'}, 
    {char:'A',translate:'group-hover:translate-x-4'}, {char:'P',translate:'group-hover:translate-x-6'}, {char:'P',translate:'group-hover:translate-x-8'}, {char:'E',translate:'group-hover:translate-x-10'},
    {char:'N',translate:'group-hover:translate-x-12'}, {char:'I',translate:'group-hover:translate-x-14'}, {char:'N',translate:'group-hover:translate-x-16'}, {char:'G',translate:'group-hover:translate-x-20'}];

    const { user } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (user) router.push('/home')
    }, [user,router]);

    return (
        <div className="select-none grid grid-cols-1 lg:grid-cols-2 w-full h-full overflow-y-scroll overflow-x-hidden text-forestGreen">
            <div onClick={authModal.onOpen} className="h-[60vh] border-b border-r border-forestGreen flex justify-center items-center
            text-3xl font-bold group cursor-pointer">
                {titleArr.map((item, i) => (
                    <div key={i} className={twMerge(`hover:text-orange duration-300 transition ease-in-out ${item.translate}`, 
                    item.char===' '&&'ml-1',)}>
                        {item.char}
                    </div>
                ))}
            </div>
            <div className="relative h-[60vh] overflow-hidden border-b border-forestGreen">
                <div className="absolute w-full h-full lg:-left-10 lg:-bottom-20 bg-contain lg:bg-cover 2xl:bg-contain" style={{ 
                    backgroundImage: `url(${ratingImg.src})`,
                    backgroundPosition: 'center',
                }} />
            </div>
            <div className="flex flex-col justify-center items-start h-[30vh] lg:col-span-2 border-b border-forestGreen text-8xl font-bold
            gap-y-4 group transition ease-in-out overflow-x-scroll xl:overflow-x-hidden overflow-y-hidden">
                <div className="flex justify-start items-center pl-4 italic group-hover:translate-x-96 duration-1000">
                    {description1Arr.map((char, i) => (
                        <div key={i} onClick={authModal.onOpen} className={twMerge("hover:text-orange cursor-pointer", char===' '&&'ml-10')}>{char}</div>
                    ))}
                </div>
                <div className="flex justify-start items-center pl-4 group-hover:translate-x-56 duration-700">
                    {description2Arr.map((char, i) => (
                        <div key={i} onClick={authModal.onOpen} className={twMerge("hover:text-orange cursor-pointer", char===' '&&'ml-10',)}>{char}</div>
                    ))}
                </div>
            </div>
            <div className="flex flex-col justify-center items-center h-[60vh] border-b border-r border-forestGreen gap-y-5">
                <div className="text-6xl lg:text-7xl font-bold text-forestGreen self-end mr-4 select-none">THIS YEAR</div>
                <AverageRatingCalendar mode='explore' user_id="0ed33360-6a3f-4a1c-aa00-e4beda478b63" />
            </div>
            <div onClick={authModal.onOpen} className="h-[60vh] border-b border-forestGreen flex justify-center items-center
            text-3xl font-bold cursor-pointer group">
                {seeWhatsHappeningArr.map((item, i) => (
                    <div key={i} onClick={authModal.onOpen} className={twMerge(`group-hover:text-orange group-hover:scale-110 duration-300 transition ease-in-out ${item.translate}`, 
                    item.char===' '&&'ml-1',)}>
                        {item.char}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default LandingPageContent;