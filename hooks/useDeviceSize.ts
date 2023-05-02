import { useEffect, useState } from "react";

import {
  SIDEBARWIDTH_LG,
  SIDEBARWIDTH_MD,
  SIDEBARWIDTH_SM,
} from "@/libs/constants";

const useDeviceSize = () => {
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [contentWidth, setContentWidth] = useState<number>(0);
  const [sidebarWidth, setSidebarWidth] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isTablet, setIsTablet] = useState<boolean>(false);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [isSidebarVisible, setSidebarVisible] = useState<boolean>(false);
  const [isTopbarVisible, setTopbarVisible] = useState<boolean>(false);

  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
    setIsMobile(window.innerWidth < 768);
    setIsTablet(window.innerWidth < 1024);
  };

  const setIsSidebarCollapsed = (flag: boolean) => {
    setSidebarCollapsed(flag);
  };

  const setIsSidebarVisible = (flag: boolean) => {
    setSidebarVisible(flag);
  };

  const setIsTopbarVisible = (flag: boolean) => {
    setTopbarVisible(flag);
  };

  useEffect(() => {
    if (!window) return;

    handleWindowSizeChange();

    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (width > 1280) {
      if (isSidebarCollapsed) {
        setContentWidth(width - SIDEBARWIDTH_SM);
        setSidebarWidth(SIDEBARWIDTH_SM);
      } else {
        setContentWidth(width - SIDEBARWIDTH_LG);
        setSidebarWidth(SIDEBARWIDTH_LG);
      }
    } else if (width > 768) {
      if (isSidebarCollapsed) {
        setContentWidth(width - SIDEBARWIDTH_SM);
        setSidebarWidth(SIDEBARWIDTH_SM);
      } else {
        setContentWidth(width - SIDEBARWIDTH_MD);
        setSidebarWidth(SIDEBARWIDTH_MD);
      }
    } else {
      setContentWidth(width);
      setSidebarWidth(0);
    }

    if (!isSidebarVisible) {
      setContentWidth(width);
      setSidebarWidth(0);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, isSidebarCollapsed, isSidebarVisible]);

  return {
    isMobile,
    isTablet,
    contentWidth,
    sidebarWidth,
    width,
    height,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    isSidebarVisible,
    setIsSidebarVisible,
    isTopbarVisible,
    setIsTopbarVisible,
  };
};

export default useDeviceSize;
