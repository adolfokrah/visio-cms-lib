import { useEffect } from 'react';
import { Message } from '../types';
import { sendMessageToParent } from '../utils';
import { usePageContentState } from '../states/usePageContentState';

export default function usePageContent() {
  const { pages, setPages, setGlobalBlocks, setTabs } = usePageContentState();
  const activePage = pages.find((page) => page.active);

  useEffect(() => {
    function getStorageData() {
      const pages = JSON.parse(sessionStorage.getItem('pages-storage') || '{}');
      const projectConfiguration = JSON.parse(sessionStorage.getItem('project-configuration-storage') || '{}');
      const tabs = JSON.parse(sessionStorage.getItem('tabs-storage') || '{}');
      if (pages && pages.state.pages) {
        setPages(pages.state.pages);
      }
      if (projectConfiguration.state.globalBlocks) {
        setGlobalBlocks(projectConfiguration.state.globalBlocks);
      }
      if (tabs.state.tabs) {
        setTabs(tabs.state.tabs);
      }
    }

    getStorageData();
    const handleStorageChange = (event: StorageEvent) => {
      // Check if the change is in sessionStorage
      if (event.storageArea === sessionStorage) {
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
    document.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent the default navigation behavior
      });
    });
  }, [pages]);

  return { activePage, sendMessageToParent };
}
