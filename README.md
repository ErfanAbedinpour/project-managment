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

# پروژه مدیریت تسک‌ها و پروژه‌ها

## مقدمه

این سیستم مدیریت پروژه و تسک، به تیم‌ها و کاربران کمک می‌کند تا وظایف و پروژه‌ها را به آسانی مدیریت کنند. هر کاربر می‌تواند نقش‌های مختلفی داشته باشد که سطح دسترسی و وظایف آن‌ها را تعیین می‌کند. همچنین تاریخچه فعالیت‌ها برای هر پروژه و تسک نگهداری می‌شود.

---

## نقش‌ها و وظایف (Roles and Responsibilities)

### 1. ادمین (Admin)

- دسترسی کامل به همه منابع و داده‌ها
- مدیریت کاربران: افزودن، ویرایش و حذف کاربران
- مدیریت پروژه‌ها: ایجاد، ویرایش و حذف پروژه‌ها
- مدیریت تسک‌ها: ایجاد، ویرایش، تخصیص و حذف تسک‌ها
- مشاهده و مدیریت تاریخچه فعالیت‌ها

### 2. مدیر پروژه (Project Manager)

- دسترسی کامل به پروژه‌های تحت مدیریت خود
- مدیریت کاربران در پروژه خود: تخصیص کاربران به پروژه
- مدیریت تسک‌ها در پروژه: ایجاد، ویرایش، تخصیص و حذف تسک‌ها
- مشاهده و مدیریت تاریخچه فعالیت‌های پروژه خود
- مشاهده و تولید گزارش‌های پروژه

### 3. کاربر عادی (Regular User)

- مشاهده پروژه‌هایی که عضو آن‌ها است
- مشاهده و ویرایش تسک‌های اختصاص‌یافته به خود
- تغییر وضعیت تسک‌های اختصاص‌یافته به خود
- مشاهده تاریخچه فعالیت‌های مربوط به تسک‌های خود

---

## منابع (Resources)

### 1. کاربر (User)

- **پراپرتی‌ها**:

  - `id`: شناسه کاربر
  - `username`:(یکتا) نام کاربری
  - `display_name` نام نمایش پروفایل
  - `profile` پروفایل
  - `email`: ایمیل
  - `password`: رمز عبور (hashed)
  - `role`: نقش (ادمین، مدیر پروژه، کاربر عادی)
  - `createdAt`: تاریخ ایجاد
  - `updatedAt`: تاریخ آخرین به‌روزرسانی

### 2. پروژه (Project)

- **پراپرتی‌ها**:
  - `id`: شناسه پروژه
  - `name`: نام پروژه
  - `description`: توضیحات پروژه
  - `status`: وضعیت (فعال، غیرفعال، تکمیل‌شده)
  - `startDate`: تاریخ شروع
  - `endDate`: تاریخ پایان
  - `createdAt`: تاریخ ایجاد
  - `updatedAt`: تاریخ آخرین به‌روزرسانی
  - `ownerId`: شناسه مدیر پروژه

### 3. تسک (Task)

- **پراپرتی‌ها**:
  - `id`: شناسه تسک
  - `title`: عنوان تسک
  - `description`: توضیحات تسک
  - `status`: وضعیت (در صف، در حال انجام، انجام‌شده)
  - `priority`: اولویت (بالا، متوسط، پایین)
  - `dueDate`: تاریخ مهلت
  - `createdAt`: تاریخ ایجاد
  - `updatedAt`: تاریخ آخرین به‌روزرسانی
  - `assignedTo`: شناسه کاربری که تسک به او تخصیص یافته
  - `projectId`: شناسه پروژه مرتبط

### 4. تاریخچه فعالیت‌ها (ActivityLog)

- **پراپرتی‌ها**:
  - `id`: شناسه فعالیت
  - `userId`: شناسه کاربری که فعالیت را انجام داده
  - `projectId`: شناسه پروژه مربوطه
  - `taskId`: شناسه تسک مربوطه (در صورت وجود)
  - `action`: نوع فعالیت (مثل ایجاد، به‌روزرسانی، حذف)
  - `timestamp`: زمان انجام فعالیت

