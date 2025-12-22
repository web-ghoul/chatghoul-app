import { useState } from "react";
import CloseIcon from "../../icons/CloseIcon";
import SearchIcon from "../../icons/SearchIcon";

const SearchInput = () => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="px-5">
      <div
        className={`grid justify-stretch items-center grid-cols-[auto_1fr_auto] rounded-full transition-all border ${
          isFocused ? "border-primary outline-1 outline-primary bg-background" : "border-secondary hover:border-gray bg-secondary_light"
        } group px-2 py-1.5`}
      >
        <i className="px-3">
          <SearchIcon className="text-txt w-4 h-auto" />
        </i>
        <input
          type={"search"}
          name={"search"}
          id={"search"}
          autoComplete="off"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search.."
          className="h-full w-full outline-none focus-visible:bg-transparent placeholder:text-txt px-1 [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none text-white text-md"
        />
        <i className="px-3 hover:cursor-pointer">
          <CloseIcon
            className={`transition-all w-4 h-auto text-white ${
              isFocused ? "scale-100" : "scale-0"
            }`}
          />
        </i>
      </div>
    </div>
  );
};

export default SearchInput;
