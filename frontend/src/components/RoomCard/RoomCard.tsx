import { useChatsStore } from "../../globals/useChatsStore";
import Menu from "./Menu";

const RoomCard = ({ index }: { index: number }) => {
  const room = useChatsStore((state) => state.room);
  const setRoom = useChatsStore((state) => state.setRoom);

  return (
    <article
      onClick={() => setRoom(`${index}`)}
      className={`grid justify-stretch items-center gap-3 transition-all hover:bg-secondary rounded-xl p-4 group grid-cols-[auto_1fr] hover:cursor-pointer ${
        room == `${index}` ? "bg-secondary" : ""
      }`}
    >
      <div
        className="bg-cover bg-center bg-no-repeat w-13 h-13 rounded-full"
        style={{
          backgroundImage: `url('https://media-hbe1-1.cdn.whatsapp.net/v/t61.24694-24/511052883_735092402815370_8665970676075279607_n.jpg?ccb=11-4&oh=01_Q5Aa3QGL-c_E1z8AKVMG5yTkTDRvE0P7dUovefZqY-XgKzvhqQ&oe=6950F880&_nc_sid=5e03e0&_nc_cat=104')`,
        }}
      ></div>
      <div className="grid justify-stretch items-center gap-2">
        <div className="flex justify-between items-center gap-1">
          <h6 className="text-md line-clamp-1 text-white font-normal">
            Mahmoud Salama adasdasda adadasd
          </h6>
          <h6 className="text-sm text-txt font-normal">12/12/2025</h6>
        </div>
        <div className="flex justify-between items-center gap-1 relative overflow-hidden transition-all group-hover:pr-9">
          <p className="text-sm text-txt line-clamp-1">عامل ايه</p>
          <p className="bg-primary py-0.5 px-2 font-bold text-background rounded-full text-sm">
            9
          </p>
          <Menu />
        </div>
      </div>
    </article>
  );
};

export default RoomCard;
