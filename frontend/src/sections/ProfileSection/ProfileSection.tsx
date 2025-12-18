import ProfileAvatar from "../../components/ProfileAvatar/ProfileAvatar";
import ProfileHeader from "../../components/ProfileHeader/ProfileHeader";
import UserIcon from "../../icons/UserIcon";

const ProfileSection = () => {
  return (
    <section
      className={`grid justify-stretch items-center grid-cols-[30%_1fr] h-screen`}
    >
      <div
        className={`grid justify-stretch items-start content-start gap-4 border-x-2 border-x-secondary h-screen py-2`}
      >
        <ProfileHeader />
        <div className="grid justify-stretch items-center gap-4 h-full overflow-y-auto">
          <ProfileAvatar />
        </div>
      </div>
      <div className="grid justify-center items-center content-center gap-4 h-full">
        <div className="bg-secondary w-20 h-20 p-4 rounded-full flex justify-center items-center">
          <UserIcon className="text-gray-600 w-full h-auto" />
        </div>
        <h1 className="text-3xl text-white font-medium text-center">Profile</h1>
      </div>
    </section>
  );
};

export default ProfileSection;
