# Interface - Card Collector

O front-end do projeto Card Collector é uma aplicação web responsiva projetada para ajudar usuários a organizar e gerenciar suas coleções de cartas. Ele conta com um sistema de autenticação, integração com uma API RESTful para o gerenciamento de inventário e utiliza a API do Scryfall para buscar e adicionar cartas com base em autocompletar, oferecendo uma experiência interativa e amigável.

## Integrantes

- André Augusto Rodrigues Martins (Documentação Técnica)
- Edson Luiz (Desenvolvimento Front-end)
- Vini Rizzato (Desenvolvimento Back-end)

## O Problema que Resolve

A dificuldade de colecionadores em organizar e gerenciar o inventário e informações de suas coleções de cartas de forma centralizada, provendo uma interface acessível e amigável.

## Público-Alvo

Colecionadores de cartas, entusiastas de TCG (Trading Card Games) e usuários que necessitam de um sistema visual para catalogar itens.

## Funcionalidades (MVP)

- Autenticação de usuários (Login e Cadastro) com controle de sessão via JWT salvo no localStorage.
- Gerenciamento de Coleções (CRUD completo: criar, listar, renomear e deletar coleções).
- Busca inteligente de cartas com funcionalidade de autocompletar (debounce) integrada à API pública do Scryfall.
- Gerenciamento de Cartas nas coleções (adicionar especificando a edição/set e quantidade, editar e remover cartas).
- Formulários com validação e feedback visual de erros em tempo real.
- Atualização dinâmica do DOM, incluindo listagens interativas e mensagens de sucesso/erro (ex: Toasts e alertas visuais).

## Telas e Páginas

- **index.html**: Dashboard (Página inicial logada) contendo a listagem das coleções do usuário, opções para criar, renomear e excluir coleções.
- **src/main/pages/login.html**: Página de login para acesso ao sistema.
- **src/main/pages/register.html**: Página de cadastro de novos usuários.
- **src/main/pages/collection-detail.html**: Detalhes de uma coleção específica, exibindo a listagem de cartas pertencentes à coleção, além das opções para editar quantidade, alterar o set ou removê-las.
- **src/main/pages/add-card.html**: Interface para busca e adição de novas cartas a uma coleção. Apresenta o preview da imagem da carta antes de adicioná-la.
- **src/main/pages/edit-collection.html**: Página dedicada para alterar o nome de uma coleção de forma isolada.

## Tecnologias

- HTML Semântico
- CSS Responsivo (Mobile First)
- JavaScript com DOM
- Consumo da API via fetch

## Como rodar

1. Clone o repo: `git clone https://github.com/EdsonLuiz-Dev/frontend-card-collector.git`
2. Sirva os arquivos localmente usando a extensão Live Server no VS Code (ou utilize um servidor HTTP simples, como o `npx http-server`), abrindo primeiramente o arquivo `index.html`.
3. Certifique-se de configurar a URL base da API no código JavaScript (`src/main/js/config.js`) para apontar para o back-end em execução.

## Integração com a API (Endpoints Consumidos)

- **POST** `/login`: Autenticação do usuário.
- **POST** `/cadastro`: Registro de novos usuários.
- **GET** `/collection`: Listagem das coleções do usuário autenticado.
- **POST** `/collection`: Criação de uma nova coleção.
- **PUT** `/collection`: Renomear uma coleção.
- **DELETE** `/collection`: Excluir uma coleção.
- **GET** `/collection/card/add/{name}`: Busca de informações detalhadas e diferentes edições (sets) de uma carta.
- **POST** `/collection/card/add/{name}`: Adição de uma carta no inventário da coleção.
- **PUT** `/collection/card`: Atualização da edição (set) e quantidade de uma carta.
- **DELETE** `/collection/card`: Remoção de uma carta do inventário.
*(Endpoint externo: `GET https://api.scryfall.com/cards/autocomplete` para sugestões de busca).*

## Deploy

Link: (https://frontend-card-collector.vercel.app/src/main/pages/login.html)
