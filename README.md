

---

# PayWise-BackEnd

## Descrição
O PayWise-BackEnd é a parte do servidor do aplicativo PayWise, responsável por fornecer endpoints para interagir com o banco de dados e processar requisições relacionadas à lógica de negócios do aplicativo.

## Tecnologias Utilizadas
- Node.js
- Express.js
- MongoDB (ou outra base de dados de sua escolha, se for o caso)
- Mongoose (para modelagem de dados e interação com o banco de dados)

## Pré-requisitos
- Node.js instalado
- MongoDB (ou outro banco de dados) instalado e em execução

## Instalação
1. Clone este repositório:
   ```
   git clone https://github.com/Victor-Novais/PayWise-BackEnd.git
   ```
2. Acesse o diretório do projeto:
   ```
   cd PayWise-BackEnd
   ```
3. Instale as dependências do projeto:
   ```
   npm install
   ```

## Configuração
1. Renomeie o arquivo `.env.example` para `.env` e configure as variáveis de ambiente necessárias, como a URL do banco de dados.

## Execução
1. Inicie o servidor:
   ```
   npm start
   ```

## Endpoints



### Transações

- `GET /transactions`: Retorna todas as transações.
- `GET /transactions/:id`: Retorna uma transação específica pelo ID.
- `POST /transactions`: Cria uma nova transação.
- `PUT /transactions/:id`: Atualiza uma transação existente pelo ID.
- `DELETE /transactions/:id`: Exclui uma transação existente pelo ID.

### Usuários

- `GET /users`: Retorna todos os usuários.
- `GET /users/:id`: Retorna um usuário específico pelo ID.
- `POST /users`: Cria um novo usuário.
- `PUT /users/:id`: Atualiza um usuário existente pelo ID.
- `DELETE /users/:id`: Exclui um usuário existente pelo ID.

### Autenticação

- `POST /login`: Realiza o login do usuário.
- `POST /signup`: Registra um novo usuário.



## Contribuição
Contribuições são bem-vindas! Se você quiser contribuir com melhorias ou novas funcionalidades, por favor, siga estas etapas:
1. Faça um fork do repositório
2. Crie uma branch com sua feature (`git checkout -b feature/MinhaNovaFeature`)
3. Faça commit das suas mudanças (`git commit -am 'Adicionando uma nova feature'`)
4. Faça push para a branch (`git push origin feature/MinhaNovaFeature`)
5. Abra um Pull Request



## Contato
Para mais informações sobre o projeto, entre em contato com o desenvolvedor:
- Nome: Victor Novais
- Email: [victornovais1337@gmail.com](mailto:victornovais1337@gmail.com)

--- 

