"use client";

import useRateModal from "@/hooks/useRateModal";
import Button from "../buttons/Button";

const RateDayButton = () => {
    const rateModal = useRateModal();
    return (
        <Button onClick={rateModal.onOpen} className="w-full h-full rounded-se-xl rounded-bl-xl 
        xl:w-auto xl:h-auto xl:rounded-none border border-orange bg-orange text-4xl px-8 py-4 text-white
        hover:rounded-se-xl hover:rounded-bl-xl hover:bg-opacity-0 duration-200 ease-in-out hover:text-orange">
            Rate today!
        </Button>
    );
}

export default RateDayButton;