---

## روابط بین منابع

1. **User to Project**: Many-to-Many (هر کاربر می‌تواند در چندین پروژه عضو باشد و هر پروژه می‌تواند چندین کاربر داشته باشد.)
2. **Project to Task**: One-to-Many (هر پروژه شامل چندین تسک است و هر تسک فقط به یک پروژه تعلق دارد.)
3. **User to Task**: One-to-Many (هر کاربر می‌تواند مسئول چندین تسک باشد، ولی هر تسک فقط یک مسئول دارد.)
4. **User to ActivityLog**: One-to-Many (هر کاربر می‌تواند فعالیت‌های مختلفی را ثبت کند.)
5. **Project to ActivityLog**: One-to-Many (هر پروژه می‌تواند دارای چندین فعالیت ثبت‌شده باشد.)
6. **Task to ActivityLog**: One-to-Many (هر تسک می‌تواند دارای چندین فعالیت مرتبط باشد.)

---

## عملیات مجاز برای هر نقش

| عملیات                | ادمین               | مدیر پروژه                       | کاربر عادی                           |
| --------------------- | ------------------- | -------------------------------- | ------------------------------------ |
| **مدیریت کاربران**    | افزودن، ویرایش، حذف | ندارد                            | ندارد                                |
| **مدیریت پروژه‌ها**   | ایجاد، ویرایش، حذف  | پروژه‌های خود                    | مشاهده پروژه‌های عضو                 |
| **مدیریت تسک‌ها**     | ایجاد، ویرایش، حذف  | ایجاد و ویرایش تسک‌های پروژه خود | مشاهده و ویرایش تسک‌های اختصاص یافته |
| **تاریخچه فعالیت‌ها** | مشاهده و ویرایش     | مشاهده فعالیت‌های پروژه خود      | مشاهده فعالیت‌های تسک خود            |

---

## ساختار پایگاه داده و جداول (Database Structure)

1. **جدول Users**: شامل اطلاعات کاربران.
2. **جدول Projects**: شامل اطلاعات پروژه‌ها.
3. **جدول Tasks**: شامل اطلاعات تسک‌ها.
4. **جدول ActivityLogs**: شامل تاریخچه فعالیت‌ها.
5. **جدول UserProjects**: جدول واسط برای رابطه Many-to-Many بین کاربران و پروژه‌ها.

---

## مستندسازی APIها

### 1. APIهای کاربران (Users)

- **ایجاد کاربر**: `/api/users` (روش `POST`)
- **مشاهده لیست کاربران**: `/api/users` (روش `GET`)
- **ویرایش کاربر**: `/api/users/:id` (روش `PATCH`)
- **حذف کاربر**: `/api/users/:id` (روش `DELETE`)

### 2. APIهای پروژه‌ها (Projects)

- **ایجاد پروژه**: `/api/projects` (روش `POST`)
- **مشاهده لیست پروژه‌ها**: `/api/projects` (روش `GET`)
- **ویرایش پروژه**: `/api/projects/:id` (روش `PATCH`)
- **حذف پروژه**: `/api/projects/:id` (روش `DELETE`)

### 3. APIهای تسک‌ها (Tasks)

- **ایجاد تسک**: `/api/tasks` (روش `POST`)
- **مشاهده لیست تسک‌ها**: `/api/tasks` (روش `GET`)
- **ویرایش تسک**: `/api/tasks/:id` (روش `PATCH`)
- **حذف تسک**: `/api/tasks/:id` (روش `DELETE`)

### 4. APIهای تاریخچه فعالیت‌ها (ActivityLogs)

- **مشاهده لیست فعالیت‌ها**: `/api/activity-logs` (روش `GET`)
- **مشاهده فعالیت‌های یک تسک یا پروژه خاص**: `/api/activity-logs?taskId=:taskId&projectId=:projectId` (روش `GET`)

---
