import { useState, useRef, useCallback, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "../components/ui/dialog";
import { Camera, RefreshCcw, Check, X } from "lucide-react";
import { toast } from "sonner";

interface CameraModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCapture: (file: File) => void;
}

const CameraModal = ({ open, onOpenChange, onCapture }: CameraModalProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const startCamera = async () => {
        setIsLoading(true);
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user", width: { ideal: 400 }, height: { ideal: 400 } },
                audio: false,
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (error) {
            console.error("Camera access denied:", error);
            toast.error("Camera access denied. Please check permissions.");
            onOpenChange(false);
        } finally {
            setIsLoading(false);
        }
    };

    const stopCamera = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
            setStream(null);
        }
    }, [stream]);

    useEffect(() => {
        if (open) {
            startCamera();
        } else {
            stopCamera();
            setCapturedImage(null);
        }
        return () => stopCamera();
    }, [open]);

    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext("2d");
            if (context) {
                canvasRef.current.width = videoRef.current.videoWidth;
                canvasRef.current.height = videoRef.current.videoHeight;
                context.drawImage(videoRef.current, 0, 0);
                const dataUrl = canvasRef.current.toDataURL("image/jpeg");
                setCapturedImage(dataUrl);
            }
        }
    };

    const handleConfirm = () => {
        if (capturedImage) {
            // Convert dataURL to File
            fetch(capturedImage)
                .then((res) => res.blob())
                .then((blob) => {
                    const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });
                    onCapture(file);
                    onOpenChange(false);
                });
        }
    };

    const handleRetake = () => {
        setCapturedImage(null);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md bg-secondary border-gray/20 p-0 overflow-hidden">
                <DialogHeader className="p-4 border-b border-gray/10">
                    <DialogTitle className="text-white flex items-center gap-2">
                        <Camera className="w-5 h-5 text-primary" />
                        Take Photo
                    </DialogTitle>
                </DialogHeader>

                <div className="relative aspect-square bg-black flex items-center justify-center overflow-hidden">
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-secondary/50 z-10">
                            <RefreshCcw className="w-8 h-8 text-primary animate-spin" />
                        </div>
                    )}

                    {!capturedImage ? (
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover mirror"
                            style={{ transform: "scaleX(-1)" }}
                        />
                    ) : (
                        <img
                            src={capturedImage}
                            alt="Captured"
                            className="w-full h-full object-cover"
                        />
                    )}

                    <canvas ref={canvasRef} className="hidden" />
                </div>

                <DialogFooter className="p-4 bg-secondary_light flex sm:justify-center items-center gap-6">
                    {!capturedImage ? (
                        <>
                            <button
                                onClick={() => onOpenChange(false)}
                                className="p-3 rounded-full hover:bg-white/10 text-white transition-colors"
                                title="Cancel"
                            >
                                <X className="w-6 h-6" />
                            </button>
                            <button
                                onClick={handleCapture}
                                className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-background shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-transform"
                                title="Capture"
                            >
                                <div className="w-12 h-12 rounded-full border-2 border-background/20" />
                            </button>
                            <div className="w-12" /> {/* Spacer */}
                        </>
                    ) : (
                        <>
                            <button
                                onClick={handleRetake}
                                className="flex flex-col items-center gap-1 text-txt hover:text-white transition-colors"
                            >
                                <div className="p-2.5 rounded-full bg-white/5">
                                    <RefreshCcw className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] uppercase font-bold">Retake</span>
                            </button>
                            <button
                                onClick={handleConfirm}
                                className="flex flex-col items-center gap-1 text-primary hover:text-primary/80 transition-colors"
                            >
                                <div className="p-2.5 rounded-full bg-primary/10">
                                    <Check className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] uppercase font-bold">Use Photo</span>
                            </button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CameraModal;
