import { Block, Color, MediaFile } from '@/lib/exposed-types';
import { getImageUrl, getLink } from '@/lib/utils';

const stats = [
  { id: 1, name: 'Creators on the platform', value: '8,000+' },
  { id: 2, name: 'Flat platform fee', value: '3%' },
  { id: 3, name: 'Uptime guarantee', value: '99.9%' },
  { id: 4, name: 'Paid out to creators', value: '$70M' },
];

type TestimonialProps = {
  backgroundColor: Color;
  title: string;
  subTitle: string;
  link?: string;
  backgroundImage: MediaFile;
  counter: number;
};

const Testimonial: Block<TestimonialProps> = ({ backgroundColor, title, backgroundImage, link, counter }) => {
  return (
    <div
      className="visio-cms-bg-gray-900 visio-cms-py-24 sm:visio-cms-py-32"
      style={{
        backgroundColor: backgroundColor?.colorHex,
        backgroundImage: `url(${getImageUrl(backgroundImage)})`,
      }}
    >
      <div className="visio-cms-mx-auto visio-cms-max-w-7xl visio-cms-px-6 lg:visio-cms-px-8">
        <div className="visio-cms-mx-auto visio-cms-max-w-2xl lg:visio-cms-max-w-none">
          <div className="visio-cms-text-center">
            <h2 className="visio-cms-text-3xl visio-cms-font-bold visio-cms-tracking-tight visio-cms-text-white sm:visio-cms-text-4xl">
              {title}
            </h2>
            <p className="visio-cms-mt-4 visio-cms-text-lg visio-cms-leading-8 visio-cms-text-gray-300">
              {getLink(link || '')}
            </p>
            <h1>{counter}</h1>
          </div>
          <dl className="visio-cms-mt-16 visio-cms-grid visio-cms-grid-cols-1 visio-cms-gap-0.5 visio-cms-overflow-hidden visio-cms-rounded-2xl visio-cms-text-center sm:visio-cms-grid-cols-2 lg:visio-cms-grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.id} className="visio-cms-flex visio-cms-flex-col visio-cms-bg-white/5 visio-cms-p-8">
                <dt className="visio-cms-text-sm visio-cms-font-semibold visio-cms-leading-6 visio-cms-text-gray-300">
                  {stat.name}
                </dt>
                <dd className="visio-cms-order-first visio-cms-text-3xl visio-cms-font-semibold visio-cms-tracking-tight visio-cms-text-white">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

Testimonial.Schema = {
  name: 'Testimonial Section',
  id: 'testimonial',
  sideEditingProps: [
    {
      propName: 'backgroundColor',
      label: 'Background Color',
      type: 'color',
    },
    {
      propName: 'title',
      label: 'Title',
      type: 'text',
      group: 'Content',
    },
    {
      propName: 'subTitle',
      label: 'Sub Title',
      type: 'text',
      group: 'Content',
    },
    {
      propName: 'link',
      label: 'Link',
      type: 'link',
      group: 'Content',
    },
    {
      propName: 'backgroundImage',
      label: 'Background Image',
      type: 'image',
      group: 'Content',
    },
    {
      propName: 'counter',
      label: 'Current Counter Number',
      type: 'number',
      group: 'Content',
    },
  ],
  defaultPropValues: {
    counter: 0,
    backgroundImage: {
      mediaHash: 'https://cdn.hometogo.net/assets/media/pics/1920_600/611ba13125591.jpg',
      altText: '',
      width: 0,
      height: 0,
    },
    backgroundColor: { colorHex: '#1F2937', colorName: 'Gray', id: 'gray' },
    title: 'Trusted by creators worldwide',
    subTitle: 'Lorem ipsum dolor sit amet consect adipisicing possimus.',
  },
  group: 'Testimonials',
};

export default Testimonial;
