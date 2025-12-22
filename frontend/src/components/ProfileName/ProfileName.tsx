import EditIcon from "../../icons/EditIcon";

const ProfileName = () => {
  return (
    <div className="grid justify-stretch items-center gap-4 w-full px-7.5">
      <p className="text-txt text-sm font-bold">Name</p>
      <div className="flex justify-between items-center gap-3">
        <h6 className="text-white font-medium">webGhoul🤬</h6>
        <EditIcon className="text-txt w-9 h-auto cursor-pointer p-2" />
      </div>
    </div>
  );
};

export default ProfileName;
