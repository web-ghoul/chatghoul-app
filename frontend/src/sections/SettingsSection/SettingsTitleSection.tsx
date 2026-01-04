import settingsImage from "../../assets/images/settings.png"

const SettingsTitleSection = () => {
  return (
    <div className="grid justify-center items-center gap-4">
      <img src={settingsImage} alt="settings" className="m-auto w-30 h-auto" />
      <h5 className="font-medium text-white text-center text-2xl">Settings</h5>
    </div>
  );
};

export default SettingsTitleSection;
