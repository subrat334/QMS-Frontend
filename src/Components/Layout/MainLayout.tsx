
import { useState } from "react";
import Sidebar from "../Sidebar/Sidebar";

const MainLayout = ({
  children,
  fullScreen = false,
}: {
  children: React.ReactNode;
  fullScreen?: boolean;
}) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    // <div className="flex h-screen w-screen overflow-hidden">
    <div className="flex h-screen w-screen">


      {/* HIDE SIDEBAR WHEN FULL SCREEN */}
      {!fullScreen && (
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      )}

      <main
        className={`flex-1 transition-all duration-300 
          ${
            !fullScreen
              ? collapsed
                ? "ml-16"        // collapsed sidebar
                : "ml-[200px]"   // expanded sidebar
              : "ml-0"           // fullscreen → no margin
          }
        `}
      >
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
