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

### Run the unit test
```shell
npm run test
```

## How to Create a new CRUD resouce (Step by Step)

### Generate the code with the CLI
[Complete documentation](https://foalts.gitbook.io/docs/topic-guides/cli-and-development-environment/code-generation#create-rest-api)

```shell
# <nameOfTheResource> must be without 's' at the end.
foal g rest-api <nameOfTheResource>

# for example to generate a new resource to manage members
foal g rest-api member
```
The cli used above will generate two files, a controller and an entity and update both index.ts located in the controller and entities folder.

### Complete the newly generated entity
Entity are your models for the application. They are based on TypeORM which is a powerful ORM for JS. You can take a look at the documentation for entity [here](https://typeorm.io/#/entities)

### Complete the validation schema in your controller
[Ajv Validation Schema documentation](https://github.com/epoberezkin/ajv/blob/master/KEYWORDS.md)

### Modify the specs.ts for your controller to pass the test

## Use Group and Permission in the API
See the complete [official documentation](https://foalts.gitbook.io/docs/topic-guides/authentication-and-access-control/groups-and-permissions#the-hasperm-method)

below an simple example from the doc:
```typescript
import { Context, Get } from '@foal/core';
import { JWTRequired } from '@foal/jwt';
import { fetchUserWithPermissions } from '@foal/typeorm';

@JWTRequired({
  user: fetchUserWithPermissions(User)
})
export class ProductController {
  @Get('/products')
  readProduct(ctx: Context) {
    if (!ctx.user.hasPerm('read-products')) {
      return new HttpResponseForbidden();
    }
    return new HttpResponseOK([]);
  }
}
```

## Avaible Custom Script
⚠ If customs scripts are not working, maybe they are not build. To build the custom script, use the following command ` npm run build:scripts `

### Create User
```shell
foal run create-user email="test@test.ch" password="MyS3cur3Passw0rd" userPermissions='[ "my-first-perm" ]' groups='[ "my-group" ]'
```

### Create Permisssion
```shell
foal run create-perm name="Permission to access the secret" codeName="access-secret"
```
### Create Group
```shell
foal run create-group name="Administrators" codeName="admin" permissions='[ "delete-users" ]'
```

## Rights and Permissions

*The stucture below can possibly change in the future depending on the needs of our users.*

For each module, a right ``write`` and a right ``read`` is available. ``Write`` allow all the modifications and ``Read`` is only for retrieving data. The user is part of a group, and a group owns a list of rights.

### Table of permissions by group
| | Membership  | Accountant  | Management  | Admin  |
|---|:---:|:---:|:---:|:---:|
| member_read  | x  | x  |  x |  x |  
| member_write  | x  |   |   | x  |
| invoice_read  | x  | x  |  x |  x |
| invoice_write  |   | x  |   | x  |
| user_read  |  x |  x | x  | x  |
| user_write  |   |   | x  | x  |