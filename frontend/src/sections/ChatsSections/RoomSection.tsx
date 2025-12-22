import ChatInput from "../../components/ChatInput/ChatInput";
import MessageCard from "../../components/MessageCard/MessageCard";
import RoomHeader from "../../components/RoomHeader/RoomHeader";
import Swiper from "../../components/Swiper/Swiper";

const RoomSection = () => {
  return (
    <section className="grid justify-stretch items-center grid-rows-[auto_1fr_auto] bg-background h-screen w-full relative">
      <div
        className="absolute opacity-[0.06] left-0 top-0 w-full h-full"
        style={{
          backgroundImage: `url('https://static.whatsapp.net/rsrc.php/v4/y1/r/m5BEg2K4OR4.png')`,
        }}
      ></div>
      <Swiper/>
      <RoomHeader />
      <div className="grid justify-stretch items-center overflow-y-auto h-full w-full py-4 z-10">
        {Array.from({ length: 20 }).map((_, i) => (
          <MessageCard sender={i % 2 === 0} key={i} />
        ))}
      </div>
      <ChatInput />
    </section>
  );
};

export default RoomSection;
