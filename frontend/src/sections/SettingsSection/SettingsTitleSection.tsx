import SettingsIcon from "../../icons/SettingsIcon";

const SettingsTitleSection = () => {
  return (
    <div className="grid justify-center items-center content-center gap-4 h-full">
      <div className="bg-secondary w-20 h-20 p-4 rounded-full flex justify-center items-center m-auto">
        <SettingsIcon className="text-gray-600 w-full h-auto" />
      </div>
      <h1 className="text-3xl text-white font-medium text-center">Settings</h1>
    </div>
  );
};

export default SettingsTitleSection;
