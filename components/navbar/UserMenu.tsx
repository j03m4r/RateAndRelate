'use client'

import Avatar from '../general/Avatar';
import { useCallback, useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useUser } from '@/hooks/useUser';
import useLoadAvatar from '@/hooks/useLoadAvatar';
import MenuItem from './MenuItem';
import useUpdateProfileModal from '@/hooks/useUpdateProfileModal';
import { BsBell, BsSearch } from 'react-icons/bs';
import { twMerge } from 'tailwind-merge';
import useUserModal from '@/hooks/useUserModal';
import { Notification } from '@/types';
import SearchUsers from './SearchUsers';
import CommentNotification from '../general/CommentNotification';
import { motion } from 'framer-motion';
import FollowNotification from '../general/FollowNotification';

export const revalidate = 0;

interface UserMenuProps {
    notifications: Notification[];
};

enum UserMenuState {
    NAVIGATION = 0,
    NOTIFICATIONS = 1,
    SEARCH = 2
}

const UserMenu: React.FC<UserMenuProps> = ({
    notifications
}) => {
    const { user, profile } = useUser();
    const avatar_url = useLoadAvatar(profile?.avatar_url || '');

    const supabaseClient = useSupabaseClient();
    const router = useRouter();
    
    const updateProfileModal = useUpdateProfileModal();
    const userModal = useUserModal();

    const [userMenuState, setUserMenuState] = useState(UserMenuState.NAVIGATION);

    const toggleOpen = useCallback(() => {
        if (userModal.isOpen) {
            userModal.onClose();
        } else {
            setUserMenuState(UserMenuState.NAVIGATION);
            userModal.onOpen();
        }
    }, [userModal.isOpen,]);

    const handleLogout = async () => {
        const { error } = await supabaseClient.auth.signOut();
        toggleOpen();
        router.refresh();
    
        if (error) {
          toast.error(error.message);
        } else {
          toast.success('Successfully logged out')
        }
    };

    let content = (<div></div>);
    if (userMenuState===UserMenuState.NAVIGATION) {
        content = (
            <div className='select-none flex flex-col cursor-pointer'>
                <>
                <div className="lg:hidden">
                    <MenuItem onClick={() => { toggleOpen(), router.push('/home') }} label='HOME'/>
                    <MenuItem onClick={() => { toggleOpen(), router.push('/explore') }} label='EXPLORE'/>
                </div>
                <MenuItem onClick={() => { toggleOpen(), router.push(`/profile/${profile?.id}`) }} label='PROFILE'/>
                <MenuItem onClick={() => { toggleOpen(), updateProfileModal.onOpen() }} label='UPDATE PROFILE'/>
                <hr className='text-forestGreen' />
                <MenuItem onClick={handleLogout} label='LOGOUT'/>
                </>
            </div>
        );
    } else if (userMenuState===UserMenuState.NOTIFICATIONS) {
        content = (
            <div className="flex flex-col max-h-[30vh] lg:max-h-[20vh] overflow-y-scroll">
                {notifications.length ? (
                    notifications.map((notification, idx) => {
                        let notificationContent = (<div></div>);
    
                        if (notification.type===1) {
                            notificationContent = <FollowNotification notification={notification} />
                        } else if (notification.type===2) {
                            notificationContent = <CommentNotification notification={notification} />
                        }
    
                        return (
                            <div key={idx} className="flex flex-col">
                                {notificationContent}
                            </div>
                        );
                    })
                ) : (
                    <div className="select-none flex flex-col justify-center items-center py-5 text-lg">
                        No notifications!
                    </div>
                )}
            </div>
        );
    } else {
        content = (
            <SearchUsers />
        );
    }

    return (
        <div className="relative text-forestGreen">
            {user ? (
                <div className="flex gap-x-5 items-center">
                    <div onClick={() => userMenuState===UserMenuState.SEARCH ? setUserMenuState(UserMenuState.NAVIGATION) : setUserMenuState(UserMenuState.SEARCH)} 
                    className={twMerge(`relative flex select-none cursor-pointer hover:text-orange transition duration-200`, 
                    userModal.isOpen ? 'opacity-100 translate-x-0' : 'translate-x-100 opacity-0', userMenuState===UserMenuState.SEARCH ? 'text-orange' : 'text-forestGreen')}>
                        <BsSearch size={20} />
                    </div>
                    <div onClick={() => userMenuState===UserMenuState.NOTIFICATIONS ? setUserMenuState(UserMenuState.NAVIGATION) : setUserMenuState(UserMenuState.NOTIFICATIONS)} 
                    className={twMerge(`relative flex select-none cursor-pointer hover:text-orange transition duration-200`, 
                    userModal.isOpen ? 'opacity-100 translate-x-0' : 'translate-x-40 opacity-0', userMenuState===UserMenuState.NOTIFICATIONS ? 'text-orange' : 'text-forestGreen')}>
                        <BsBell size={22} />
                        <div className={twMerge(`absolute select-none right-0 top-0 rounded-full w-[10px] h-[10px] bg-orange`, notifications.length ? 'block' : 'hidden')} />
                    </div>
                    <div onClick={toggleOpen} className='select-none border border-forestGreen p-2 cursor-pointer 
                    hover:rounded-se-xl hover:rounded-bl-xl duration-200'>
                        <Avatar src={avatar_url} />
                    </div>
                </div>
            ) : null}
            {userModal.isOpen && (
                <motion.div layout className="absolute w-[60vw] md:w-[30vw] lg:w-[26vw] xl:w-[19vw] 2xl:w-[15vw] border border-forestGreen 
                bg-cream overflow-hidden right-0 top-12 text-sm duration-300 transition ease-in-out">
                    {content}
                </motion.div>
            )}
        </div>
    );
}

export default UserMenu;