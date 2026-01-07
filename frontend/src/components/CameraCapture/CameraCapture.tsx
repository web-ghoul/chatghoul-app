import { useRef, useState, useEffect } from "react";
import { X, Camera, RefreshCcw, Check, Sparkles } from "lucide-react";

interface CameraCaptureProps {
    onCapture: (file: File) => void;
    onClose: () => void;
}

const CameraCapture = ({ onCapture, onClose }: CameraCaptureProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [facingMode, setFacingMode] = useState<"user" | "environment">("user");

    const startCamera = async () => {
        try {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            const newStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: facingMode },
                audio: false
            });
            setStream(newStream);
            if (videoRef.current) {
                videoRef.current.srcObject = newStream;
            }
            setError(null);
        } catch (err) {
            console.error("Camera access denied:", err);
            setError("Could not access camera. Please check permissions.");
        }
    };

    useEffect(() => {
        startCamera();
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [facingMode]);

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                // Mirror if using front camera
                if (facingMode === "user") {
                    ctx.translate(canvas.width, 0);
                    ctx.scale(-1, 1);
                }
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
                setCapturedImage(dataUrl);
            }
        }
    };

    const handleConfirm = () => {
        if (capturedImage) {
            // Convert data URL to File object
            fetch(capturedImage)
                .then(res => res.blob())
                .then(blob => {
                    const file = new File([blob], `camera-capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
                    onCapture(file);
                    onClose();
                });
        }
    };

    const toggleFacingMode = () => {
        setFacingMode(prev => prev === "user" ? "environment" : "user");
    };

    return (
        <div className="fixed inset-0 z-[150] bg-black flex flex-col animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex justify-between items-center p-4 bg-black/50 z-10">
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
                >
                    <X className="w-6 h-6" />
                </button>
                <div className="text-white font-medium flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Camera
                </div>
                <div className="w-10" />
            </div>

            {/* Viewfinder / Preview */}
            <div className="flex-1 relative flex items-center justify-center overflow-hidden">
                {error ? (
                    <div className="text-center p-6 text-white max-w-xs">
                        <Camera className="w-16 h-16 mx-auto mb-4 opacity-20" />
                        <p className="text-lg font-medium mb-2">{error}</p>
                        <button
                            onClick={startCamera}
                            className="text-primary hover:underline"
                        >
                            Try again
                        </button>
                    </div>
                ) : capturedImage ? (
                    <img
                        src={capturedImage}
                        alt="Captured"
                        className="max-w-full max-h-full object-contain"
                    />
                ) : (
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className={`max-w-full max-h-full object-contain ${facingMode === "user" ? "scale-x-[-1]" : ""}`}
                    />
                )}
                <canvas ref={canvasRef} className="hidden" />
            </div>

            {/* Controls */}
            <div className="p-8 pb-12 bg-black/50 flex items-center justify-center gap-12 z-10">
                {!capturedImage ? (
                    <>
                        <button
                            onClick={toggleFacingMode}
                            className="p-4 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all active:scale-90"
                        >
                            <RefreshCcw className="w-6 h-6" />
                        </button>
                        <button
                            onClick={capturePhoto}
                            className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-95 group"
                        >
                            <div className="w-16 h-16 rounded-full border-4 border-black/10 flex items-center justify-center">
                                <div className="w-14 h-14 rounded-full bg-white group-hover:bg-gray-100 transition-colors" />
                            </div>
                        </button>
                        <div className="w-14" /> {/* Spacer */}
                    </>
                ) : (
                    <>
                        <button
                            onClick={() => setCapturedImage(null)}
                            className="p-4 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all active:scale-90 flex items-center gap-2"
                        >
                            <RefreshCcw className="w-5 h-5" />
                            <span>Retake</span>
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="px-8 py-4 bg-primary hover:bg-primary/90 rounded-full text-background font-bold text-lg shadow-2xl transition-all active:scale-95 flex items-center gap-2"
                        >
                            <Check className="w-6 h-6" />
                            <span>Done</span>
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default CameraCapture;
