import { createContext, useContext, ReactNode } from "react";
import PropTypes from "prop-types";

import useDeviceSize from "@/hooks/useDeviceSize";
import { BROWSER_TYPE } from "@/libs/constants";

export const SizeContext = createContext({
  width: 0,
  height: 0,
  contentWidth: 0,
  sidebarWidth: 0,
  isMobile: false,
  isTablet: false,
  isHamburgerVisible: true,
  setIsHamburgerVisible: (flag: boolean) => {},
  isSidebarCollapsed: false,
  setIsSidebarCollapsed: (flag: boolean) => {},
  isSidebarVisible: false,
  setIsSidebarVisible: (flag: boolean) => {},
  isTopbarVisible: false,
  setIsTopbarVisible: (flag: boolean) => {},
  toggleFullscreen: (flag: boolean) => {},
  browserType: BROWSER_TYPE.OTHER as BROWSER_TYPE,
  setBrowserType: (type: BROWSER_TYPE) => {},
});

export const SizeProvider = ({ children }: { children: ReactNode }) => {
  const {
    width,
    height,
    contentWidth,
    sidebarWidth,
    isMobile,
    isTablet,
    isHamburgerVisible,
    setIsHamburgerVisible,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    isSidebarVisible,
    setIsSidebarVisible,
    isTopbarVisible,
    setIsTopbarVisible,
    toggleFullscreen,
    browserType,
    setBrowserType,
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
        isHamburgerVisible,
        setIsHamburgerVisible,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        isSidebarVisible,
        setIsSidebarVisible,
        isTopbarVisible,
        setIsTopbarVisible,
        toggleFullscreen,
        browserType,
        setBrowserType,
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
