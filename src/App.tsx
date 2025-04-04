import { lazy, Suspense } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
// Use lazy loading for components that aren't immediately visible
const About = lazy(() => import('./components/About').then(module => ({ default: module.About })));
const Skills = lazy(() => import('./components/Skills').then(module => ({ default: module.Skills })));
const Projects = lazy(() => import('./components/Projects').then(module => ({ default: module.Projects })));
const Contact = lazy(() => import('./components/Contact').then(module => ({ default: module.Contact })));
import { AnimatedCursor } from './components/AnimatedCursor';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A192F] via-[#112240] to-[#0A192F] text-[#E6F1FF] custom-shadow">
      <AnimatedCursor />
      <Header />
      <Hero />
      <Suspense fallback={<div className="h-screen"></div>}>
        <About />
        <Skills />
        <Projects />
        <Contact />
      </Suspense>
    </div>
  );
}

export default App;