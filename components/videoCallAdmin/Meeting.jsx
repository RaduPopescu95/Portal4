"use client"

import AdminVideoCall from "@/components/videoCallAdmin/video";
import AgoraRTC, {
    AgoraRTCProvider,
    LocalVideoTrack,
    RemoteUser,
    useJoin,
    useLocalCameraTrack,
    useLocalMicrophoneTrack,
    usePublish,
    useRTCClient,
    useRemoteAudioTracks,
    useRemoteUsers,
  } from "agora-rtc-react";
 
  
  export default function Meeting() {
    const client = useRTCClient(
      AgoraRTC.createClient({ codec: "vp8", mode: "rtc" })
    );
    return (
      <AgoraRTCProvider client={client}>
        <AdminVideoCall />
      </AgoraRTCProvider>
    );
  }
  