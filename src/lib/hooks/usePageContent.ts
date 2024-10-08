import { useEffect } from 'react';
import { Message } from '../types';
import { getProjectMode, sendMessageToParent } from '../utils';
import { usePageContentState } from '../states/usePageContentState';
import { useParamState } from '../states/useParamState';

export default function usePageContent() {
  const { pages, setPages, setGlobalBlocks, setTabs, setSelectedListItem, setTheme } = usePageContentState();
  const activePage = pages.find((page) => page.active);
  const { setParams } = useParamState();
  const isBuilderMode = getProjectMode() === 'BUILDER';

  useEffect(() => {
    if (isBuilderMode) setParams({ locale: activePage?.activeLanguageLocale });
  }, [isBuilderMode, activePage, setParams]);

  useEffect(() => {
    function getStorageData() {
      const pages = JSON.parse(localStorage.getItem('pages-storage') || '{}');
      const projectConfiguration = JSON.parse(localStorage.getItem('project-configuration-storage') || '{}');
      const tabs = JSON.parse(localStorage.getItem('tabs-storage') || '{}');
      const listState = JSON.parse(localStorage.getItem('list-storage') || '{}');
      if (pages && pages.state.pages) {
        setPages(pages.state.pages);
      }
      if (projectConfiguration.state.globalBlocks) {
        setGlobalBlocks(projectConfiguration.state.globalBlocks);
        setTheme(projectConfiguration.state.theme);
      }
      if (tabs.state.tabs) {
        setTabs(tabs.state.tabs);
      }
      if (listState.state) {
        setSelectedListItem(listState.state.selectedListItem);
      }
    }

    getStorageData();
    const handleStorageChange = (event: StorageEvent) => {
      // Check if the change is in localStorage
      if (event.storageArea === localStorage) {
        getStorageData();
      }
    };

    const handlekeyUp = (event: KeyboardEvent) => {
      event.preventDefault();
      if (event.ctrlKey || event.metaKey) {
        if (event.key === 'z') {
          const message: Message = {
            type: 'Undo',
            content: 'Undo',
          };
          sendMessageToParent(message);
        }
        if (event.key === 'y') {
          const message: Message = {
            type: 'Redo',
            content: 'Redo',
          };
          sendMessageToParent(message);
        }
      }
    };

    window.addEventListener('keyup', handlekeyUp);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('keyup', handlekeyUp);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    document.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent the default navigation behavior
      });
    });
  }, [pages]);

  return { activePage, sendMessageToParent };
}
