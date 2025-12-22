import { useAppStore } from "../../globals/useAppStore";
import ArrowLeftIcon from "../../icons/ArrowLeftIcon";
import Icon from "../Icon/Icon";

const SettingsHeader = () => {
  const setTabsStackBack = useAppStore((state) => state.setTabsStackBack);
  const tabsStack = useAppStore((state) => state.tabsStack);

  return (
    <header className="flex justify-start items-center gap-4 px-5 min-h-10">
      {tabsStack.length > 0 ? (
        <Icon variant="chats" onClick={setTabsStackBack}>
          <ArrowLeftIcon />
        </Icon>
      ) : (
        <></>
      )}
      <h3 className={`text-xl text-white font-medium`}>Settings</h3>
    </header>
  );
};

export default SettingsHeader;
