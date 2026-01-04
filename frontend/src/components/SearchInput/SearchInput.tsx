import { useState } from "react";
import CloseIcon from "../../icons/CloseIcon";
import SearchIcon from "../../icons/SearchIcon";

interface SearchInputProps {
  placeholder?: string;
  containerClassName?: string;
  value?: string;
  onChange?: (value: string) => void;
}

const SearchInput = ({
  placeholder = "Search..",
  containerClassName = "px-5",
  value,
  onChange,
}: SearchInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [internalValue, setInternalValue] = useState("");

  // Use controlled or uncontrolled depending on props
  const inputValue = value !== undefined ? value : internalValue;
  const handleChange = (newValue: string) => {
    if (onChange) {
      onChange(newValue);
    } else {
      setInternalValue(newValue);
    }
  };

  const handleClear = () => {
    handleChange("");
  };

  return (
    <div className={containerClassName}>
      <div
        className={`grid justify-stretch items-center grid-cols-[auto_1fr_auto] rounded-full transition-all border ${isFocused ? "border-primary outline-1 outline-primary bg-background" : "border-secondary hover:border-gray bg-secondary_light"
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
          value={inputValue}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="h-full w-full outline-none focus-visible:bg-transparent placeholder:text-txt px-1 [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none text-white text-md"
        />
        <i
          className="px-3 hover:cursor-pointer"
          onClick={handleClear}
        >
          <CloseIcon
            className={`transition-all w-4 h-auto text-white ${isFocused && inputValue ? "scale-100" : "scale-0"
              }`}
          />
        </i>
      </div>
    </div>
  );
};

export default SearchInput;
