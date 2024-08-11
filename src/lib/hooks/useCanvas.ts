import { useEffect } from 'react';
import { useControls } from 'react-zoom-pan-pinch';
import { usePagesState } from '../states/usePagesState';
import { useCanvasState } from '../states/useCanvasState';
import { useIframeState } from '../states/useIframeState';
import { Block, Message } from '../types';
import { useProjectConfigurationState } from '../states/useProjectConfigState';
import { v4 as uuidv4 } from 'uuid';

export default function useCanvas({
  canvasWrapperRef,
}: {
  canvasWrapperRef: React.MutableRefObject<HTMLDivElement | null>;
}) {
  const { zooming, zoomingOut, panning, isMouseOver, setZooming, setZoomingOut, setPanning, setIsMouseOver } =
    useCanvasState();
  const controls = useControls();
  const { pages, pageSwitched, setPageSwitched, setPages } = usePagesState();
  const activePage = pages.find((page) => page.active);
  const { setIframeHeight, iframe, iframeHeight } = useIframeState();
  const { blocks } = useProjectConfigurationState();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isMouseOver) {
        event.preventDefault();
        if (event.key === 'z') {
          setZooming(true);
        }
        if (event.altKey && zooming) {
          setZoomingOut(true);
        }
        if (event.key === ' ') {
          setPanning(true); // Space bar is held down
        }
        if (event.metaKey || event.ctrlKey) {
          switch (event.key) {
            case '+':
              controls.zoomIn();
              break;
            case '-':
              controls.zoomOut();
              break;
            case '0':
              controls.setTransform(
                activePage?.canvasSettings?.positionX || 0,
                activePage?.canvasSettings?.positionY || 0,
                8,
              );
              break;
            case '1':
              controls.setTransform(
                activePage?.canvasSettings?.positionX || 0,
                activePage?.canvasSettings?.positionY || 0,
                4.1,
              );
              break;
            case '3':
              controls.setTransform(
                activePage?.canvasSettings?.positionX || 0,
                activePage?.canvasSettings?.positionY || 0,
                1,
              );
              break;
            default:
              return null;
          }
        }
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (isMouseOver) {
        if (event.key === 'z') {
          setZooming(false);
        }
        if (event.key === 'Alt') {
          setZoomingOut(false); // Alt (Option on Mac) key is also held down
        }
        if (event.key === ' ') {
          setPanning(false); // Space bar is held down
        }
      }
    };

    // Add event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Clean up event listeners on component unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [zooming, isMouseOver, setZooming, setZoomingOut, setPanning, controls, activePage]);

  useEffect(() => {
    // Update cursor style based on zooming state
    if (isMouseOver) {
      if (zooming) {
        if (zoomingOut) {
          document.body.style.cursor = 'zoom-out';
        } else {
          document.body.style.cursor = 'zoom-in';
        }
      } else if (panning) {
        document.body.style.cursor = 'grab';
      } else {
        document.body.style.cursor = 'auto'; // Reset cursor to default
      }
    } else {
      document.body.style.cursor = 'auto'; // Reset cursor to default
    }
  }, [zooming, zoomingOut, isMouseOver, panning]);

  useEffect(() => {
    const canvasElement = canvasWrapperRef.current;

    if (canvasElement) {
      const handleMouseEnter = () => setIsMouseOver(true);
      const handleMouseLeave = () => setIsMouseOver(false);
      const handleMouseClicked = () => {
        if (zooming && zoomingOut) controls.zoomOut();
        else if (zooming) controls.zoomIn();
      };

      canvasElement.addEventListener('mouseenter', handleMouseEnter);
      canvasElement.addEventListener('mouseleave', handleMouseLeave);
      canvasElement.addEventListener('click', handleMouseClicked);

      return () => {
        canvasElement.removeEventListener('mouseenter', handleMouseEnter);
        canvasElement.removeEventListener('mouseleave', handleMouseLeave);
        canvasElement.removeEventListener('click', handleMouseClicked);
      };
    }
  }, [canvasWrapperRef, zooming, zoomingOut, controls, setIsMouseOver]);

  useEffect(() => {
    const activePage = pages.find((page) => page.active);

    if (activePage && pageSwitched) {
      if (activePage.canvasSettings) {
        controls.setTransform(
          activePage.canvasSettings.positionX,
          activePage.canvasSettings.positionY,
          activePage.canvasSettings.scale,
        );
        setPageSwitched(false);
      } else controls.resetTransform();
    }
  }, [pages, controls, pageSwitched, setPageSwitched]);

  useEffect(() => {
    const setPageBlocks = (block: Block, position: number) => {
      const page = activePage;
      if (page) {
        const blocks = page.blocks?.[page.activeLanguageLocale] ?? [];
        const newBlocks = [...blocks].map((block) => ({ ...block, isSelected: false }));
        newBlocks.splice(position, 0, {
          id: uuidv4(),
          blockId: block.Schema.id,
          isSelected: true,
          inputs: block.Schema.defaultPropValues,
        });
        page.blocks = {
          ...page.blocks,
          [page.activeLanguageLocale]: newBlocks,
        };
        setPages(pages.map((p) => (p.active ? page : p)));
      }
    };

    const removeBlock = (blockId: string) => {
      const page = activePage;
      if (page) {
        const blocks = page.blocks?.[page.activeLanguageLocale] ?? [];
        const newBlocks = blocks.filter((block) => block.id !== blockId);
        page.blocks = {
          ...page.blocks,
          [page.activeLanguageLocale]: newBlocks,
        };
        setPages(pages.map((p) => (p.active ? page : p)));
      }
    };
    const handleMessage = (event: MessageEvent) => {
      const data: Message = event.data;
      if (data.type === 'setHeight') {
        setIframeHeight(parseInt(data.content));
      } else if (data.type === 'addBlock') {
        const { blockId, position } = JSON.parse(data.content);
        const block = blocks.find((block) => block.Schema.id === blockId);
        if (block) {
          setPageBlocks(block, Number(position));
          setTimeout(() => {
            const scrollHeight = iframe?.contentWindow?.document?.body.scrollHeight ?? 1840;
            setIframeHeight(scrollHeight);
          }, 500);
        }
      } else if (data.type === 'removeBlock') {
        const blockId = data.content;
        removeBlock(blockId);

        setTimeout(() => {
          const page = iframe?.contentWindow?.document?.getElementById('page-content');
          const height =
            activePage?.blocks && activePage?.blocks?.[activePage.activeLanguageLocale]?.length
              ? (page?.scrollHeight ?? iframeHeight)
              : 2000;
          setIframeHeight(height);
        }, 500);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [setIframeHeight, pages, blocks, setPages, activePage, iframe, iframeHeight]);

  useEffect(() => {
    const setHeight = () => {
      setTimeout(() => {
        const page = iframe?.contentWindow?.document?.getElementById('page-content');
        const height =
          activePage?.blocks && activePage?.blocks?.[activePage.activeLanguageLocale]?.length
            ? (page?.scrollHeight ?? iframeHeight)
            : 2000;
        console.log(height);
        setIframeHeight(height);
      }, 1000);
    };
    setHeight();

    iframe?.addEventListener('load', setHeight);

    return () => {
      iframe?.removeEventListener('load', setHeight);
    };
  }, [iframe, setIframeHeight, activePage, iframeHeight]);

  return {};
}
