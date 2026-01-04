import { X, Send, File as FileIcon, Music, Film, Image as ImageIcon } from "lucide-react";

interface MediaPreviewProps {
    file: File;
    url: string;
    type: 'image' | 'video' | 'audio' | 'file';
    onClose: () => void;
    onSend: () => void;
    isSending: boolean;
    caption: string;
    setCaption: (val: string) => void;
}

const MediaPreview = ({
    file,
    url,
    type,
    onClose,
    onSend,
    isSending,
    caption,
    setCaption
}: MediaPreviewProps) => {
    const renderPreview = () => {
        switch (type) {
            case 'image':
                return (
                    <img
                        src={url}
                        alt="Preview"
                        className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-2xl animate-in zoom-in duration-500"
                    />
                );
            case 'video':
                return (
                    <video
                        src={url}
                        controls
                        className="max-w-full max-h-[60vh] rounded-lg shadow-2xl animate-in zoom-in duration-500"
                    />
                );
            case 'audio':
                return (
                    <div className="flex flex-col items-center gap-4 bg-secondary p-8 rounded-2xl shadow-xl min-w-[300px] animate-in slide-in-from-bottom duration-500">
                        <Music className="w-16 h-16 text-primary animate-pulse" />
                        <audio src={url} controls className="w-full" />
                        <p className="text-white text-sm font-medium">{file.name}</p>
                    </div>
                );
            default:
                return (
                    <div className="flex flex-col items-center gap-4 bg-secondary p-10 rounded-2xl shadow-xl min-w-[300px] animate-in slide-in-from-bottom duration-500">
                        <FileIcon className="w-20 h-20 text-primary" />
                        <div className="text-center">
                            <p className="text-white text-lg font-semibold truncate max-w-[250px]">{file.name}</p>
                            <p className="text-txt text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-md flex flex-col animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex justify-between items-center p-4 bg-background/50 border-b border-secondary/50">
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-secondary rounded-full transition-colors text-txt hover:text-white"
                >
                    <X className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-2">
                    {type === 'image' && <ImageIcon className="w-4 h-4 text-photo" />}
                    {type === 'video' && <Film className="w-4 h-4 text-photo" />}
                    {type === 'audio' && <Music className="w-4 h-4 text-audio" />}
                    {type === 'file' && <FileIcon className="w-4 h-4 text-doc" />}
                    <span className="text-white font-semibold">Preview</span>
                </div>
                <div className="w-10" /> {/* Spacer */}
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 pb-0 overflow-hidden">
                <div className="flex-1 flex items-center justify-center w-full">
                    {renderPreview()}
                </div>
            </div>

            {/* Footer with Caption */}
            <div className="p-6 pt-4 flex flex-col items-center bg-background/50 border-t border-secondary/50">
                <div className="flex items-center gap-4 w-full max-w-2xl">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="Add a caption..."
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && onSend()}
                            className="w-full h-12 bg-secondary text-white placeholder:text-txt rounded-xl px-4 outline-none border-2 border-transparent focus:border-primary/30 transition-all"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-txt hidden sm:block">
                            {file.name}
                        </div>
                    </div>
                    <button
                        onClick={onSend}
                        disabled={isSending}
                        className="w-14 h-14 bg-primary hover:bg-primary/90 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                    >
                        {isSending ? (
                            <div className="w-6 h-6 border-2 border-background border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Send className="w-6 h-6 text-background ml-1" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MediaPreview;
