import { useState, useEffect } from "react";
import { useChatsStore } from "../../globals/useChatsStore";
import CloseIcon from "../../icons/CloseIcon";
import Icon from "../../components/Icon/Icon";
import roomService from "../../services/room.service";
import type { Media } from "../../types/app.d";

const tabs = [
  { key: 'all', label: 'All' },
  { key: 'image', label: 'Photos' },
  { key: 'video', label: 'Videos' },
  { key: 'audio', label: 'Audio' },
  { key: 'file', label: 'Docs' },
];

const RoomMediaSection = () => {
  const currentRoomId = useChatsStore((state) => state.room);
  const setRoomTab = useChatsStore((state) => state.setRoomTab);
  const [activeTab, setActiveTab] = useState('all');
  const [media, setMedia] = useState<Media[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!currentRoomId) return;

    const fetchMedia = async () => {
      setIsLoading(true);
      try {
        const type = activeTab === 'all' ? undefined : activeTab;
        const data = await roomService.getRoomMedia(currentRoomId, type);
        setMedia(data);
      } catch (error) {
        console.error('Failed to fetch media:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMedia();
  }, [currentRoomId, activeTab]);

  return (
    <section className="grid justify-stretch items-start content-start gap-0 bg-background border-l border-secondary h-screen w-[400px]">
      {/* Header */}
      <header className="flex justify-start items-center gap-4 px-5 py-3 bg-secondary border-b border-secondary_light shrink-0">
        <Icon variant="chats" onClick={() => setRoomTab("info")}>
          <CloseIcon className="text-txt rotate-180" /> {/* Back icon style */}
        </Icon>
        <h3 className="text-lg text-white font-medium">Media, links and docs</h3>
      </header>

      {/* Tabs */}
      <div className="flex gap-4 px-6 border-b border-secondary pt-2 shrink-0">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pb-2 text-sm font-medium transition-all relative ${activeTab === tab.key ? 'text-primary' : 'text-txt hover:text-white'
              }`}
          >
            {tab.label}
            {activeTab === tab.key && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary animate-in fade-in duration-300"></div>
            )}
          </button>
        ))}
      </div>

      {/* Media Grid */}
      <div className="overflow-y-auto flex-1 p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : media.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-txt">
            <p>No media found</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {media.map((item) => (
              <div
                key={item._id}
                className="aspect-square bg-secondary rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
              >
                {item.type === 'image' ? (
                  <img src={item.url} alt="" className="w-full h-full object-cover" />
                ) : item.type === 'video' ? (
                  <video src={item.url} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center bg-secondary_light/30">
                    <span className="text-xl">
                      {item.type === 'audio' ? '🎵' : '📎'}
                    </span>
                    <span className="text-[10px] text-txt line-clamp-2 mt-1 px-1">
                      {item.fileName}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default RoomMediaSection;
