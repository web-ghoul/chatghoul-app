import ProfileAbout from "../../components/ProfileAbout/ProfileAbout";
import ProfileAvatar from "../../components/ProfileAvatar/ProfileAvatar";
import ProfileHeader from "../../components/ProfileHeader/ProfileHeader";
import ProfileName from "../../components/ProfileName/ProfileName";
import ProfilePhone from "../../components/ProfilePhone/ProfilePhone";
import ProfileTitleSection from "./ProfileTitleSection";

const ProfileSection = () => {
  return (
    <section
      className={`grid justify-stretch items-center grid-cols-[30%_1fr] h-screen`}
    >
      <div
        className={`grid justify-stretch items-start content-start gap-4 border-x-2 border-x-secondary h-screen py-2`}
      >
        <ProfileHeader />
        <div className="grid justify-stretch items-center gap-8 h-full overflow-y-auto py-3">
          <ProfileAvatar />
          <ProfileName />
          <ProfileAbout />
          <ProfilePhone />
        </div>
      </div>
      <ProfileTitleSection />
    </section>
  );
};

export default ProfileSection;
