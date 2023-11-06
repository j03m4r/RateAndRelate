import getCurrentRating from "@/actions/getCurrentRating";
import HomePageContent from "./components/HomePageContent";
import getCommunityRatings from "@/actions/getCommunityRatings";

export const revalidate = 0;

export default async function HomePage() {
  const communityRatings = await getCommunityRatings();
  const currentRating = await getCurrentRating();

  return (
    <HomePageContent currentRating={currentRating} communityRatings={communityRatings} />
  );
};