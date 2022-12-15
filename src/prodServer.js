const express = require("express");
const expressStaticGzip = require("express-static-gzip");
const path = require("path");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fs = require('fs');

const app = express();

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "dist")));
app.use(cookieParser());

const configuration = {
  dev: {
    port: 3502,
    path: '/dev-ciq'
  },
  staging: {
    port: 3503,
    path: '/ciq'
  },
  prodStg: {
    port: 3503,
    path: '/'
  },
  prodDev: {
    port: 3508,
    path: '/'
  }
}

const build = configuration['prodDev'];
// const port = 3501; // DEV

// logging helper
const log = msg => (req, res, next) => {
  // // // console.log(`msg=(${msg}) url=(${req.url}) originalUrl=(${req.originalUrl})`);
  next();
};

// serve static files
app.use(build.path, expressStaticGzip('dist'));

var file_path = 'dist/ngsw-worker.js';
var byPassRequest = "if (event.request.url.indexOf('payu') !== -1 || event.request.url.indexOf('game/play/check') !== -1) { return; }";

// fs.readFile(file_path, function (err1, data) {
//   if (err1) console.log('Read file error : ', err1);
//   const position = data.indexOf("const req = event.request;");
//   var file_content = data.toString();
//   file_content = file_content.substring(position);
//   var file = fs.openSync(file_path, 'r+');
//   var bufferedText = new Buffer(byPassRequest + file_content);
//   fs.writeSync(file, bufferedText, 0, bufferedText.length, position, function (err2) {
//     if (err2) console.log('Read file error : ', err2);
//   });
// });

// serve index.html
app.get("/*", log("serve index.html"), function (req, res) {
  res.header('Access-Control-Max-Age', 0);
  res.header('Cache-Control', 'public, max-age=0');
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.post('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// start http server
app.listen(build.port, function (err) {
  if (err) {
    // // // console.log(err);
  } else {
    console.log(`listening on port ${build.port}`);
    console.log('http://localhost:3508');
  }
});
