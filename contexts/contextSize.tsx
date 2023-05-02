import { createContext, useContext, ReactNode } from "react";
import PropTypes from "prop-types";

import useDeviceSize from "@/hooks/useDeviceSize";

export const SizeContext = createContext({
  width: 0,
  height: 0,
  contentWidth: 0,
  sidebarWidth: 0,
  isMobile: false,
  isTablet: false,
  isSidebarCollapsed: false,
  setIsSidebarCollapsed: (flag: boolean) => {},
  isSidebarVisible: false,
  setIsSidebarVisible: (flag: boolean) => {},
  isTopbarVisible: false,
  setIsTopbarVisible: (flag: boolean) => {},
});

export const SizeProvider = ({ children }: { children: ReactNode }) => {
  const {
    width,
    height,
    contentWidth,
    sidebarWidth,
    isMobile,
    isTablet,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    isSidebarVisible,
    setIsSidebarVisible,
    isTopbarVisible,
    setIsTopbarVisible,
  } = useDeviceSize();

  return (
    <SizeContext.Provider
      value={{
        width,
        height,
        contentWidth,
        sidebarWidth,
        isMobile,
        isTablet,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        isSidebarVisible,
        setIsSidebarVisible,
        isTopbarVisible,
        setIsTopbarVisible,
      }}
    >
      {children}
    </SizeContext.Provider>
  );
};

export const useSizeValues = () => useContext(SizeContext);

SizeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
