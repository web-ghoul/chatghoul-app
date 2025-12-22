import Menu from "./Menu";

const ChatInput = () => {
  return (
    <div className="px-2 w-full pb-3 bottom-0 left-0 z-10 shadow-xl">
      <div
        className={`grid justify-stretch items-center grid-cols-[auto_1fr_auto] rounded-full transition-all px-2 py-1.5 bg-secondary_light gap-2`}
      >
        <Menu/>
        <input
          type={"text"}
          name={"message"}
          id={"message"}
          autoComplete="off"
          placeholder="Type a message"
          className="w-full max-h-12 min-h-2 outline-none focus-visible:bg-transparent placeholder:text-txt px-1 [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none text-white text-md"
        />
      </div>
    </div>
  );
};

export default ChatInput;
