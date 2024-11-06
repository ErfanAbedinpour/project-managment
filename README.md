<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

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

# Project and Task Management System

## Overview

This project management system helps teams and users manage tasks and projects easily. Each user can have different roles, defining their level of access and responsibilities. The system also maintains a history of activities for each project and task.

---

## Roles and Responsibilities

### 1. Admin

- Full access to all resources and data
- User management: add, edit, and delete users
- Project management: create, edit, and delete projects
- Task management: create, edit, assign, and delete tasks
- View and manage activity logs

### 2. Project Manager

- Full access to their assigned projects
- Manage users within their project: assign users to the project
- Manage tasks in the project: create, edit, assign, and delete tasks
- View and manage project activity logs
- Generate project reports

### 3. Regular User

- View projects they are a part of
- View and edit assigned tasks
- Change the status of assigned tasks
- View activity logs related to their tasks

---

## Resources

### 1. User

- **Properties**:
  - `id`: User ID
  - `username`: Username
  - `email`: Email
  - `password`: Encrypted password
  - `role`: Role (Admin, Project Manager, Regular User)
  - `createdAt`: Date of account creation
  - `updatedAt`: Last updated date

### 2. Project

- **Properties**:
  - `id`: Project ID
  - `name`: Project name
  - `description`: Project description
  - `status`: Project status (Active, Inactive, Completed)
  - `startDate`: Project start date
  - `endDate`: Project end date
  - `createdAt`: Date of project creation
  - `updatedAt`: Last updated date
  - `ownerId`: ID of the project manager

### 3. Task

- **Properties**:
  - `id`: Task ID
  - `title`: Task title
  - `description`: Task description
  - `status`: Task status (Backlog, In Progress, Done)
  - `priority`: Priority level (High, Medium, Low)
  - `dueDate`: Task due date
  - `createdAt`: Date of task creation
  - `updatedAt`: Last updated date
  - `assignedTo`: ID of the assigned user
  - `projectId`: ID of the related project

### 4. Activity Log

- **Properties**:
  - `id`: Activity ID
  - `userId`: ID of the user who performed the activity
  - `projectId`: ID of the related project
  - `taskId`: ID of the related task (if applicable)
  - `action`: Type of activity (e.g., created, updated, deleted)
  - `timestamp`: Time of the activity

---

## Relationships

1. **User to Project**: Many-to-Many (A user can belong to multiple projects, and a project can have multiple users.)
2. **Project to Task**: One-to-Many (A project contains multiple tasks, and each task belongs to one project.)
3. **User to Task**: One-to-Many (A user can be assigned to multiple tasks, but each task has only one assignee.)
4. **User to ActivityLog**: One-to-Many (A user can have multiple logged activities.)
5. **Project to ActivityLog**: One-to-Many (A project can have multiple associated activity logs.)
6. **Task to ActivityLog**: One-to-Many (A task can have multiple associated activity logs.)

---

## Allowed Operations by Role

| Operation              | Admin                | Project Manager                        | Regular User                 |
| ---------------------- | -------------------- | -------------------------------------- | ---------------------------- |
| **Manage Users**       | Add, edit, delete    | None                                   | None                         |
| **Manage Projects**    | Create, edit, delete | Projects they own                      | View assigned projects       |
| **Manage Tasks**       | Create, edit, delete | Create and edit tasks in their project | View and edit assigned tasks |
| **View Activity Logs** | View and edit        | View project activity logs             | View task activity logs      |

---

## Database Structure

1. **Users Table**: Stores user information.
2. **Projects Table**: Stores project information.
3. **Tasks Table**: Stores task information.
4. **ActivityLogs Table**: Stores activity history.
5. **UserProjects Table**: Junction table for the Many-to-Many relationship between users and projects.

---

# API Routes and Access Permissions

## User Management

- `POST /api/users` - **Admin** - Creates a new user
- `GET /api/users` - **Admin** - Retrieves a list of all users
- `GET /api/users/:id` - **Admin, Project Manager** - Gets user information by ID
- `PATCH /api/users/:id` - **Admin** - Updates user information by ID
- `DELETE /api/users/:id` - **Admin** - Deletes a user by ID
- `PATCH /api/users/:id/role` - **Admin** - Changes the role of a user

---

## Project Management

- `POST /api/projects` - **Admin, Project Manager** - Creates a new project
- `GET /api/projects` - **Admin, Project Manager** - Retrieves a list of all projects
- `GET /api/projects/:id` - **Admin, Project Manager, Regular User** - Gets project details by ID
- `PATCH /api/projects/:id` - **Admin, Project Manager** - Updates project information by ID
- `DELETE /api/projects/:id` - **Admin** - Deletes a project by ID
- `POST /api/projects/:id/users` - **Admin, Project Manager** - Adds a user to the project
- `GET /api/projects/:id/users` - **Admin, Project Manager** - Retrieves a list of users in a project

- `GET /api/user/me` - **All Users** - Views logged-in user's profile

- `GET /api/projects/:id/tasks` - **Admin, Project Manager, Regular User** - Retrieves tasks in a project

---

## Task Management

- `POST /api/tasks` - **Admin, Project Manager** - Creates a new task
- `GET /api/tasks` - **Admin, Project Manager** - Retrieves a list of all tasks
- `GET /api/tasks/:id` - **Admin, Project Manager, Regular User** - Gets task information by ID
- `PATCH /api/tasks/:id` - **Admin, Project Manager** - Updates task information by ID
- `DELETE /api/tasks/:id` - **Admin** - Deletes a task by ID
- `PATCH /api/tasks/:id/assign` - **Admin, Project Manager** - Assigns or changes the assignee of a task
- `PATCH /api/tasks/:id/status` - **Admin, Project Manager, Regular User** - Updates the status of a task

---

## Activity Log Management

- `GET /api/activity-logs` - **Admin, Project Manager** - Retrieves all activity logs
- `GET /api/activity-logs?userId=:userId` - **Admin, Project Manager** - Gets activities for a specific user
- `GET /api/activity-logs?projectId=:projectId` - **Admin, Project Manager** - Gets activities for a specific project
- `GET /api/activity-logs?taskId=:taskId` - **Admin, Project Manager, Regular User** - Gets activities for a specific task

---

## Authentication

- `POST /api/auth/register` - **All Users** - Registers a new user
- `POST /api/auth/login` - **All Users** - User login and receives JWT token
- `POST /api/auth/logout` - **All Users** - Logs out and revokes token

---

## Reporting

- `GET /api/reports/projects` - **Admin, Project Manager** - Generates a report on projects
- `GET /api/reports/tasks` - **Admin, Project Manager** - Generates a report on tasks
- `GET /api/reports/users` - **Admin** - Generates a report on users
