import ChatsHeader from "../../components/ChatsHeader/ChatsHeader";
import SearchInput from "../../components/SearchInput/SearchInput";
import RoomCard from "../../components/RoomCard/RoomCard";

const ChatsViewSection = () => {
  return (
    <section
      className={`grid justify-stretch items-start content-start gap-4 border-x-2 border-x-secondary h-screen py-2`}
    >
      <ChatsHeader />
      <SearchInput />
      <div className="grid justify-stretch items-center overflow-y-auto h-full px-4 gap-1">
        {Array.from({ length: 20 }).map((_, i) => (
          <RoomCard index={i} key={i} />
        ))}
      </div>
    </section>
  );
};

export default ChatsViewSection;
