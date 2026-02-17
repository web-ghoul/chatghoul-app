import ProfileAbout from "../../components/ProfileAbout/ProfileAbout";
import ProfileAvatar from "../../components/ProfileAvatar/ProfileAvatar";
import ProfileName from "../../components/ProfileName/ProfileName";
import ProfilePhone from "../../components/ProfilePhone/ProfilePhone";
import ProfileEmail from "../../components/ProfileEmail/ProfileEmail";
import { useAuthStore } from "../../globals/useAuthStore";
import ProfileTitleSection from "./ProfileTitleSection";
import ProfileHeader from "../../components/ProfileHeader/ProfileHeader";

const ProfileSection = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <section
      className={`grid justify-stretch items-center grid-cols-[30%_1fr] h-screen overflow-x-hidden`}
    >
      <div
        className={`grid justify-stretch items-start content-start gap-4 border-x-2 border-x-secondary h-screen py-2 overflow-x-hidden`}
      >
        <ProfileHeader />
        <div className="grid justify-stretch items-center gap-8 h-full overflow-y-auto py-3 no-scrollbar">
          <div className="grid justify-center items-center gap-2">
            <ProfileAvatar />
            <div className="text-center">
              <h4 className="text-white font-bold">{user?.name}</h4>
              <p className="text-txt text-sm italic opacity-75 max-w-[200px] truncate m-auto">
                {user?.about || "Available"}
              </p>
            </div>
          </div>
          <ProfileName />
          <ProfileAbout />
          <ProfilePhone />
          <ProfileEmail />
        </div>
      </div>
      <ProfileTitleSection />
    </section>
  );
};

export default ProfileSection;
