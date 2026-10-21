# Design

Guia visual do projeto. Mantenha atualizado para que todos sigam o mesmo padrão.

## Cores

As cores ficam como variáveis CSS em `src/index.css` e são usadas pelo Tailwind:

| Token         | Uso                         | Classe Tailwind           |
| ------------- | --------------------------- | ------------------------- |
| `background`  | Fundo da página             | `bg-background`           |
| `foreground`  | Texto principal             | `text-foreground`         |
| `primary`     | Botões e destaques          | `bg-primary`              |
| `muted`       | Textos secundários          | `text-muted-foreground`   |
| `destructive` | Erros e ações perigosas     | `bg-destructive`          |
| `border`      | Bordas                      | `border-border`           |

## Tipografia

- Títulos: `text-4xl font-bold tracking-tight`
- Subtítulos: `text-xl font-semibold`
- Texto: `text-base`
- Texto secundário: `text-sm text-muted-foreground`

## Espaçamento

Use a escala do Tailwind (`gap-4`, `p-8`...). Evite valores fixos em px.

## Componentes

Componentes base ficam em `src/components/ui`. Antes de criar um novo, verifique se já existe.

## Ícones

[lucide-react](https://lucide.dev/icons):

```jsx
import { Search } from 'lucide-react'
```
