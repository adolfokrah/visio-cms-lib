import { BlockList } from '../../lib/exposed-types';
import BlogContent from './blog-content';
import ButtonBlock from './button';
import Footer from './footer';
import Hero from './hero';
import Navbar from './navbar';
import Table from './table';
import Testimonial from './testimonials';
import VideoSection from './video-section';

const blocks = [Hero, Navbar, Testimonial, Footer, BlogContent, VideoSection, Table, ButtonBlock] as unknown as BlockList[];

export default blocks;
