# Discord Clone Application

![Discord Clone](./docs/screenshots/landing.jpg)

A clone of Discord to practice TypeScript and other software engineering skills, featuring real-time communication with WebRTC, Socket.io, and a PostgreSQL backend.

## Table of Contents

- [Introduction](#introduction)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Screenshots](#screenshots)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Usage](#usage)

## Introduction

This project was made to practice TypeScript and other software engineering skills. It replicates key functionalities of Discord, allowing users to communicate in real-time over text, voice, and video.

## Tech Stack

- **ReactJS + Vite**: For building the frontend with a modern development experience.
- **shadcn/ui**: For a set of accessible, customizable UI components.
- **TailwindCSS**: For styling the application with utility-first CSS.
- **NestJS**: For building a robust backend API.
- **WebRTC**: For enabling real-time communication over video and/or voice.
- **Socket\.io**: For facilitating real-time communication between web clients and servers.
- **DrizzleORM (PostgreSQL)**: For creating a relational database solution with modern ORM features.
- **Docker**: For containerizing the application for easy development environment.

## Features

- Real-time text, voice, and video communication.
- Channel-based messaging similar to Discord.
- Responsive UI design with TailwindCSS.
- Dockerized environment for easy setup and deployment.

## Works in progress

- User authentication and authorization.
- Mobile responsiveness.

## Screenshots

![Servers and channels user interface](docs/screenshots/servers_and_channels_UI.jpg)
_User interface showing the active text channel._

![Creating servers interface](docs/screenshots/create_servers.jpg)
_User interface showing the creating servers modal._

![Creating servers interface light mode](docs/screenshots/light_mode.jpg)
_User interface showing light mode._

![Creating channels interface](docs/screenshots/create_channels.jpg)
_User interface showing the creating channels modal._

![Voiced Channels Interface](docs/screenshots/voiced_channels.jpg)
_User interface showing voiced channel with multiple users present._

## Installation

To get started with this project in development, clone the repository and install dependencies:

```shell
git clone https://github.com/wanitooo/discord-clone.git
cd discord-clone
cd ./backend && pnpm install
cd ./frontend && pnpm install
```

#### ENV variables required

- in ./backend/.env

```shell
NODE_ENV="development"
# NODE_ENV="OUTSIDE"
POSTGRES_HOST="localhost"
POSTGRES_USER="admin"
POSTGRES_PASSWORD="admin"
POSTGRES_DB="discord-clone-backend"
DB_URL="postgres://admin:admin@localhost:5432/discord-clone-backend"
BACKEND_URL="http://127.0.0.1:3000/api"
UPLOAD_RATE_TTL=60
UPLOAD_RATE_LIMIT=3


# For S3 bucket
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_REGION=
AWS_BUCKET_NAME=
```

- in ./frontend/.env

```shell
NODE_ENV="development"
POSTGRES_HOST="localhost"
POSTGRES_USER="admin"
POSTGRES_PASSWORD="admin"
POSTGRES_DB="discord-clone-backend"
DB_URL="postgres://admin:admin@localhost:5432/discord-clone-backend"
BACKEND_URL="http://127.0.0.1:3000/api"

# For S3 bucket
VITE_AWS_ACCESS_KEY_ID=
VITE_AWS_SECRET_ACCESS_KEY=
VITE_AWS_S3_REGION=
VITE_AWS_BUCKET_NAME=
```

#### Database setup

1. Run this shell

```shell
docker compose -f docker-compose-db.yml up
```

A schema.sql file is in this project, generated from [drizzle-kit migrate](https://orm.drizzle.team/docs/migrations) with additional queries for DB seeding. This is automatically intialized along with the db upon creation by docker compose. You may skip #2 altogether.

2. Login to pgAdmin at localhost:5050.
   Default credentials will be: email: admin@admin.com | password: admin

- Create server with hostname/address 192.168.0.2

You can now run queries at the for the discord-clone-backend db via pgAdmin.

#### Usage

```shell
# Start the backend server
cd backend
pnpm run start:dev

# Start the frontend server
cd frontend
pnpm run dev
```
