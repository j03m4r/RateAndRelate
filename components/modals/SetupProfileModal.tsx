'use client';

import Modal from "./Modal";
import { useEffect, useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useUser } from "@/hooks/useUser";
import toast from "react-hot-toast";
import uniqid from 'uniqid';
import Input from "../inputs/Input";
import Button from "../buttons/Button";
import { CgProfile } from 'react-icons/cg';
import useSetupProfileModal from "@/hooks/useSetupProfileModal";

const SetupProfileModal = () => {
    const { isOpen, onClose } = useSetupProfileModal();
    const { user, profile } = useUser();

    const [isLoading, setIsLoading] = useState(false);
    const [imageName, setImageName] = useState(null);

    const supabaseClient = useSupabaseClient();
    const router = useRouter();

    const onChange = (open: boolean) => {
        if (!open) {
            onClose();
        }
    }

    const {
        register,
        handleSubmit,
        reset,
        watch,
    } = useForm<FieldValues>({
        defaultValues: {
            image: null,
            username: '',
        }
    });

    const username = watch('username');
    const image = watch('image')

    useEffect(() => {
        if (!image) return;
        setImageName(image[0].name)
    }, [image]);

    useEffect(() => {
        if (profile?.username) onChange(false);
    }, [profile?.username]);

    const onSubmit: SubmitHandler<FieldValues> = async (values) => {
        if (profile?.username===null&&values.username==='') return toast.error('Must enter a username.');
        try {
            setIsLoading(true);

            let updateObject: any = {};
            const imageFile = values.image?.[0];

            if (!user) {
                toast.error('Not logged in');
                return;
            }

            if (imageFile) {
                const uniqueID = uniqid();

                // UPLOAD IMAGE
                const {
                    data: imageData,
                    error: imageError
                } = await supabaseClient.storage.from('images').upload(`avatar-${values.username}-${uniqueID}`, imageFile, {
                    cacheControl: '3600',
                    upsert: false
                });

                if (imageError) {
                    setIsLoading(false);
                    return toast.error('Failed image upload.');
                }

                if (imageData) {
                    updateObject.avatar_url = imageData.path
                }
            }

            if (values.username!=='') updateObject.username = values.username

            if (Object.keys(updateObject).length) {
                // UPDATING USER
                const {
                    error: supabaseError
                } =  await supabaseClient.from('profiles')
                .update(updateObject)
                .eq('id', user.id);

                if (supabaseError) {
                    setIsLoading(false);
                    return toast.error(supabaseError.message);
                } else {
                    toast.success('Profile setup!');
                }
            }

            router.push('home');
            setIsLoading(false);
            reset();
            onChange(false);
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal title="Setup Profile" description="Setup the appearance of your profile" onChange={onChange}
        isOpen={isOpen}>
            <div className="flex flex-col w-full h-full justify-center items-center gap-y-5">
                <div className="flex flex-col gap-y-1 items-start justify-center w-full">
                    <div className="text-lg text-forestGreen">Edit username *</div>
                    <Input id="username" {...register('username', { required: false })} value={username || ""} 
                    placeholder="Enter a new username" disabled={isLoading} />
                </div>
                <div className="flex flex-col gap-y-1 items-start justify-center w-full">
                <div className="text-lg text-forestGreen">Edit profile picture (optional)</div>
                    <div className="w-full relative flex flex-col border border-forestGreen hover:bg-forestGreen justify-center items-center
                    cursor-pointer duration-300 hover:rounded-se-xl hover:rounded-bl-xl py-5 md:py-20 text-forestGreen hover:text-white">
                        <CgProfile size={30} />
                        <Input type="file" accept="image/*" className="cursor-pointer opacity-0 absolute inset-0" 
                        {...register('image', { required: false })}/>
                        <div className="absolute bottom-2 left-3">{imageName}</div>
                    </div>
                </div>
                <Button className="w-full text-xl px-8 py-4 border border-forestGreen bg-forestGreen hover:bg-white hover:text-forestGreen
                hover:rounded-se-xl hover:rounded-bl-xl text-white duration-300" onClick={handleSubmit(onSubmit)}>
                    Setup Profile
                </Button>
            </div>
        </Modal>
    );
}

export default SetupProfileModal;