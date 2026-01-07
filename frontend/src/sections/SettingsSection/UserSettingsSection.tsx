import { useAppStore } from "../../globals/useAppStore";
import { useAuthStore } from "../../globals/useAuthStore";
import UserAvatar from "../../components/UserAvatar/UserAvatar";

const UserSettingsSection = () => {
  const setTab = useAppStore((state) => state.setTab);
  const user = useAuthStore((state) => state.user);
  return (
    <article className="px-5" onClick={() => setTab("profile")}>
      <div
        className={`grid grid-cols-[auto_1fr] justify-stretch items-center gap-4 p-4 transition-all hover:bg-secondary rounded-xl cursor-pointer`}
      >
        <UserAvatar
          src={user?.avatar}
          name={user?.name}
          size="xl"
          className="m-auto"
        />
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
