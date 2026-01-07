import { X, Download, ZoomIn, ZoomOut, RotateCw } from "lucide-react";
import { useState } from "react";
import { useAppStore } from "../../globals/useAppStore";

const ImageViewer = () => {
    const imageUrl = useAppStore((state) => state.viewerImageUrl);
    const setImageUrl = useAppStore((state) => state.setViewerImageUrl);
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);

    if (!imageUrl) return null;

    const handleDownload = async () => {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `chatghoul-image-${Date.now()}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download failed:", error);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-sm flex flex-col animate-in fade-in duration-300">
            {/* Toolbar */}
            <div className="flex justify-between items-center p-4 bg-black/40 border-b border-white/10">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setImageUrl(null)}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white"
                    >
                        <X className="w-6 h-6" />
                    </button>
                    <span className="text-white font-medium hidden sm:block">Image Viewer</span>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setZoom(prev => Math.min(prev + 0.5, 4))}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white"
                        title="Zoom In"
                    >
                        <ZoomIn className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setZoom(prev => Math.max(prev - 0.5, 0.5))}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white"
                        title="Zoom Out"
                    >
                        <ZoomOut className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setRotation(prev => (prev + 90) % 360)}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white"
                        title="Rotate"
                    >
                        <RotateCw className="w-5 h-5" />
                    </button>
                    <div className="w-px h-6 bg-white/10 mx-2" />
                    <button
                        onClick={handleDownload}
                        className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 rounded-lg text-background font-semibold transition-all active:scale-95 shadow-lg"
                    >
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">Download</span>
                    </button>
                </div>
            </div>

            {/* Image Container */}
            <div
                className="flex-1 overflow-hidden flex items-center justify-center p-4 cursor-zoom-out"
                onClick={() => setImageUrl(null)}
            >
                <div
                    className="relative transition-transform duration-300 ease-out"
                    style={{
                        transform: `scale(${zoom}) rotate(${rotation}deg)`,
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <img
                        src={imageUrl}
                        alt="Full view"
                        className="max-w-full max-h-[85vh] object-contain rounded-md shadow-2xl animate-in zoom-in-95 duration-500"
                    />
                </div>
            </div>

            {/* Hint */}
            <div className="p-4 text-center text-white/40 text-xs">
                Tip: Use controls to zoom and rotate. Click background to close.
            </div>
        </div>
    );
};

export default ImageViewer;
