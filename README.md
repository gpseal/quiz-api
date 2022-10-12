# assessment-1-node-js-restful-api-gpseal


## Entity Relationship Diagram
![Quiz ERD](https://user-images.githubusercontent.com/83617997/195215055-d9146c9e-18f4-4c38-ad4b-cbbf0bfc2f7e.png)

## Heroku URL
https://id608001-sealgp1.herokuapp.com
<br><br>

## To run locally
Clone repository to local PC, 
open a terminal and proceed with the following:

- Install dependencies:
```javascript
$ npm install
```
- Create .env file: 
```
$ cp example.env .env
```
- Open .env file and complete with appropriate values
  - DATABASE_URL = [string to connect to prisma database]
  - SHADOW_DATABASE_URL = [string to connect to prisma shadow database]
  - JWT_SECRET = [string to set tocken password]
  - JWT_LIFETIME = [value to set token lifespan]
- Run app: 
```
$ npm start
```
## To seed data:
- To seed Super Admin users: 
```
npm run prisma:seed
```
<br>


## Postman Documentation

https://documenter.getpostman.com/view/19952142/2s83zmKMKY
<br><br>

## To deploy to Heroku
- Login to heroku.com
- select the **"new"** dropdown menu and choose **"Create new app"**
- Enter your chosen application name
- Select the **"Deploy"** tab, choose **GitHub** deployment
- Find and select the appropriate reprository to connect to
- New options will appear, enable **automatic deploys** and choose the appropriate branch to deploy from
- Under the **"settings"** tab, click **"Reveal Config Vars"**
- Enter DATABASE_URL (from .env) and the appropriate string to connect to mongodb
- Enter JWT_SECRET (from .env) and the appropriate string to set tocken password
- Enter JWT_LIFETIME (from .env) and the appropriate value to set token lifespan
- Copy the generated URL and use as required

**Alternatively, if the current version of Heroku is not compatible with auto deploy**
- Download and install Heroku CLI - https://devcenter.heroku.com/articles/heroku-cli#install-the-heroku-cli
- Connect to your project: $ heroku git:remote -a [name of your Heroku project]
- Deploy your current version: $ git push heroku main.
<br>

## Prisma
Open Prisma Studio
```
$ npm run prisma:open
```
Create a Migration
```
$ npm run prisma:migrate
```
## Lint code
check for problems
```
$ npm run lint:check
```
fix problems
```
$ npm run lint:fix
```

## Format code
check for problems
```
$ npm run prettier:check
```
fix problems
```
$ npm run prettier:fix
```

## Testing application
Run API / integration tests
```
$ npm run test-app
```
Run code coverage tests
```
$ ?????
```
