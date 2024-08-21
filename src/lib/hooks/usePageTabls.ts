import { useEffect, useRef, useState } from 'react';
import { usePagesState } from '../states/usePagesState';
import { useTabState } from '../states/useTabsState';

const usePageTabs = () => {
  const {
    pages,
    setPages,
    selectedPage: selectedTab,
    setSelectedPage: setSelectedTab,
    setPageSeoFeaturedImages,
  } = usePagesState();
  const [visibleTabs, setVisibleTabs] = useState<string[]>([]);
  const [hiddenTabs, setHiddenTabs] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const { tabs, setTabs } = useTabState(); // Store tab references

  useEffect(() => {
    const updateTabVisibility = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const tabElements = Array.from(containerRef.current.children) as HTMLElement[];
        let totalWidth = 0;

        const visible: string[] = [];
        const hidden: string[] = [];

        tabElements.forEach((tab) => {
          totalWidth += tab.offsetWidth;
          if (totalWidth > containerWidth) {
            hidden.push(tab.id || '');
          } else {
            visible.push(tab.id || '');
          }
        });

        setVisibleTabs(visible);
        setHiddenTabs(hidden);
      }
    };

    updateTabVisibility();
    window.addEventListener('resize', updateTabVisibility);
    return () => window.removeEventListener('resize', updateTabVisibility);
  }, [pages]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const newVisibleTabs: string[] = [];
        const newHiddenTabs: string[] = [];

        entries.forEach((entry) => {
          const tabName = entry.target.id || '';
          if (entry.isIntersecting) {
            newVisibleTabs.push(tabName);
          } else {
            newHiddenTabs.push(tabName);
          }
        });

        setVisibleTabs((prevVisible) => [
          ...prevVisible.filter((name) => !newHiddenTabs.includes(name)),
          ...newVisibleTabs,
        ]);
        setHiddenTabs((prevHidden) => [
          ...prevHidden.filter((name) => !newVisibleTabs.includes(name)),
          ...newHiddenTabs,
        ]);
      },
      { threshold: 0.1 },
    ); // Adjust threshold as needed

    if (containerRef.current) {
      const tabElements = Array.from(containerRef.current.children) as HTMLElement[];
      tabElements.forEach((tab) => observer.observe(tab));
    }

    return () => {
      if (containerRef.current) {
        const tabElements = Array.from(containerRef.current.children) as HTMLElement[];
        tabElements.forEach((tab) => observer.unobserve(tab));
      }
    };
  }, []);

  useEffect(() => {
    if (selectedTab && tabRefs.current.has(selectedTab) && containerRef.current) {
      const tabElement = tabRefs.current.get(selectedTab);
      if (tabElement) {
        tabElement.scrollIntoView({
          behavior: 'smooth',
          inline: 'center', // Center the element in the view
        });
      }
    }
  }, [selectedTab]);

  const handleTabClick = (name: string) => {
    setSelectedTab(name);
    const newPages = pages.map((page) => ({ ...page, active: page.name == name }));
    setTabs(tabs.map((tab) => ({ ...tab, active: tab.name == name })));
    setPages(newPages);
    const activePage = newPages.find((page) => page.active);
    if (activePage) {
      setTimeout(async () => {
        await setPageSeoFeaturedImages(activePage);
      }, 100);
    }
  };

  const handleRemovePage = (name: string) => {
    const newPages = pages.map((page) => ({
      ...page,
      active: page.name == name ? false : page.active,
      pinned: page.name == name ? false : page.pinned,
    }));
    setTabs(tabs.filter((tab) => tab.name != name));
    setPages(newPages);
  };

  return {
    visibleTabs,
    hiddenTabs,
    containerRef,
    pages,
    tabRefs,
    tabs,
    setSelectedTab,
    handleTabClick,
    handleRemovePage,
  };
};

export default usePageTabs;
