import dynamic from "next/dynamic";
import AgentV1 from "@/components/agent-view/agent-v1";

export const metadata = {
  title: 'Simple Listing – Agent V1 || Portal',
  description:
    'Portal',
}

const index = () => {
    return (
        <>
            <AgentV1 />
        </>
    );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
