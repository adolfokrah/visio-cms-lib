import { useEffect, useState } from 'react';
import { Message } from '../types';
import { Page } from '../states/usePagesState';

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

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const sendMessageToParent = (messageToSend: Message) => {
    window.parent.postMessage(messageToSend, '*'); // Replace '*' with the specific origin if needed
  };

  return { activePage, sendMessageToParent };
}
