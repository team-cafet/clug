# Beta-team-cafet / BACKEND
## Description

## Requirment
- A Postgres database

## Configuration
For all the configuration, duplicate "env.example and rename it as ".env". Then change the fields to your preferences.

## How to use
For the complete CLI documentation for FoalTS, take a look [here](https://foalts.gitbook.io/docs/topic-guides/cli-and-development-environment)

⚠ You need to do the following before being able to run the code:
- run the usual command to install the npm package (npm ci) 
- Have running and configurate postgres database 
- Have generated a secret for JSON Web Token Auth [See here](https://foalts.gitbook.io/docs/topic-guides/authentication-and-access-control/jwt#generate-and-provide-a-secret)

### Run in develop mode
```shell
npm run develop
```



## How to generate code
#### Generate a new CRUD Resource
[Complete documentation](https://foalts.gitbook.io/docs/topic-guides/cli-and-development-environment/code-generation#create-rest-api)

```shell
foal g rest-api <nameOfTheResource>
```

## Avaible Custom Script
### Create User
