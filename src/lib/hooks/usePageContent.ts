import { useEffect, useState } from 'react';
import { Message } from '../types';
import { Page } from '../states/usePagesState';
import { sendMessageToParent } from '../utils';

export default function usePageContent() {
  const [pages, setPages] = useState<Page[]>([]);
  const activePage = pages.find((page) => page.active);

  useEffect(() => {
    const pages = JSON.parse(sessionStorage.getItem('pages-storage') || '{}');
    if (pages && pages.state.pages) {
      setPages(pages.state.pages);
    }
    const handleStorageChange = (event: StorageEvent) => {
      // Check if the change is in sessionStorage
      if (event.storageArea === sessionStorage) {
        const pages = JSON.parse(sessionStorage.getItem('pages-storage') || '{}');
        if (pages.state.pages) {
          setPages(pages.state.pages);
        }
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

  return { activePage, sendMessageToParent };
}
