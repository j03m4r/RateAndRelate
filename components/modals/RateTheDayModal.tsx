'use client';

import { useSessionContext, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "../buttons/Button";
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from 'react-icons/md';
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useRateModal from "@/hooks/useRateModal";
import Modal from "./Modal";
import { twMerge } from "tailwind-merge";
import { useUser } from "@/hooks/useUser";

enum PAGE {
    RATING = 0,
    MESSAGE = 1
}

const RateTheDayModal = () => {
    const router = useRouter();
    const { session } = useSessionContext();
    const { onClose, isOpen } = useRateModal();
    const { user } = useUser();
    const supabaseClient = useSupabaseClient();
    
    const [page, setPage] = useState<PAGE>(PAGE.RATING);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (session) {
            router.refresh();
            onClose();
        }
    }, [session, router, onClose]);

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
            isPublic: false
        }
    });

    const rating = watch('rating');
    const message = watch('message');
    const isPublic = watch('isPublic');

    const onChange = (open: boolean) => {
        if (!open) {
            onClose();
        }
    }

    const onCheckChange = () => {
        setValue('isPublic', !isPublic, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true
        });
    };

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

    const onSubmit: SubmitHandler<FieldValues> = async (values) => {
        try {
            if (!user) {
                toast.error('Not logged in');
                return;
            }

            setIsLoading(true);
            let ratingObject = { user_id: user.id, rating: values.rating, message: values.message, isPublic: values.isPublic };

            // INSERTING RATING
            const {
                error
            } =  await supabaseClient.from('ratings').insert(ratingObject);

            if (error) {
                return toast.error(error.message);
            } else {
                if (rating >= 7) {
                    toast.success('Rated! Happy you had a good day!');
                } else {
                    toast.success('Rated! Hope your day gets better!');
                }
            }

            reset();
            onClose();
            router.refresh();
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    let content = (<div />);
    let pageDescription = "";
    let pageTitle = "";
    if (page===PAGE.RATING) {
        pageTitle = "How was your day?";
        pageDescription = "Rate zero to ten";
        content = (
            <div className="flex flex-col justify-between items-center w-full h-full lg:h-[45vh] gap-y-5">
                <div className="flex flex-col justify-center items-center w-full h-full gap-y-5">
                    {/* Rating # */}
                    <div className="flex justify-center items-center">
                        <div className={twMerge(`text-9xl`, rating>=7 ? 'text-spotifygreen cursor-pointer' : 
                        rating>=4 ? 'text-okayday cursor-pointer' : 'text-error cursor-pointer')}>{rating}</div>
                    </div>
                    {/* Increment/Decrement buttons */}
                    <div className="flex justify-around items-center w-1/4 h-auto text-forestGreen gap-x-4">
                        <Button className="border border-forestGreen p-2 rounded-full" onClick={onDecrement}
                        disabled={rating<1}>
                            <MdKeyboardArrowLeft size={30} />
                        </Button>
                        <Button className="border border-forestGreen p-2 rounded-full" onClick={onIncrement}
                        disabled={rating>9}>
                            <MdKeyboardArrowRight size={30} />
                        </Button>
                    </div>
                </div>
                {/* FOOTER */}
                <div className="flex flex-col items-center justify-center w-full h-auto gap-y-5">
                    <hr className="text-forestGreen w-full" />
                    <div className="flex justify-end items-center w-full h-auto text-forestGreen">
                        <Button className="border border-forestGreen p-2 rounded-full" onClick={() => setPage((prev) => prev+1)}>
                            <MdKeyboardArrowRight size={30} />
                        </Button>
                    </div>
                </div>
            </div>
        );
    } else {
        pageTitle = "Message of the day";
        pageDescription = "Write a message that highlights your day"
        content = (
            <div className="flex flex-col justify-between items-center w-full h-full lg:h-[45vh] gap-y-5">
                <div className="flex flex-col justify-center items-center w-full h-full">
                    {/* MESSAGE OF THE DAY */}
                    <textarea id="message" {...register('message', { required: false })} value={message || ""} 
                    placeholder="Message of the day..." disabled={isLoading} rows={5} className="w-full 
                    resize-none rounded-se-xl rounded-bl-xl border border-forestGreen p-4 focus:outline-none placeholder:text-grey"/>
                    <div className="flex justify-between w-full pl-2">
                        <div className="flex items-start flex-row gap-x-1">
                            <input type="checkbox" id="isPublic" {...register('isPublic')} checked={isPublic} onChange={onCheckChange} disabled={isLoading}
                            className="mt-[6px] cursor-pointer" />
                            <div className="flex flex-col justify-center items-start text-forestGreen">
                                <label htmlFor="isPublic">Public</label>
                                <div className="text-xs font-extralight">Make this rating public on the explore page</div>
                            </div>
                        </div>
                        <div className={twMerge(`font-extralight`, message.length>200 ? 
                        'text-error' : 'text-forestGreen')}>
                            {message.length}/200
                        </div>
                    </div>
                </div>
                {/* FOOTER */}
                <div className="flex flex-col items-center justify-center w-full h-auto gap-y-5">
                    <hr className="text-forestGreen w-full" />
                    <div className="flex justify-between items-center w-full h-auto text-forestGreen">
                        <Button className="border border-forestGreen p-2 rounded-full" onClick={() => setPage((prev) => prev-1)}>
                            <MdKeyboardArrowLeft size={30} />
                        </Button>
                        <Button onClick={handleSubmit(onSubmit)} disabled={isLoading || message.length >= 200} 
                        className={twMerge(`text-xl px-4 py-2 border-forestGreen border text-white bg-forestGreen duration-200`, 
                        isLoading || message.length >= 280 ? 'hover:bg-forestGreen hover:rounded-none' : 
                        'hover:bg-opacity-0 hover:rounded-se-xl hover:rounded-bl-xl hover:text-forestGreen')}>
                            Rate!
                        </Button>
                    </div>
                </div>
            </div>
        );
        
    }
    
    return (
        <Modal title={pageTitle} description={pageDescription} isOpen={isOpen} onChange={onChange}>
            {/* Main auth container */}
            {content}
        </Modal>
    );
}

export default RateTheDayModal;