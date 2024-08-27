import dynamic from "next/dynamic";
import NotFound from "@/components/404";

export const metadata = {
  title: "404 Pagina nu a fost gasita || JobsMD",
  description: "Portal",
};

const index = () => {
  return (
    <>
      <NotFound />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
