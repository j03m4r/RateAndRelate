import getPublicRatings from "@/actions/getPublicRatings";
import ExplorePageContent from "./components/ExplorePageContent";
import getCurrentRating from "@/actions/getCurrentRating";

export const revalidate = 0;

export default async function ExplorePage() {
	const publicRatings = await getPublicRatings();
	const currentRating = await getCurrentRating();

	return (
		<ExplorePageContent publicRatings={publicRatings} currentRating={currentRating} />
	);
};