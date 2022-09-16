# Websockets

## Sobre o projeto

Aplicação de chat em tempo real criada com o intuito de aprendizado e prática.

Projeto criado para testar o desenvolvimento web utilizando:
- `websockets`: Para comunicação em tempo real entre os usuários da aplicação;
- `typescript`: Para prática e melhor manutenibilidade do código;
- `docker`: Para tornar mais fácil a inicialização da aplicação, e padronizá-la;

## Ambiente

Ambiente desenvolvido em Node, com principais frameworks `express` e `socket.io`.

Versão do Node recomendada: **v14.20.0**.
Versão do Yarn recomendada: **v1.22.19**.

Como subir a aplicação em ambiente de desenvolvimento:

1. Crie um clone deste projeto em uma pasta de sua escolha.
2. Entre dentro da pasta clonada.
3. Instale as dependências do projeto utilizando o comando `yarn install`.
4. Inicie o servidor:
   - `yarn start` ou `yarn start:prod`: Inicia o servidor com o `ts-node`.
   - `yarn start:dev`: Inicia o servidor com o `ts-node-dev`. Útil para desenvolvimento devido ao *respawn* automático da aplicação, entre outras vantagens.

### Subindo com docker

Versão do Docker mínima recomendada: **v20.10.18**.

1. Crie um clone deste projeto em uma pasta de sua escolha.
2. Entre dentro da pasta clonada.
3. Na raíz do projeto, crie uma imagem da aplicação.
    > `docker build . --file ./docker/Dockerfile --tag websockets`
4. Suba um container utilizando a imagem recém criada
    > `docker run -d -p 3000:3000 websockets:latest`

 Caso você desejar criar um volume em sua máquina para garantir que os logs da aplicação não sejam efêmeros, adicione o seguinte trecho em seu **docker run**: `-v <pasta-em-seu-ambiente-local>:/app/websocket/logs`.
```bash
docker run -d -p 3000:3000 -v /home/user/app/websocket/logs:/app/websocket/logs websockets:latest
```
