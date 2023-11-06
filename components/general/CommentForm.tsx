import { useUser } from "@/hooks/useUser";
import Button from "../buttons/Button";
import Avatar from "./Avatar";
import useLoadAvatar from "@/hooks/useLoadAvatar";
import Link from "next/link";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { useRouter } from "next/navigation";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

interface CommentFormProps {
    ratingId: number;
    profileId: string;
    onComment: () => void;
    setIsCommenting: (isCommenting: boolean) => void;
};

const CommentForm: React.FC<CommentFormProps> = ({
    ratingId, profileId, onComment, setIsCommenting
}) => {
    const { user, profile } = useUser();
    const avatar_url = useLoadAvatar(profile?.avatar_url || '');
    const router = useRouter();
    const supabaseClient = useSupabaseClient();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
    } = useForm<FieldValues>({
        defaultValues: {
            rating: 5,
            message: "",
        }
    });

    const rating = watch('rating');
    const message = watch('message');

    const onIncrement = () => {
        setValue('rating', rating+1, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true
        });
    };

    const onDecrement = () => {
        setValue('rating', rating-1, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true
        });
    };

    const sendNotification = async () => {
        if (!user || user.id===profileId) {
            return;
        }

        const { error } = await supabaseClient.from('notifications')
        .insert({type: 2, to_profile_id: profileId, from_profile_id: user.id});
    };

    const onSubmit: SubmitHandler<FieldValues> = async (values) => {
        try {
            if (!user) {
                toast.error('Not logged in');
                return;
            }

            setIsLoading(true);
            let ratingObject = { user_id: user.id, rating: values.rating, message: values.message, isPublic: false,
            replying_to_rating_id: ratingId };

            // INSERTING RATING
            const {
                error
            } =  await supabaseClient.from('ratings').insert(ratingObject);

            if (error) {
                return toast.error(error.message);
            } else {
                toast.success('Rated!');
            }

            reset();
            router.refresh();
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setIsLoading(false);
            sendNotification();
            onComment();
        }
    };

    if (!profile) {
        return;
    }

    return (
        <div className="relative flex flex-col w-full h-fit">
            <div className="select-none flex flex-col justify-center items-center w-full md:px-10 lg:px-20 py-5 gap-y-5 text-forestGreen
            rounded-se-xl rounded-bl-xl border border-forestGreen shadow-md h-[48vh] lg:h-[36vh] min-h-[280px]">
                <div className="flex justify-around items-center w-full h-fit gap-x-10 gap-y-5 lg:gap-y-0">
                    <div className="flex flex-col items-center justify-around w-full lg:w-1/2 pb-2 gap-y-2">
                        <div className={twMerge(`font-bold text-center align-top text-7xl md:text-8xl`, rating>=7 ? 
                        'text-spotifygreen' : rating>=4 ? 'text-okayday' : 'text-error')}> {/* Rating Number */}
                            {rating}
                        </div>
                        <div className="flex justify-around items-center w-1/2 h-auto">
                            <Button className="border border-forestGreen p-2 rounded-full" onClick={onDecrement}
                            disabled={rating<1 || isLoading}>
                                <MdKeyboardArrowLeft size={20} />
                            </Button>
                            <Button className="border border-forestGreen p-2 rounded-full" onClick={onIncrement}
                            disabled={rating>9 || isLoading}>
                                <MdKeyboardArrowRight size={20} />
                            </Button>
                        </div>
                    </div>
                    <div className="flex flex-col justify-center items-center h-full w-full lg:w-1/2 lg:pt-1">
                        <div className="hidden md:block">
                            <Avatar size={2} src={avatar_url} />
                        </div>
                        <div className="block md:hidden">
                            <Avatar size={1} src={avatar_url} />
                        </div>
                        <Link href={`/profile/${profile.username}`} className="h-[2rem] lg:h-[3rem] font-semibold truncate 
                        hover:underline transition text-xl md:text-2xl lg:text-3xl">
                            {profile.username}
                        </Link>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row items-center justify-between gap-x-4 select-text w-full h-fit text-sm xl:text-base font-normal break-words">
                    <div className="flex flex-col justify-center items-center w-[95%] h-full">
                        {/* MESSAGE OF THE DAY */}
                        <textarea id="message" {...register('message', { required: false })} value={message || ""} 
                        placeholder="Message of the day..." disabled={isLoading} rows={1} className="w-full bg-cream resize-none 
                        rounded-se-xl rounded-bl-xl border border-forestGreen px-6 py-3 focus:outline-none placeholder:text-forestGreen"/>
                        <div className={twMerge(`font-extralight self-end`, message.length>50 ? 
                        'text-error' : 'text-forestGreen')}>
                            {message.length}/50
                        </div>
                    </div>
                    <div className="flex flex-col gap-y-2 right-6 bottom-3 h-fit w-fit"> {/* Rating interaction buttons */}
                        <Button onClick={handleSubmit(onSubmit)} disabled={isLoading || message.length > 50} 
                        className="border border-forestGreen bg-cream text-xl px-4 py-2
                        hover:rounded-se-xl hover:rounded-bl-xl hover:bg-opacity-0 duration-200 ease-in-out">
                            Rate
                        </Button>
                        <Button onClick={() => setIsCommenting(false)} className="text-sm hover:text-orange transition duration-300 ease-in-out">
                            Cancel
                        </Button>
                    </div>
                </div>
            </div>
            
        </div>
    );
}

export default CommentForm;