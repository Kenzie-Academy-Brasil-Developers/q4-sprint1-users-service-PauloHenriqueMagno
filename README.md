# <b> API - Users Service </b>

### <b> Tecnologias utilizadas </b>

<br />

#### <b> Framework: </b>

* express

#### <b> Libraries: </b>

* bcrypt
* dotenv
* eslint
* jsonwebtoken
* nodemon
* prettier
* uuid
* yup

<br />

#### <b> Endpoints: </b>

There are 5 endpoints: 1 to signup, 1 to login, 1 to delete, 1 to update password and 1 to show all users.

<br />

## <b> User </b>

<br />

### <b> Sign Up </b>

<br />

<b> POST /signup </b>

This route is used to register a new user, to register a new user must be given email, username, age and password.

<br />

Example:

Request:

```json
{
	"email": "paulo@gmail.com",
	"password": "1234",
	"age": 21,
	"username": "Paulo"
}
```

Response:

```json
{
  "uuid": "447e3aad-8047-4dc3-be57-17030df74989",
  "username": "Paulo",
  "email": "paulo@gmail.com",
  "age": 21,
  "createdOn": "2022-03-23T16:52:07.431Z"
}
```

<br />

### <b> Login </b>

<b> POST /login </b>

This route is used to create a token to access account. 

<br />

Example:

Request:

```json
{
  "username": "Paulo",
  "password": "1234"
}
```

Response:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlBhdWxvIiwicGFzc3dvcmQiOiIxMjM0NTYiLCJpYXQiOjE2NDgwNTM3NzgsImV4cCI6MTY0ODA1NzM3OH0.nDFVsT2qwZN7qKIxwROpSFJi00tZrItuMnXl1gUq0o0"
}
```

<br />

### <b> Show Users </b>

<b> GET /user </b>

This route will list all users' data.

<br />

Example:

```json
[
  {
    "uuid": "cc62c431-e11b-4fb6-b208-2725073bff0a",
    "createdOn": "2022-03-23T16:42:26.015Z",
    "username": "Paulo H",
    "email": "paulo@hotmail.com",
    "age": 21,
    "password": "$2b$10$4ps7ONQxK4IGMVUar9xrvOeb3euGZywVPqyj./wiZkwjPvmqudxNK"
  },
  {
    "uuid": "447e3aad-8047-4dc3-be57-17030df74989",
    "createdOn": "2022-03-23T16:52:07.431Z",
    "username": "Paulo",
    "email": "paulo@gmail.com",
    "age": 21,
    "password": "$2b$10$3.EAEswLRtcHdqaW1RqXtumzPR1BXbu0a/4MvF54FB./oTBmEx9tu"
  }
]
```

<br />

### <b> Update Password </b>

<b> PUT /user/:uuid/password </b>

This route will change password from the user with the uuid given. A header with token will be necessary to change the password.<br />
If successfully will return status 204.

<br />

Example:

Request:

```json
{
  "password": "123456"
}
```

Response:

Status: 204


### <b> Delete User </b>

<b> Delete /user/:uuid </b>

This route will delete the user with the uuid given. A header with token will be necessary to delete it.<br />
If successfully will return status 204.

Example:

Request:

No content.

Response:

Status: 204