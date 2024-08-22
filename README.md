# Introduction

- This project was made to practice TypeScript and other software engineering skills.

# Tech stack

- ReactJS + Vite
- shadcn/ui
- TailwindCSS
- NestJS
- WebRTC
- Socket.io
- PostgreSQL (DrizzleORM)
- Docker

# Database setup steps

```shell
docker compose up
```

- Login to pgadmin
- Initialize server name
- Initialize DB name as "discord-clone-backend"

```shell
cd ./backend
pnpm generate
pnpm migrate
```

- Create first user in drizzle-kit studio or plain SQL
