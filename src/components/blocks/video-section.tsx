import { Block } from '@/lib/types';

type VideoSectionProps = {
  src: string;
};

const VideoSection: React.FC<VideoSectionProps> = ({ src }) => {
  return (
    <iframe
      width="560"
      height="315"
      className="visio-cms-mx-auto visio-cms-rounded-md"
      src={src}
      title="YouTube video player"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
    ></iframe>
  );
};

const VideoSectionSchema:Block<VideoSectionProps>  = {
  component: VideoSection,
  name: 'video-section',
  id: 'VideoSection',
  sideEditingProps: [
    {
      propName: 'src',
      label: 'Video URL',
      type: 'text',
    },
  ],
  defaultPropValues: {
    src: 'https://www.youtube.com/embed/lXITA5MZIiI?si=baTskSC7IlhKm_ij',
  },
};

export default VideoSectionSchema;
