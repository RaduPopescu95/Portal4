import { toUrlSlug } from "@/utils/commonUtils";
import {
  handleGetFirestore,
  handleQueryFirestore,
} from "@/utils/firestoreUtils";
import { parseDateToISO } from "@/utils/timeUtils";

const URL = "https://jobsmd.ro";

export default async function sitemap() {
  console.log("Fetching 'Judete' data from Firestore...");
  const judeteData = await handleGetFirestore("Judete");
  console.log("Judete Data:", judeteData);

  console.log("Fetching 'Parteneri' from Firestore...");
  const parteneri = await handleQueryFirestore(
    "UsersUber",
    "userType",
    "Partener"
  );
  console.log("Parteneri Data:", parteneri);

  const seenUrls = new Set();

  console.log("Processing 'judeteCategorii'...");
  const judeteCategorii = parteneri.reduce((acc, partener) => {
    console.log("partener...sitemap", partener); // pentru verificare
    if (partener.categorie && partener.judet) {
      const url = `${URL}/${partener.categorie.toLowerCase()}/${partener.categorie.toLowerCase()}-${partener.judet.toLowerCase()}`;
      if (!seenUrls.has(url)) {
        seenUrls.add(url);
        acc.push({
          url: url,
          lastModified: parseDateToISO(partener.firstUploadDate),
        });
        console.log(`Added judeteCategorie URL: ${url}`);
      }
    }
    return acc;
  }, []);
  console.log("Finished processing 'judeteCategorii'.", judeteCategorii);

  console.log("Processing 'parteners'...");
  const parteners = parteneri.reduce((acc, partener) => {
    console.log("partener for URL generation:", partener); // pentru verificare
    if (partener.id && partener.denumireBrand) {
      const url = `${URL}/partener/${partener.id}-${toUrlSlug(
        partener.denumireBrand
      )}`;
      acc.push({
        url: url,
        lastModified: parseDateToISO(partener.firstUploadDate),
      });
      console.log(`Added partner URL: ${url}`);
    }
    return acc;
  }, []);

  console.log("Finished processing 'parteners'.", parteners);

  console.log("Processing 'judete'...");
  const judete = judeteData.reduce((acc, judet) => {
    if (judet?.judet) {
      const url = `${URL}/${judet.judet.toLowerCase()}`;
      const lastModifiedDate = new Date().toISOString();
      acc.push({
        url: url,
        lastModified: lastModifiedDate,
      });
      console.log(`Added judet URL: ${url}`);
    }
    return acc;
  }, []);
  console.log("Finished processing 'judete'.", judete);

  console.log("Generating static routes...");
  const routes = [
    "",
    "/despre-noi",
    "/termeni-confidentialitate",
    "/contact",
    "/plangeri",
    "/autovehicule",
    "/servicii",
    "/cafenele",
    "/restaurante",
    "/hoteluri",
    "/altele",
  ].map((route) => ({
    url: `${URL}${route}`,
    lastModified: new Date().toISOString(),
  }));
  console.log("Static routes:", routes);

  const fullSitemap = [...routes, ...judete, ...judeteCategorii, ...parteners];
  console.log("Full Sitemap Generated:", fullSitemap);
  return fullSitemap;
}
