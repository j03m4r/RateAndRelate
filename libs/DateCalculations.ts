export const calculatePreviousDate = (today: Date) => {
    const prevDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 6, 0, 0, 0);
    if (today.getHours() < 6) {
        if (today.getDate() === 1) {
            if (today.getMonth() === 0) {
                prevDay.setFullYear(today.getFullYear() - 1);
                prevDay.setMonth(11);
                prevDay.setDate(31);
            } else {
                prevDay.setDate(0);
                prevDay.setMonth(today.getMonth() - 1);
            }
        } else {
            prevDay.setDate(today.getDate() - 1);
        }
    }

    return prevDay;
};