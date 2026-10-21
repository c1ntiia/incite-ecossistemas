# Frontend

React + Vite + Tailwind CSS.

## Como rodar

```bash
npm install
npm run dev
```

Acesse http://localhost:5173

## Scripts

| Comando           | O que faz                    |
| ----------------- | ---------------------------- |
| `npm run dev`     | Servidor de desenvolvimento  |
| `npm run build`   | Build de produção em `dist/` |
| `npm run preview` | Visualiza o build            |
| `npm run lint`    | ESLint                       |

## API

A URL padrão da API é `http://localhost:3000` (em `src/constants/index.js`).
Para mudar, crie um arquivo `.env` (não vai para o Git):

```
VITE_API_URL=http://localhost:3000
```

## Docker

```bash
docker compose up --build
```

Acesse http://localhost:8080

## Estrutura

```
src/
├── assets/       imagens, ícones
├── components/   componentes React (ui/ = componentes base)
├── constants/    valores fixos (nome do app, URL da API...)
├── data/         dados estáticos / mocks
├── hooks/        hooks customizados
├── lib/          funções utilitárias
├── services/     chamadas à API
├── App.jsx
├── App.css
├── index.css     Tailwind + tema
└── main.jsx
```

Veja o guia visual em [DESIGN.md](DESIGN.md).

## Fluxo de trabalho

1. `git checkout -b feature/minha-tarefa`
2. Commits pequenos (`feat:`, `fix:`, `chore:`)
3. `npm run lint && npm run build` antes de subir
4. Abra um Pull Request para a `main`
