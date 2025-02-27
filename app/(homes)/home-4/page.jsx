import dynamic from "next/dynamic";
import HomeMain from "@/components/home-4";
import {
  getLocalitatiWithUserCounts,
  handleGetFirestore,
  handleQueryFirestoreSubcollection,
} from "@/utils/firestoreUtils";
import { unstable_noStore as noStore } from "next/cache";
import { jd } from "@/data/judeteLocalitati";

export const metadata = {
  title: "Home || Portal",
  description: "Portal",
};

export async function getServerData() {
  let data = [];
  try {
    // Interoghează Firestore (sau orice altă bază de date) folosind 'locationPart'
    data = await handleGetFirestore("Judete");
  } catch (error) {
    console.error("Failed to fetch locations:", error);
    return {
      props: {
        error: "Failed to load data.",
      },
    };
  }
  return data; // Data will be available as props in your component
}

const index = async ({ params }) => {
  noStore();
  const judete = await getServerData();

  // const localitatiCounts = await getLocalitatiWithUserCounts(jd);

  return (
    <>
      <HomeMain params={params} />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
