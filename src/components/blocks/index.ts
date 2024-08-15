import { BlockList } from '../../lib/exposed-types';
import BlogContent from './blog-content';
import Footer from './footer';
import Hero from './hero';
import Navbar from './navbar';
import Testimonial from './testimonials';
import VideoSection from './video-section';

const blocks = [Hero, VideoSection, Navbar, Testimonial, Footer, BlogContent] as BlockList[];

export default blocks;
