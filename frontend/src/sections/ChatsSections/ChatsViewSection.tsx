import ChatsHeader from "../../components/ChatsHeader/ChatsHeader";
import SearchInput from "../../components/SearchInput/SearchInput";
import RoomCard from "../../components/RoomCard/RoomCard";
import { useRoomsList } from "../../hooks/useRoomsList";

const ChatsViewSection = () => {
  const { rooms, searchQuery, setSearchQuery, isLoadingRooms } = useRoomsList();

  return (
    <section
      className={`grid justify-stretch items-start content-start gap-4 border-x-2 border-x-secondary h-screen py-2`}
    >
      <ChatsHeader />
      <SearchInput value={searchQuery} onChange={setSearchQuery} />
      <div className="grid justify-stretch items-center overflow-y-auto h-full px-4 gap-1">
        {isLoadingRooms ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : rooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-txt">
            <p>{searchQuery ? "No chats found" : "No conversations yet"}</p>
            <p className="text-sm">Start a new chat to get started!</p>
          </div>
        ) : (
          rooms.map((room) => (
            <RoomCard key={room._id} room={room} />
          ))
        )}
      </div>
    </section>
  );
};

export default ChatsViewSection;
