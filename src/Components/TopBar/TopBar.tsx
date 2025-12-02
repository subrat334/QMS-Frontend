import { LogOut } from "lucide-react";

const TopBar = ({ onLogout }: { onLogout: () => void }) => {
  return (
    <div className="w-full bg-white shadow px-4 py-3 flex justify-end items-center">
      <button
        onClick={onLogout}
        className="flex items-center gap-2 text-red-600 hover:text-red-800"
      >
        <LogOut size={20} />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default TopBar;
