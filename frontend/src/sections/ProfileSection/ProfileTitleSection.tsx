import UserIcon from "../../icons/UserIcon";

const ProfileTitleSection = () => {
  return (
    <div className="grid justify-center items-center content-center gap-4 h-full">
      <div className="bg-secondary w-20 h-20 p-4 rounded-full flex justify-center items-center m-auto">
        <UserIcon className="text-gray-600 w-full h-auto" />
      </div>
      <h1 className="text-3xl text-white font-medium text-center">Profile</h1>
    </div>
  );
};

export default ProfileTitleSection;
