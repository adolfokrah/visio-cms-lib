import { useEffect, useRef, useState } from 'react';

const usePageTabs = () => {
  const data = [
    { name: 'Home page', active: false },
    { name: 'About page', active: true },
    { name: 'Services page', active: false },
    { name: 'Contact page', active: false },
    { name: 'Blog page', active: false },
    { name: 'Portfolio page', active: false },
    { name: 'Testimonials page', active: false },
    { name: 'FAQ page', active: false },
    { name: 'Pricing page', active: false },
    { name: 'Terms and Conditions page', active: false },
    { name: 'Privacy Policy page', active: false },
    { name: 'Careers page', active: false },
    { name: 'Support page', active: false },
    { name: 'Resources page', active: false },
    { name: 'Partners page', active: false },
    { name: 'Events page', active: false },
    { name: 'Newsletter page', active: false },
    { name: 'Sitemap page', active: false },
    { name: 'User Dashboard page', active: false },
    { name: 'Admin Panel page', active: false },
    { name: 'Settings page', active: false },
    { name: 'Help Center page', active: false },
    { name: 'Contact Us page', active: false },
    { name: '404 Not Found page', active: false },
    { name: 'Coming Soon page', active: false },
    { name: 'Accessibility page', active: false },
  ];

  const [pages, setPages] = useState(data);
  const [visibleTabs, setVisibleTabs] = useState<string[]>([]);
  const [hiddenTabs, setHiddenTabs] = useState<string[]>([]);
  const [selectedTab, setSelectedTab] = useState<string | null>(null); // Track selected tab
  const containerRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<Map<string, HTMLDivElement>>(new Map()); // Store tab references

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
    setPages((prevState) => {
      return prevState.map((page) => ({ ...page, active: page.name == name }));
    });
  };

  return { visibleTabs, hiddenTabs, containerRef, pages, tabRefs, setSelectedTab, handleTabClick };
};

export default usePageTabs;
