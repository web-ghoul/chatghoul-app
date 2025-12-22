import DoubleCheckIcon from "../../icons/DoubleCheckIcon";

const MessageCard = ({sender}:{sender?:boolean}) => {
  return (
    <article className={`px-16 pb-3 flex ${sender ? "justify-end":"justify-start"} items-center`}>
      <div className={`p-3 rounded-xl grid justify-stretch items-center gap-2 relative w-max max-w-[65%] shadow-md ${sender ? " rounded-tr-none bg-primary_dark":" rounded-tl-none bg-secondary_light"}`}>
        <p className={`text-sm text-white wrap-break-word ${sender ? "pr-6":"pl-6"}`}>Hello Mahmoud , How are you ?</p>
        <div className="flex justify-end items-center gap-2 text-txt">
          <p className="text-sm font-medium">22:27</p>
          <DoubleCheckIcon className={`w-5 h-auto text-blue-400`} />
        </div>
      </div>
    </article>
  );
};

export default MessageCard;
