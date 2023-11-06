import { create } from "zustand";

interface SetupProfileModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
};

const useSetupProfileModal = create<SetupProfileModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));

export default useSetupProfileModal;