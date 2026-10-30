# Minhas Tarefas - Aluna: maria Luísa Albuquerque Bandeira de Carvalho

Lista de tarefas (to-do list) feita com HTML, CSS e TypeScript para praticar os pilares da Programação Orientada a Objetos: abstração, herança, encapsulamento e polimorfismo.

## Funcionalidades

- Adicionar tarefas pelo botão **Adicionar**
- Marcar e desmarcar tarefas como concluídas
- Editar a descrição de uma tarefa
- Remover tarefas
- Filtrar entre **Todas**, **Pendentes** e **Concluídas**
- Ver quantas tarefas existem no total, quantas estão concluídas e quantas estão pendentes
- Manter as tarefas salvas no navegador (`localStorage`) depois de fechar a página

## Estrutura

| Arquivo | Conteúdo |
| --- | --- |
| `index.html` | Estrutura da página: campo de texto, filtros, lista e estatísticas |
| `style.css` | Estilos da página, em tons de rosa |
| `app.ts` | Toda a lógica da aplicação, escrita em TypeScript |
| `app.js` | Arquivo gerado a partir do `app.ts` pelo compilador. Não deve ser editado à mão |
| `tsconfig.json` | Configuração do compilador TypeScript |

## Como rodar

1. Compile o TypeScript:

   ```bash
   npx -p typescript tsc
   ```

   Para recompilar sozinho sempre que salvar o arquivo, use `npx -p typescript tsc --watch`.

2. Abra o `index.html` no navegador.