export default function About() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col-reverse items-center gap-10 px-6 py-24 md:flex-row">
      <div className="flex-1">
        <p className="font-mono text-sm text-accent">// 01. sobre-mim</p>
        <h2 className="mt-2 text-2xl font-bold text-text">Sobre mim</h2>
        <p className="mt-6 leading-relaxed text-text-muted">
          Olá! Meu nome é Raphael Vinicius, mas pode me chamar de Rafah. Atualmente estou cursando
          Ciência da Computação na Universidade Tiradentes (UNIT). Sou especialista em
          Desenvolvimento Front-end, mas estou no caminho para me tornar um Desenvolvedor
          Full-Stack.
        </p>
        <p className="mt-4 leading-relaxed text-text-muted">
          No momento, estou aprimorando minhas habilidades em Front-end enquanto aprofundo meus
          conhecimentos em bancos de dados e inteligencia artificial(IA).
        </p>
      </div>
      <img
        src="/about.png"
        alt="Raphael Vinicius"
        className="h-56 w-56 rounded-full border-4 border-white/10 object-cover shadow-lg"
      />
    </div>
  )
}
