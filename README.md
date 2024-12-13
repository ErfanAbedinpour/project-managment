<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a> </p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

# Mini GitHub Clone Project

This project simulates a simplified GitHub-like platform where each user can create projects, add contributors, and assign tasks.  
این پروژه یک پلتفرم ساده شبیه به گیت‌هاب را شبیه‌سازی می‌کند که در آن هر کاربر می‌تواند پروژه‌ها ایجاد کند، مشارکت‌کننده‌ها را اضافه کند و تسک‌ها را تخصیص دهد.

---

## Project Structure | ساختار پروژه

### User Table
Holds all basic user information.

| Column     | Type     | Description                                     |
|------------|----------|-------------------------------------------------|
| id         | Integer  | Unique identifier for each user                 |
| username   | String   | User’s unique username                          |
| email      | String   | User’s email address                            |
| password   | String   | Encrypted password                              |
| role       | String   | User role can ("User","Admin")                  |
| profile    | String   | User Profile                                    |
| displayName| String   | User display name                               |
| created_at | DateTime | Account creation date                           |

---

### Project Table
Contains the details of each project, including the owner (who created it).  
این جدول شامل جزئیات هر پروژه است، از جمله مالک پروژه که آن را ایجاد کرده است.

| Column     | Type          | Description                                     |
|------------|---------------|-------------------------------------------------|
| id         | Integer       | Unique identifier for each project              |
| name       | String        | Project name (unique per user)                  |
| owner_id   | Integer (FK)  | ID of the user who owns the project             |
| isPublic   | Boolean       | Visibility level (public/private)               |
| status     | Enum          | project status (active,deactive,completed)      |
| created_at | DateTime      | Date the project was created                    |

---

### Contributor Table
Stores information about users who contribute to projects.  
این جدول اطلاعات کاربران مشارکت‌کننده در هر پروژه را ذخیره می‌کند.

| Column     | Type         | Description                                    |
|------------|--------------|------------------------------------------------|
| id         | Integer      | Unique identifier for each contributor record  |
| user_id    | Integer (FK) | ID of the contributing user                    |
| project_id | Integer (FK) | ID of the project the user contributes to      |
| joined_at  | Date         | Date to contributed

---

### Task Table
Holds details about tasks within each project. Only the project owner can create tasks, and each task can be assigned to one of the project contributors.  
این جدول شامل جزئیات تسک‌های هر پروژه است. فقط مالک پروژه می‌تواند تسک‌ها را ایجاد کند و هر تسک به یکی از مشارکت‌کنندگان پروژه تخصیص داده می‌شود.

| Column      | Type         | Description                                           |
|-------------|--------------|-------------------------------------------------------|
| id          | Integer      | Unique identifier for each task                       |
| project_id  | Integer (FK) | ID of the project to which the task belongs           |
| assigned_to | Integer (FK) | ID of the contributor assigned to the task            |
| title       | String       | Brief title of the task                               |
| description | Text         | Detailed description of the task                      |
| status      | Enum         | Current status of the task (pending, done, inQueue)   |
| created_at  | DateTime     | Date the task was created                             |


### Activity Table | جدول فعالیت‌ها

The `Activity` table logs all significant actions performed within the project, providing an audit trail for changes. It helps track user interactions with projects, tasks, and contributors, enhancing visibility into project activities.  
جدول `Activity` تمام فعالیت‌های مهم انجام‌شده در پروژه را ثبت می‌کند و یک سابقه‌ی پیگیری از تغییرات فراهم می‌کند. این کار به دنبال کردن تعاملات کاربران با پروژه‌ها، تسک‌ها، و مشارکت‌کنندگان کمک می‌کند و دید بهتری از فعالیت‌های پروژه ارائه می‌دهد.

---

| Column      | Type         | Description                                                    |
|-------------|--------------|----------------------------------------------------------------|
| id          | Integer      | Unique identifier for each activity entry                      |
| project_id  | Integer (FK) | ID of the project associated with the activity                 |
| user_id     | Integer (FK) | ID of the user who performed the action                        |
| task_id     | Integer      | ID of the affected task                                        |
| timestamp   | DateTime     | Date and time when the activity was recorded                   |
| description | Text         | Detailed description of the activity, including changes made   |

## API Endpoints | روت‌های API

### Authentication Routes

- **POST /api/auth/register**: Register a new user.  
- **POST /api/auth/login**: User login.
- **POST /api/auth/logout**: logout User
- **POST /api/auth/token**: generate new tokens

### User Routes

- **GET /api/user/me**: Retrieve the logged-in user’s profile.
- **PATCH /api/user/me**: Update logged-in user’s information.
- **DELETE /api/user/me**: send verification code to user email for delete account.
- **DELETE /api/user/me/verify**: send verification code to user email for delete account.

### Project Routes

- **POST /api/projects**: Create a new project.
- **GET /api/projects/:username**: Get a list of public projects or the logged-in user’s private projects.
- **GET /api/projects/:username/:projectName**: Get details of a specific project.
- **PATCH /api/projects/:projectName**: Update a specific project (owner only).
- **DELETE /api/projects/:projectNaem**: Delete a specific project (owner only).

### Contributor Routes

- **POST /api/projects/:id/contributors**: Add a contributor to a project (owner only).
- **DELETE /api/projects/:id/contributors/:userId**: Remove a contributor from a project (owner only).

### Task Routes

- **POST /api/projects/:id/tasks**: Create a new task within a project (owner only).
- **GET /api/projects/:id/tasks**: Get a list of tasks within a project.
- **PATCH /api/projects/:id/tasks/:taskId**: Update a specific task (owner only).
- **DELETE /api/projects/:id/tasks/:taskId**: Delete a specific task (owner only).

---

## Status and Role Structure

- **User Roles**:
  - **Admin**: Can Manage all resources
  - **User**: Can manage own project and contributer on own project

- **Project Status**:
  - **Active**: The project is ongoing and can be edited.
  - **Completed**: The project is finished and locked for edits.

- **Task Status**:
  - **InQueue**: Task has not started yet.
  - **pending**: Task is currently being worked on.
  - **Done**: Task is finished.
  
--- 

This project allows fine-grained permissions for better management of tasks and collaboration within projects.  
این پروژه اجازه می‌دهد تا سطح دسترسی دقیقی برای مدیریت بهتر تسک‌ها و همکاری در پروژه‌ها داشته باشید.
