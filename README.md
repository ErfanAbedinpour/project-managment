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

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

## Project Description

ایده پروژه: سیستم مدیریت تسک‌ها و پروژه‌ها
این پروژه شامل ایجاد و مدیریت پروژه‌ها و تسک‌ها، اختصاص آن‌ها به کاربران مختلف، و پیگیری وضعیت‌ها است. با پیاده‌سازی آن می‌توانید مهارت‌های خود را در زمینه‌ی طراحی و پیاده‌سازی APIها و مدیریت پایگاه داده به نمایش بگذارید.

ویژگی‌های پیشنهادی:
مدیریت کاربران:

ایجاد و حذف کاربران
مدیریت نقش‌ها (مثلاً ادمین، مدیر پروژه، کاربر عادی)
مدیریت پروژه‌ها:

افزودن و حذف پروژه‌ها
تخصیص اعضا به پروژه‌ها
مشاهده‌ی وضعیت کلی پروژه
مدیریت تسک‌ها:

ایجاد، به‌روزرسانی، و حذف تسک‌ها
مشخص کردن وضعیت تسک (انجام نشده، در حال انجام، انجام شده)
تخصیص تسک‌ها به کاربران خاص
اضافه کردن تاریخ‌های شروع و پایان به تسک‌ها
ثبت فعالیت‌ها:

ثبت تاریخچه‌ای از تغییرات روی هر پروژه یا تسک (چه کسی چه تغییری داد و در چه زمانی)
استفاده از سیستم رویدادها (Event-based system) برای ثبت و ذخیره فعالیت‌ها
احراز هویت و مجوزها:

استفاده از JWT برای احراز هویت کاربران
اعمال سطح دسترسی‌ها به هر قسمت از پروژه
مستندسازی API:

استفاده از Swagger برای مستندسازی APIها به‌طور کامل، تا دیگران بتوانند به راحتی API شما را تست و بررسی کنند.
تکنولوژی‌ها و ابزارهای پیشنهادی
NestJS: به عنوان فریمورک اصلی
TypeORM یا Prisma: برای مدیریت ارتباط با پایگاه داده
JWT: برای احراز هویت
Swagger: برای مستندسازی API
PostgreSQL یا MongoDB: به عنوان پایگاه داده
مزایای این پروژه
این پروژه بسیاری از مفاهیم کلیدی مانند ماژولار بودن، استفاده از دکوریتورها، middleware، و guards در NestJS را پوشش می‌دهد.
برای کارهای پیشرفته‌تر می‌توانید از تکنیک‌هایی مثل Queue Management با Bull.js برای وظایف سنگین یا مدیریت بهتر استفاده کنید.

### Resources

## User

- id
- username
- email
- password
- role (ادمین، مدیر پروژه، کاربر عادی)
- createdAt
- updatedAt

## Project

- id
- name
- description
- status (فعال، غیرفعال، تکمیل‌شده)
- startDate
- endDate
- createdAt
- updatedAt
- ownerId (شناسه مدیر پروژه)

## Task

- id
- title
- description
- status (در صف، در حال انجام، انجام‌شده)
- priority (بالا، متوسط، پایین)
- dueDate
- createdAt
- updatedAt
- assignedTo (شناسه کاربری که تسک به او تخصیص یافته)
- projectId (شناسه پروژه مرتبط)

## ActivityLog

- id
- userId (شناسه کاربری که فعالیت را انجام داده)
- projectId (شناسه پروژه مربوطه)
- taskId (شناسه تسک مربوطه - در صورت وجود)
- action (نوع فعالیت مثل ایجاد، به‌روزرسانی، حذف)
- timestamp
