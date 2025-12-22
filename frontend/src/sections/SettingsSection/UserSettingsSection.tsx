import { useAppStore } from "../../globals/useAppStore";

const UserSettingsSection = () => {
  const setTab = useAppStore((state) => state.setTab);
  return (
    <article className="px-5" onClick={() => setTab("profile")}>
      <div
        className={`grid grid-cols-[auto_1fr] justify-stretch items-center gap-4 p-4 transition-all hover:bg-secondary rounded-xl cursor-pointer`}
      >
        <div
          className="m-auto relative bg-cover bg-center bg-no-repeat w-18 h-18 rounded-full overflow-hidden bg-secondary group hover:cursor-pointer border border-solid border-secondary"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1761839258239-2be2146f1605?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxfHx8ZW58MHx8fHx8')`,
          }}
        ></div>
        <div className="grid justify-stretch items-center gap-0">
          <h6 className="text-white text-lg truncate font-medium">
            webGhoul🤬
          </h6>
          <p className="text-txt text-md truncate">
            Everybody is an innocent in his mind🫵🏻
          </p>
        </div>
      </div>
    </article>
  );
};

export default UserSettingsSection;
