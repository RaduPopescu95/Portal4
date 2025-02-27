import dynamic from "next/dynamic";
import MyDashboard from "@/components/dashboard-master/my-dashboard";
import { unstable_noStore as noStore } from "next/cache";
import { getFirestoreQueryLength } from "@/utils/firestoreUtils";

// export const metadata = {
//   title: "Dashboard || Nume Portal",
//   description: "Nume Portal",
// };

export async function getServerData() {
  let data = {};
  try {
    // Interoghează Firestore (sau orice altă bază de date) folosind 'locationPart'
    const numarParteneri = await getFirestoreQueryLength(
      `UsersUber`,
      "userType",
      "Partener"
    );
    const numarDoctori = await getFirestoreQueryLength(
      `UsersUber`,
      "userType",
      "Doctor"
    );
    data = { numarDoctori, numarParteneri };
    return data;
  } catch (error) {
    console.error("Failed to fetch data at admin:", error);
    return {
      props: {
        error: "Failed to load data.",
      },
    };
  }
  return data; // Data will be available as props in your component
}

const index = async () => {
  noStore();
  const data = await getServerData();
  return (
    <>
      <MyDashboard
        numarParteneri={data.numarParteneri}
        numarDoctori={data.numarDoctori}
      />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
