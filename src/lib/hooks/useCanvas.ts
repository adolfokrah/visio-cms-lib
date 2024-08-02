import { useEffect, useState } from 'react';
import { useControls } from 'react-zoom-pan-pinch';
import { usePagesState } from '../states/usePagesState';

export default function useCanvas({
  canvasWrapperRef,
}: {
  canvasWrapperRef: React.MutableRefObject<HTMLDivElement | null>;
}) {
  const [zooming, setZooming] = useState<boolean>(false);
  const [zoomingOut, setZoomingOut] = useState<boolean>(false);
  const [isMouseOver, setIsMouseOver] = useState<boolean>(false);
  const [panning, setPanning] = useState<boolean>(false);
  const controls = useControls();
  const { pages, pageSwitched, setPageSwitched } = usePagesState();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isMouseOver) {
        if (event.key === 'z') {
          setZooming(true);
        }
        if (event.altKey && zooming) {
          setZoomingOut(true);
        }
        if (event.key === ' ') {
          setPanning(true); // Space bar is held down
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
  }, [zooming, isMouseOver]);

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
  }, [canvasWrapperRef, zooming, zoomingOut, controls]);

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

  return {};
}
