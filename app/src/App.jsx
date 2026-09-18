import Navbar from './components/Navbar'
import AnimatedSection from './components/AnimatedSection'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Timeline from './components/Timeline'
import Projects from './components/Projects'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <AnimatedSection id="home">
          <Hero />
        </AnimatedSection>
        <AnimatedSection id="sobre-mim">
          <About />
        </AnimatedSection>
        <AnimatedSection id="skills">
          <Skills />
        </AnimatedSection>
        <AnimatedSection id="timeline">
          <Timeline />
        </AnimatedSection>
        <AnimatedSection id="projetos">
          <Projects />
        </AnimatedSection>
        <AnimatedSection id="contato">
          <Footer />
        </AnimatedSection>
      </main>
    </>
  )
}
