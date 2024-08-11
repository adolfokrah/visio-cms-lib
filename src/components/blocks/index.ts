import { BlockList } from '../../lib/exposed-types';
import Hero from './hero';
import Navbar from './navbar';
import VideoSection from './video-section';

const blocks = [Hero, VideoSection, Navbar] as BlockList[];

export default blocks;
