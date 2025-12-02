import { useState } from "react";
import MainLayout from "../Layout/MainLayout";
import Monitor from "./Monitor";

const MonitorWithLayout = () => {
  const [fullScreen, setFullScreen] = useState(false);

  return (
    <MainLayout fullScreen={fullScreen}>
      <Monitor fullScreen={fullScreen} setFullScreen={setFullScreen} />
    </MainLayout>
  );
};

export default MonitorWithLayout;
