'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import Container from '../general/Container';
import { useUser } from '@/hooks/useUser';
import SidebarItem from './SidebarItem';
import useUserModal from '@/hooks/useUserModal';

interface SidebarProps {
    children: React.ReactNode;
};

const Sidebar: React.FC<SidebarProps> = ({
    children
}) => {
    const userModal = useUserModal();

    const pathname = usePathname();
    const { profile } = useUser();

    const routes = useMemo(() => [
        {
            label: 'HOME',
            href: '/home',
            selected: pathname === '/home',
        },
        {
            label: 'EXPLORE',
            href: '/explore',
            selected: pathname === '/explore',
        },
        {
            label: 'PROFILE',
            href: profile ? `/profile/${profile.username}` : '/', // dynamic route
            selected: pathname === `/profile/${profile?.username}`,
        }
    ], [pathname, profile]);

    if (pathname==='/') return children;

    return (
        <Container>
            <div onClick={userModal.onClose} className='flex h-full'>
                <div className='hidden lg:flex h-full w-1/4 sticky'>
                    <div className='flex flex-col justify-center items-center h-full w-3/4'>
                        {routes.map((route, index) => (
                            <SidebarItem 
                                key={index}
                                index={index}
                                {...route}
                            />
                        ))}
                    </div>
                    <div className="flex flex-col justify-center h-full w-1/4">
                        <div className="flex items-end border-b border-forestGreen h-1/4">
                            <div className='border-l border-forestGreen w-full h-full' />
                        </div>
                        <div className="border-l border-b border-forestGreen h-1/4" />
                        <div className="flex items-start h-1/4">
                            <div className='border-l border-forestGreen w-full h-full' />
                        </div>
                    </div>
                </div>
                <main className='h-full flex-1 overflow-y-auto'>
                    {children}
                </main>
            </div>
        </Container>
    );
}

export default Sidebar;