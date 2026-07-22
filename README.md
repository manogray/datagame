# DataGame

DataGame é uma aplicação web para organizar os jogos que você está jogando ou já terminou. Cada jogo pode ser cadastrado com nome, plataforma, ano, status e uma imagem de capa.

## Funcionalidades

- Listagem de jogos em ordem alfabética;
- Cadastro de jogos;
- Upload e pré-visualização da capa;
- Busca de jogos e capas na RAWG, com preenchimento automático dos dados;
- Busca no catálogo Steam com capas verticais para o cadastro manual;
- Upload manual como alternativa quando uma capa não estiver disponível;
- Importação seletiva da biblioteca pública da Steam;
- Sincronização do AppID e tempo total jogado na Steam;
- Identificação visual de jogos zerados ou em progresso;
- Armazenamento dos dados no MongoDB;
- Armazenamento local das imagens enviadas.

## Tecnologias

### Interface

- React;
- React Router;
- Axios;
- Styled Components;
- Unform;
- React Dropzone.

### API

- Node.js;
- Express;
- MongoDB e Mongoose;
- Multer;
- Sucrase;
- Nodemon.

## Estrutura do projeto

```text
datagame/
├── api/          # API REST, integração com o MongoDB e upload de imagens
├── interface/    # Aplicação web React
├── LICENSE
└── README.md
```

## Pré-requisitos

Para executar o projeto localmente, é necessário ter instalado:

- Node.js;
- Yarn;
- MongoDB disponível em `mongodb://localhost:27017`.

## Instalação

A API e a interface possuem dependências e comandos independentes. Instale as dependências em cada diretório:

```bash
cd api
yarn install

cd ../interface
yarn install
```

## Execução

### Configuração da RAWG

Crie uma chave de API em [rawg.io/apidocs](https://rawg.io/apidocs). Depois, copie o arquivo de exemplo e preencha a chave:

```bash
cp .env.example .env
```

```env
RAWG_API_KEY=sua_chave_aqui
```

O Docker Compose lê esse arquivo automaticamente. A chave é utilizada apenas pela API e não é exposta no frontend. Sem ela, o cadastro por upload manual continua funcionando, mas a busca automática fica indisponível.

### Configuração da Steam

Crie uma chave comum da Steam Web API em [steamcommunity.com/dev/apikey](https://steamcommunity.com/dev/apikey) e adicione-a ao mesmo arquivo `.env`:

```env
STEAM_API_KEY=sua_chave_aqui
```

A chave fica somente na API. Para importar uma biblioteca, o perfil precisa ter os detalhes de jogos públicos nas configurações de privacidade da Steam. É possível informar o SteamID 64, um link `steamcommunity.com/profiles/...`, um link personalizado `steamcommunity.com/id/...` ou apenas o identificador personalizado.

Na importação, a Steam fornece a biblioteca, o tempo jogado e uma capa vertical no formato `library_600x900.jpg`. Quando essa capa não está disponível, o DataGame utiliza o ícone retornado pela Steam. Até 20 jogos podem ser importados por operação, e AppIDs já cadastrados são ignorados. A RAWG continua sendo utilizada no cadastro manual por pesquisa.

### Com Docker

Com Docker e Docker Compose instalados, todos os serviços podem ser iniciados com:

```bash
docker compose up --build
```

Depois da inicialização, a interface estará disponível em `http://localhost:3000`, a API em `http://localhost:3001` e o MongoDB em `localhost:27017`. Os dados do MongoDB e as capas enviadas são mantidos em volumes Docker.

Para encerrar os serviços, pressione `Ctrl+C` e execute:

```bash
docker compose down
```

### Sem Docker

Primeiro, certifique-se de que o MongoDB esteja em execução. Depois, em um terminal, inicie a API:

```bash
cd api
yarn dev
```

A API ficará disponível em `http://localhost:3001` e utilizará o banco `datagame`.

Em outro terminal, inicie a interface:

```bash
cd interface
yarn start
```

A interface será aberta pelo servidor de desenvolvimento do Create React App, normalmente em `http://localhost:3000`.

## API

| Método | Rota | Descrição |
| --- | --- | --- |
| `GET` | `/` | Retorna a versão da API |
| `GET` | `/games` | Lista os jogos em ordem alfabética |
| `GET` | `/games/search?query=:nome` | Busca jogos e capas na RAWG |
| `POST` | `/games` | Cadastra um jogo e envia sua capa |
| `GET` | `/steam/library?profile=:perfil` | Lista a biblioteca pública de um perfil Steam |
| `GET` | `/steam/search?query=:nome` | Busca jogos no catálogo Steam |
| `POST` | `/steam/import` | Importa os jogos Steam selecionados |
| `GET` | `/img/:arquivo` | Retorna uma imagem armazenada |

O cadastro em `POST /games` utiliza `multipart/form-data` com os seguintes campos:

| Campo | Tipo | Obrigatório |
| --- | --- | --- |
| `name` | Texto | Sim |
| `status` | Texto (`finished` ou `progress`) | Sim |
| `platform` | Texto | Não |
| `year` | Número | Não |
| `photo` | Imagem | Condicional |
| `coverUrl` | URL da capa selecionada | Condicional |
| `coverSource` | Texto (`rawg`) | Não |
| `externalId` | ID do jogo na RAWG | Não |
| `sourceUrl` | Página do jogo na RAWG | Não |

O cadastro exige `photo` ou `coverUrl`. Quando ambos forem enviados, o upload manual tem prioridade.

O corpo de `POST /steam/import` utiliza JSON:

```json
{
  "steamId": "76561198000000000",
  "games": [
    { "appId": 292030, "status": "finished" },
    { "appId": 1245620, "status": "progress" }
  ]
}
```

As capas enviadas são armazenadas em `api/data/img`.

## Estado atual

O projeto está em estágio inicial. O fluxo principal de cadastro, upload, persistência e listagem está implementado, mas ainda existem melhorias planejadas, como validação dos formulários, tratamento de erros, edição e exclusão de jogos, configuração por variáveis de ambiente e testes automatizados.

## Licença

Este projeto é distribuído sob a GNU General Public License v3.0. Consulte o arquivo [LICENSE](LICENSE) para conhecer os termos completos.
