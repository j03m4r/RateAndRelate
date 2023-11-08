"use client";

import useRateModal from "@/hooks/useRateModal";
import Button from "../buttons/Button";

const RateDayButton = () => {
    const rateModal = useRateModal();
    return (
        <Button onClick={rateModal.onOpen} className="w-full h-full text-4xl text-forestGreen
        hover:text-orange hover:scale-105 transition">
            Rate today!
        </Button>
    );
}

export default RateDayButton;