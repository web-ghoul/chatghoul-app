import SearchInput from "../../components/SearchInput/SearchInput";
import SettingsHeader from "../../components/SettingsHeader/SettingsHeader";
import SettingsTitleSection from "./SettingsTitleSection";
import UserSettingsSection from "./UserSettingsSection";

const SettingsSection = () => {
  return (
    <section
      className={`grid justify-stretch items-center grid-cols-[30%_1fr] h-screen`}
    >
      <div
        className={`grid justify-stretch items-start content-start gap-4 border-x-2 border-x-secondary h-screen py-2`}
      >
        <SettingsHeader />
        <SearchInput />
        <UserSettingsSection/>
      </div>
      <SettingsTitleSection />
    </section>
  );
};

export default SettingsSection;
