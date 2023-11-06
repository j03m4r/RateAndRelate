'use client';

import AuthModal from "@/components/modals/AuthModal";
import RateTheDayModal from "@/components/modals/RateTheDayModal";
import SetupProfileModal from "@/components/modals/SetupProfileModal";
import UpdateProfileModal from "@/components/modals/UpdateProfileModal";

const ModalProvider = () => {
    return (
        <>
            <AuthModal />
            <SetupProfileModal />
            <UpdateProfileModal />
            <RateTheDayModal />
        </>
    );
}

export default ModalProvider;