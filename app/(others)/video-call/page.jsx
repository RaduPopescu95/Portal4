"use client";

import dynamic from "next/dynamic";

// Importăm componenta Meeting cu SSR dezactivat
const Meeting = dynamic(() => import("@/components/videoCall/Meeting"), { ssr: false });

export default function VideoCallSpecialistPage() {
  return <Meeting />;
}
