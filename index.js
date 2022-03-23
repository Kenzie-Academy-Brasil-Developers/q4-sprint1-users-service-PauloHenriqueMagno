import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import * as yup from 'yup';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

const PORT = 3000;

const app = express();

app.use(express.json());

dotenv.config();

const DATABASE = {
  users: []
};

const jwtConfig = {
  secret: process.env.JWT_SECRET,
  expiresIn: "1h"
};

const showUserWithOutPassword = (userData) => {
  const user = {
    uuid: userData.uuid,
    username: userData.username,
    email: userData.email,
    age: userData.age,
    createdOn: userData.createdOn
  };

  return user;
};

// SCHEMAS //

const createUserSchema = yup.object().shape({
  username: yup.string().required(),
  age: yup.number().positive().integer().required(),
  email: yup.string().email().required(),
  password: yup.string().required(),
});

const updateUserSchema = yup.object().shape({
  username: yup.string(),
  age: yup.number().positive().integer(),
  email: yup.string().email(),
  password: yup.string()
});

// SCHEMAS //



// MIDDLEWARES //

const hashePassword = async (req, _, next) => {
  const { password } = req.body;

  req.body.password = password? await bcrypt.hash(password, 10) : password;

  return next();
};

const validate = (schema) => async (req, res, next) => {
  const data = req.body;

  try {
    await schema.validate(data);

    return next()

  } catch (err) {
    return res.status(400).json({ msg: err.errors.join(", ") });

  };
};

const checkEmail = (req, res, next) => {
  const { email } = req.body;

  const isInUse = DATABASE.users.some( randomUser => randomUser.email === email);

  if (isInUse){
    return res.status(409).json({ msg: "email has already been taken" });
  };

  return next();
};

const checkUsername = (req, res, next) => {
  const { username } = req.body;

  const isInUse = DATABASE.users.some( randomUser => randomUser.username === username);

  if (isInUse){
    return res.status(409).json({ msg: "username has already been taken" });
  };

  return next();
};

const login = async (req, res, next) => {
  const { username, password } = req.body;

  const user = await DATABASE.users.find( randomUser => randomUser.username === username );

  try {
    const matchPassword = await bcrypt.compare(password, user.password);
  
    if (!matchPassword) {
      return res.status(401).json({ msg: 'username or password is incorrect' });
    };
    
    return next()

  } catch (e) {
    return res.status(401).json({ msg: 'username or password is incorrect' });
  };
}

const checkToken = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  jwt.verify(token, jwtConfig.secret, (err, decoded) => {
    if (err) {
      return res.status(403).json(
        { message: "Invalid Token" }
      );
    }

    const user = DATABASE.users.find(({ username }) => username === decoded.username);

    res.user = user;

    return user;
  });

  return next();
};

// MIDDLEWARES //

// ROUTES //

app.get('/users', (_, res) => res.status(200).json(DATABASE.users));

app.delete('/users/:uuid', checkToken, async (req, res) => {
  const { uuid } = req.params;

  const user = await DATABASE.users.find( randomUser => randomUser.uuid === uuid);

  if (!user){
    return res.status(404).json({ msg: "user not found" });
  };

  DATABASE.users.pop(user);

  return res.status(204).json();
});

app.post('/signup', validate(createUserSchema), hashePassword, checkEmail, checkUsername, (req, res) => {
  const { body } = req;

  const newUser = {
    uuid: uuidv4(),
    createdOn: new Date(),
    username: body.username,
    email: body.email,
    age: body.age,
    password: body.password
  }

  DATABASE.users.push(newUser);

  return res.status(201).json(showUserWithOutPassword(newUser));
});

app.post('/login', login, async (req, res) => {
  const { body } = req;

  const token = jwt.sign(
    {
      username: body.username,
      password: body.password
    },
    jwtConfig.secret,
    { expiresIn: jwtConfig.expiresIn }
  );

  return res.status(200).json({ "token": token });
});

app.put('/users/:uuid/password', checkToken, hashePassword, validate(updateUserSchema), (req, res) => {
  const { password } = req.body;
  const { uuid } = req.params

  if (!password){
    return res.status(400).json({ msg: "password is missing" });
  };

  const userIndex = DATABASE.users.findIndex( randomUser => randomUser.uuid === uuid );

  DATABASE.users[userIndex].password = password;

  return res.status(200).json();
})

// ROUTES //


app.listen(PORT, () => {
  console.log(`App is runnining on port ${PORT}`);
})