import { useAppStore } from "../../globals/useAppStore";
import { useAuthStore } from "../../globals/useAuthStore";

const UserSettingsSection = () => {
  const setTab = useAppStore((state) => state.setTab);
  const user = useAuthStore((state) => state.user);
  return (
    <article className="px-5" onClick={() => setTab("profile")}>
      <div
        className={`grid grid-cols-[auto_1fr] justify-stretch items-center gap-4 p-4 transition-all hover:bg-secondary rounded-xl cursor-pointer`}
      >
        <div
          className="m-auto relative bg-cover bg-center bg-no-repeat w-18 h-18 rounded-full overflow-hidden bg-secondary group hover:cursor-pointer border border-solid border-secondary"
          style={{
            backgroundImage: user?.avatar ? `url('${user.avatar}')` : 'none',
          }}
        >
          {!user?.avatar && (
            <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-2xl font-bold uppercase">
              {user?.name?.charAt(0)}
            </div>
          )}
        </div>
        <div className="grid justify-stretch items-center gap-0">
          <h6 className="text-white text-lg truncate font-medium">
            {user?.name || "User"}
          </h6>
          <p className="text-txt text-md truncate">
            {user?.about || "Available"}
          </p>
        </div>
      </div>
    </article>
  );
};

export default UserSettingsSection;
