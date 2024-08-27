import dynamic from "next/dynamic";
import AgentDetails from "@/components/agent-details";

export const metadata = {
  title: 'Agent Details || Portal',
  description:
    'Portal',
}

const index = () => {
  return (
    <>
      <AgentDetails />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
