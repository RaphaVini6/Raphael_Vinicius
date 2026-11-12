# Portfólio - Raphael Vinicius

Portfólio pessoal em React, com apresentação, skills, linha do tempo, projetos e contato.

## Tecnologias
- React 19 + Vite
- Tailwind CSS 4
- Framer Motion (animações de entrada)
- react-icons
- EmailJS (formulário de contato)
- Vitest + Testing Library (testes) e oxlint (lint)

## Como rodar
O app fica na pasta `app/`:

```bash
cd app
npm install
npm run dev      # servidor de desenvolvimento
npm test         # testes
npm run lint     # lint
npm run build    # build de produção
```

### Formulário de contato (opcional)
Copie `app/.env.example` para `app/.env` e preencha as chaves do EmailJS
(`VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY`).
O e-mail que recebe as mensagens é definido no template do EmailJS (campo "To email"),
no painel do serviço, e não no código. Sem as chaves, o site mostra um botão de e-mail
(`mailto`) e os links de contato.

## Estrutura
```
app/src/components/   seções e componentes da página
app/src/data/         conteúdo (projetos, skills, timeline, links)
app/src/hooks/        hooks (efeito de digitação)
docs/superpowers/     specs e planos de design
```

## Autor
Raphael Vinicius - [LinkedIn](https://www.linkedin.com/in/raphael-vinicius-a1006b26b/) · [GitHub](https://github.com/RaphaVini6)
