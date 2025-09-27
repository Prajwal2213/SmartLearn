import React, { useEffect, useRef, useState } from "react";
import Peer, { MediaConnection } from "peerjs";
import {
  X,
  Mic,
  MicOff,
  Video,
  VideoOff,
  ScreenShare,
  ScreenShareOff,
  Maximize,
  Minimize,
} from "lucide-react";

type Mentor = {
  id: number;
  name: string;
  peerId: string;
};

interface VideoChatModalProps {
  mentor: Mentor;
  onClose: () => void;
}

export const VideoChatModal: React.FC<VideoChatModalProps> = ({
  mentor,
  onClose,
}) => {
  const [myId, setMyId] = useState("");
  const [callStatus, setCallStatus] = useState("Connecting...");
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoPaused, setIsVideoPaused] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const peerInstance = useRef<Peer | null>(null);
  const callRef = useRef<MediaConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // 🎤 Toggle Mic
  const toggleMute = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(
        (track) => (track.enabled = !track.enabled)
      );
      setIsMuted((prev) => !prev);
    }
  };

  // 📷 Toggle Camera
  const toggleVideo = () => {
    if (localStreamRef.current && !isScreenSharing) {
      localStreamRef.current.getVideoTracks().forEach(
        (track) => (track.enabled = !track.enabled)
      );
      setIsVideoPaused((prev) => !prev);
    }
  };

  // 🖥 Screen Share
  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      const cameraTrack = cameraStreamRef.current?.getVideoTracks()[0];
      if (cameraTrack && callRef.current) {
        const sender = callRef.current.peerConnection
          .getSenders()
          .find((s) => s.track?.kind === "video");
        if (sender) await sender.replaceTrack(cameraTrack);

        localVideoRef.current!.srcObject = cameraStreamRef.current;
        localStreamRef.current = cameraStreamRef.current;
        setIsScreenSharing(false);
      }
    } else {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });
        const screenTrack = screenStream.getVideoTracks()[0];

        if (callRef.current) {
          const sender = callRef.current.peerConnection
            .getSenders()
            .find((s) => s.track?.kind === "video");
          if (sender) await sender.replaceTrack(screenTrack);

          localVideoRef.current!.srcObject = screenStream;
          localStreamRef.current = screenStream;
          setIsScreenSharing(true);

          screenTrack.onended = () => toggleScreenShare();
        }
      } catch (err) {
        console.error("Screen share failed:", err);
      }
    }
  };

  // 🔲 Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement && modalRef.current) {
      modalRef.current.requestFullscreen().catch((err) => {
        console.error("Fullscreen request failed:", err);
      });
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    const peer = new Peer();
    peerInstance.current = peer;

    const initializeMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        localVideoRef.current!.srcObject = stream;
        localStreamRef.current = stream;
        cameraStreamRef.current = stream;
        return stream;
      } catch (err) {
        console.error("Failed to get local stream", err);
        setCallStatus("Error: Could not access camera/mic");
        return null;
      }
    };

    const cleanup = () => {
      localStreamRef.current?.getTracks().forEach((track) => track.stop());
      cameraStreamRef.current?.getTracks().forEach((track) => track.stop());
      if (peerInstance.current) {
        peerInstance.current.destroy();
        peerInstance.current = null;
      }
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };

    peer.on("open", async (id) => {
      setMyId(id);
      const stream = await initializeMedia();
      if (stream && peerInstance.current) {
        const call = peerInstance.current.call(mentor.peerId, stream);
        callRef.current = call;
        call.on("stream", (remoteStream) => {
          setCallStatus("Connected");
          remoteVideoRef.current!.srcObject = remoteStream;
        });
        call.on("close", () => {
          setCallStatus("Call ended");
          onClose();
        });
      }
    });

    peer.on("call", async (call) => {
      const stream = await initializeMedia();
      if (stream) {
        callRef.current = call;
        call.answer(stream);
        call.on("stream", (remoteStream) => {
          setCallStatus("Connected");
          remoteVideoRef.current!.srcObject = remoteStream;
        });
      }
    });

    peer.on("error", (err) => {
      console.error("PeerJS error:", err);
      setCallStatus(`Error: ${err.message}`);
    });

    return cleanup;
  }, [mentor.peerId, onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-card p-6 rounded-lg w-full max-w-5xl relative flex flex-col shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-primary transition-transform transform hover:scale-110"
        >
          <X />
        </button>
        <h2 className="text-xl font-bold mb-2 text-center">
          Video Call with {mentor.name}
        </h2>
        <p className="text-sm text-muted-foreground mb-4 text-center">
          Status: {callStatus}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
          <div className="bg-secondary rounded-lg p-2 relative shadow-md">
            <h3 className="font-semibold text-center mb-2">You</h3>
            <video
              ref={localVideoRef}
              autoPlay
              muted
              className="w-full h-auto rounded-lg aspect-video shadow"
            />
            <p className="text-xs text-center mt-2 text-muted-foreground">
              Your ID: {myId}
            </p>
          </div>
          <div className="bg-secondary rounded-lg p-2 shadow-md">
            <h3 className="font-semibold text-center mb-2">{mentor.name}</h3>
            <video
              ref={remoteVideoRef}
              autoPlay
              className="w-full h-auto rounded-lg aspect-video shadow"
            />
          </div>
        </div>

        {/* Controls */}
        <div className="mt-4 pt-4 border-t border-border flex justify-center items-center gap-4 flex-wrap">
          <button
            onClick={toggleMute}
            className={`p-3 rounded-full transition-all transform hover:scale-110 ${
              isMuted
                ? "bg-destructive text-destructive-foreground"
                : "bg-secondary hover:bg-secondary/80"
            }`}
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
          </button>

          <button
            onClick={toggleVideo}
            className={`p-3 rounded-full transition-all transform hover:scale-110 ${
              isVideoPaused
                ? "bg-destructive text-destructive-foreground"
                : "bg-secondary hover:bg-secondary/80"
            }`}
            title={isVideoPaused ? "Resume Video" : "Pause Video"}
            disabled={isScreenSharing}
          >
            {isVideoPaused ? (
              <VideoOff className="h-6 w-6" />
            ) : (
              <Video className="h-6 w-6" />
            )}
          </button>

          <button
            onClick={toggleScreenShare}
            className={`p-3 rounded-full transition-all transform hover:scale-110 ${
              isScreenSharing
                ? "bg-blue-600 text-white"
                : "bg-secondary hover:bg-secondary/80"
            }`}
            title={isScreenSharing ? "Stop Sharing" : "Share Screen"}
          >
            {isScreenSharing ? (
              <ScreenShareOff className="h-6 w-6" />
            ) : (
              <ScreenShare className="h-6 w-6" />
            )}
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-3 rounded-full bg-secondary hover:bg-secondary/80 transition-all transform hover:scale-110"
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? (
              <Minimize className="h-6 w-6" />
            ) : (
              <Maximize className="h-6 w-6" />
            )}
          </button>

          <button
            onClick={onClose}
            className="ml-auto bg-destructive text-destructive-foreground font-bold py-3 px-6 rounded-lg hover:bg-destructive/80 transition-transform transform hover:scale-105"
          >
            End Call
          </button>
        </div>
      </div>
    </div>
  );
};