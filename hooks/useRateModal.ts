import { create } from "zustand";

interface RateModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
};

const useRateModal = create<RateModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));

export default useRateModal;