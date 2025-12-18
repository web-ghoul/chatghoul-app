import MediaIcon from "../../icons/MediaIcon";

const ProfileAvatar = () => {
  return (
    <div
      className="m-auto relative bg-cover bg-center bg-no-repeat w-34 h-34 rounded-full overflow-hidden my-10 bg-secondary group hover:cursor-pointer"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1761839258239-2be2146f1605?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxfHx8ZW58MHx8fHx8')`,
      }}
    >
      <div className="bg-[rgba(0,0,0,0.65)] left-0 top-0 h-full w-full absolute z-0 transition-all opacity-0 group-hover:opacity-100 grid justify-center items-center gap-2 content-center">
        <MediaIcon className="text-white w-6 h-auto m-auto" />
        <h6 className="text-white text-center text-sm">Change Avatar</h6>
      </div>
    </div>
  );
};

export default ProfileAvatar;
