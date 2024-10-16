import { Cms } from './components';
import './styles/tailwind.css';
import TestLivePage from './TestLivePage';
import visioConfig from '../visio.config';
function App() {
  const path = window.location.pathname;
  if (path.includes('cms')) {
    return <Cms path={path} {...visioConfig} />;
  }
  return <TestLivePage />;
}

export default App;
