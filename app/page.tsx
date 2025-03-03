import Hero from "./components/Hero"
import About from "./components/About"
import Experience from "./components/Experience"
import Skills from "./components/Skills"
import Services from "./components/Services"
import Education from "./components/Education"
import Contact from "./components/Contact"
import FloatingNav from "./components/floating-nav"
import Projects from "./components/Projects"
import Marquee from "./components/Marquee"
import skillList from './components/skillList';

export default function Home() {
  return (
    <main className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <FloatingNav />
      <Hero />
      <Marquee skills={skillList}/>
      <About />
      <Projects/>
      <Experience />
      <Skills />
      <Services />
      <Education />
      <Contact />
    </main>
  )
}

