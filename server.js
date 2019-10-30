const express = require('express'); // importing a CommonJS module
const helmet = require('helmet');
const morgan = require('morgan');

const hubsRouter = require('./hubs/hubs-router.js');

const server = express();

//three amigos
function dateLogger(req, res, next) {
  console.log(new Date().toISOString());
  next();
}

function logger(req, res, next) {
  console.log(
    `The Logger: [${new Date().toISOString()}] ${req.method} to ${req.url})}`
  );

  next();
}

function gateKeeper(req, res, next) {
  const password = req.headers.password || '';

  if (!req.headers.password) {
    res.status(400).json({message: "Please provide a password"})
  } else {
    if (password.toLowerCase() === 'mellon') {
      next();
    } else {
      res.status(400).json({you: "You shall not pass!"})
    }
  }

}

//global middleware

server.use(helmet());
server.use(express.json());
//server.use(dateLogger)
server.use(gateKeeper);
server.use(logger)
server.use(morgan('dev'))

server.use('/api/hubs', hubsRouter);

server.get('/', (req, res) => {
  const nameInsert = (req.name) ? ` ${req.name}` : '';

  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome${nameInsert} to the Lambda Hubs API</p>
    `);
});

module.exports = server;
