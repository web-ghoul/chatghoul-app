import { type ReactNode } from "react";

const Icon = ({
  children,
  variant,
  active,
  onClick,
}: {
  children: ReactNode;
  variant?: "chats";
  active?: boolean;
  onClick?: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className={`w-10 h-10 rounded-full transition-all hover:cursor-pointer flex justify-center items-center ${
        variant === "chats" && "relative"
      } ${
        variant === "chats"
          ? "text-white"
          : active
          ? "text-white bg-background"
          : "text-gray-400"
      } group`}
    >
      <div className="relative z-1">{children}</div>
      {variant === "chats" ? (
        <div className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] bg-secondary w-0 h-0 transition-all rounded-full group-hover:w-full group-hover:h-full z-0"></div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Icon;
