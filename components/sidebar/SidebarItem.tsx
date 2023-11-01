'use client';

import { useRouter } from 'next/navigation';
import { twMerge } from 'tailwind-merge';

interface SidebarItemProps {
    label: string;
    href: string;
    selected: boolean;
    index: number;
};

const SidebarItem: React.FC<SidebarItemProps> = ({
    label,
    href,
    selected,
    index
}) => {
    const router = useRouter();

    return (
        <div onClick={() => router.push(href)} className={twMerge(`select-none flex justify-end items-center w-full h-1/4 text-forestGreen
        text-3xl hover:cursor-pointer group border-charcoal`, index<2 ? 'border-b' : null)}>
            <div className={twMerge(`flex justify-end items-center w-full h-full pr-5 group-hover:scale-105 transition`, selected ? 'text-orange' : 'hover:text-orange')}>
                {label}
            </div>
        </div>
    );
}

export default SidebarItem;