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
      className={`w-9 h-9 [&_svg]:w-4 [&_svg]:transition-all hover:[&_svg]:scale-90 ${active && "[&_svg]:scale-90"} rounded-full transition-all hover:cursor-pointer flex justify-center items-center ${variant === "chats" && "relative"
        } ${variant === "chats"
          ? "text-white"
          : active
            ? "text-white bg-gray"
            : "text-txt hover:text-white hover:bg-gray"
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
