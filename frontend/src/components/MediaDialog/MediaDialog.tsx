import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import MediaIcon from "../../icons/MediaIcon";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import Icon from "../Icon/Icon";
import { useMediaDialog } from "../../hooks/useMediaDialog";

type MediaTabType = "all" | "image" | "video" | "audio" | "file";

const tabs: { key: MediaTabType; label: string; icon: string }[] = [
  { key: "all", label: "All", icon: "📁" },
  { key: "image", label: "Photos", icon: "📷" },
  { key: "video", label: "Videos", icon: "🎥" },
  { key: "audio", label: "Audio", icon: "🎵" },
  { key: "file", label: "Files", icon: "📎" },
];

const MediaDialog = () => {
  const {
    handleOpenChange,
    activeTab,
    setActiveTab,
    media,
    mediaCounts,
    isLoading,
    hasRoom,
  } = useMediaDialog();

  return (
    <Dialog onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button>
          <Tooltip>
            <TooltipTrigger>
              <Icon onClick={() => {}} active={false}>
                <MediaIcon />
              </Icon>
            </TooltipTrigger>
            <TooltipContent side="right">Media</TooltipContent>
          </Tooltip>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Media</DialogTitle>
          <DialogDescription>
            {hasRoom
              ? "View shared media in this conversation"
              : "Select a chat to view media"}
          </DialogDescription>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-secondary pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`cursor-pointer px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === tab.key
                  ? "bg-primary text-background"
                  : "text-txt hover:bg-secondary"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              <span className="text-xs opacity-70">
                ({mediaCounts[tab.key]})
              </span>
            </button>
          ))}
        </div>

        {/* Media Grid */}
        <div className="overflow-y-auto max-h-96">
          {!hasRoom ? (
            <div className="flex items-center justify-center h-32 text-txt">
              <p>Select a conversation to view media</p>
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : media.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-txt">
              <p>No media found</p>
              <p className="text-sm">
                Shared photos, videos, and files will appear here
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2 p-2">
              {media.map((item) => (
                <div
                  key={item._id}
                  className="aspect-square bg-secondary rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                >
                  {item.type === "image" ? (
                    <img
                      src={item.url}
                      alt={item.fileName || "Image"}
                      className="w-full h-full object-cover"
                    />
                  ) : item.type === "video" ? (
                    <video
                      src={item.url}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center">
                      <span className="text-3xl mb-2">
                        {item.type === "audio" ? "🎵" : "📎"}
                      </span>
                      <span className="text-xs text-txt line-clamp-2">
                        {item.fileName || item.type}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MediaDialog;
