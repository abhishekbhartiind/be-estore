# [BE] E-Store - A Nest.js Backend Application

<a href="https://typeorm.io/">![Static Badge](https://img.shields.io/badge/TypeORM%20-%20blue)</a>
<a href="https://docs.nestjs.com/">![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)</a>
<a href="https://graphql.org/">![GraphQL](https://img.shields.io/badge/-GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white)</a>
<a href="https://docs.docker.com/get-started/">![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)</a>
<a href="https://expressjs.com/de/starter/hello-world.html">![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)</a>
<a href="https://www.apollographql.com/docs/apollo-server/">![Apollo-GraphQL](https://img.shields.io/badge/-ApolloGraphQL-311C87?style=for-the-badge&logo=apollo-graphql)</a>
<a href="https://typegraphql.com/docs/introduction.html">![Type-graphql](https://img.shields.io/badge/-TypeGraphQL-%23C04392?style=for-the-badge)</a>
<a href="https://www.typescriptlang.org/docs/">![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)</a>
<a href="https://www.postgresql.org/docs/current/index.html">![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)</a>

---

I've created an E-Commerce application using Nest.js, a well-known Node.js framework renowned for crafting highly scalable and performant server-side applications. This project serves as the sturdy backbone for my frontend, seamlessly bridging the gap between the server and user interface.

## ✅ Features:
- Robust Authentication & Authorization with Role-Based Access Control (RBAC)
- Well-structured Modules for core entities including Product, Order, User, Address, and more
- Customized many-to-many solution, extending Product and Order relationships with additional columns (`n-to-n relationships`)
- Feature-rich Resolvers for seamless querying and mutation of shop data
- Integrated SMTP service for sending customer emails in response to specific account actions and more

This project acts as an API server, harnessing the power of TypeORM, Type-GraphQL, Nodemailer, and more. It lays the foundation for my e-store frontend application, forming the robust backend infrastructure.

---

## 📃 Requirements
- Make sure that you have Docker and Docker Compose installed
    - Windows or macOS:
      [Install Docker Desktop](https://www.docker.com/get-started)
    - Linux: [Install Docker](https://www.docker.com/get-started) and then
      [Docker Compose](https://github.com/docker/compose)

## 🚀 Running Locally
Clone the project, navigate into project directory & install dependencies:
```bash
  git clone https://github.com/erenustun/be-estore && cd be-estore && npm i
```

### Environment Variables

- Copy `.env.example` to `.env`:
```bash
  cp .env.example .env
```

### Running the docker container:

In the project's main folder, you'll find a docker-compose.yml file that outlines the setup for the backend services. To run the docker container in your local environment, simply navigate to the main directory and execute the following command:
```bash
docker compose up -d
```

#### Halting the Docker container:
To halt the container, simply execute:
```bash
docker compose stop
```

To cease and delete the container, including its associated volumes, execute:
```bash
docker compose down -v
```

### Launch the application in development mode
```bash
npm run start:dev
```

### GraphQL Playground (API Documentation) - Explore and Learn
```bash
http://localhost:4000/graphql
```

### 🔖 Issues
#### If you encounter email functionality issues, please execute npm run build after starting the app with npm run start:dev.
