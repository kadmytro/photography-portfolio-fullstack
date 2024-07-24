import React, { useEffect, useRef, useState } from "react";

export interface Tab {
  title: string;
  content: React.ReactNode;
}

export interface TabViewProps {
  tabs: Tab[];
  title?: string;
  hasBanner: boolean;
}

export function TabView({ tabs, title, hasBanner }: TabViewProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [isSticky, setIsSticky] = useState(true);
  const tabViewRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (tabViewRef.current) {
      const tabViewHeight = tabViewRef.current.offsetHeight;
      const tabViewTop =
        tabViewRef.current.getBoundingClientRect().top + window.scrollY;
      const tabViewBottom = tabViewTop + tabViewHeight;
      const scrollY = window.scrollY + window.innerHeight;

      if (scrollY > tabViewBottom) {
        setIsSticky(false);
      } else {
        setIsSticky(true);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const switchToTab = (tabIndex: number): void => {
    const bannerHeight = hasBanner ? 304 : 0;
    const titleHeight = title ? 104 : 0;
    const galleryPadding = title ? 16 : 0;
    const totalScroll = bannerHeight + titleHeight + galleryPadding;
    if (window.scrollY > totalScroll) {
      window.scrollTo({ top: totalScroll, behavior: "smooth" });
    }
    setTimeout(() => {
      setActiveTab(tabIndex);
    }, 150);
  };

  return (
    <div ref={tabViewRef}>
      <div
        className={
          "flex flex-col transition-all w-full bg-primary text-primaryText sticky" +
          (title
            ? isSticky
              ? " -top-6"
              : " -top-36"
            : isSticky
            ? " top-20"
            : " -top-36")
        }
      >
        {title && (
          <div className="m-auto font-normal text-4xl tracking-wider my-8">
            {title}
          </div>
        )}
        <div className="flex py-2 place-content-center">
          {tabs.map((tab, index) => (
            <button
              key={index}
              className={`px-8 py-2 text-lg cursor-pointer transition-colors rounded-full font-semibold w-36 ${
                index === activeTab
                  ? "bg-tabSelected bg-opacity-40 text-tabSelectedText"
                  : "bg-transparent text-tabRegularText text-opacity-70 hover:text-opacity-100"
              }`}
              onClick={() => switchToTab(index)}
            >
              {tab.title}
            </button>
          ))}
        </div>
      </div>
      <div className={"tabContent" + (title ? " py-4 " : "")}>
        {tabs[activeTab].content}
      </div>
    </div>
  );
}
