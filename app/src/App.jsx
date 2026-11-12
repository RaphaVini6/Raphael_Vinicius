import Navbar from './components/Navbar'
import AnimatedSection from './components/AnimatedSection'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-bg"
      >
        Pular para o conteúdo
      </a>
      <Navbar />
      <main id="conteudo">
        <AnimatedSection id="home">
          <Hero />
        </AnimatedSection>
        <AnimatedSection id="sobre-mim">
          <About />
        </AnimatedSection>
        <AnimatedSection id="skills">
          <Skills />
        </AnimatedSection>
        <AnimatedSection id="experiencia">
          <Experience />
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
