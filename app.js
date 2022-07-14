var createError = require("http-errors");
var express = require("express");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const fetch = require('node-fetch');

var app = express();
app.disable("x-powered-by");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const router = express.Router();
app.use(process.env.URL_PREFIX, router);
app.get("/", (req, res) => {
  res.json({ app: "Msgraph Service" });
});

router.get("/me", async (req, res) => {
  try {
    const response = await fetch('https://graph.microsoft.com/v1.0/me', {
      headers: {
        Authorization: req.headers['authorization']
      }
    })
    const data = await response.json();
    if(Object.keys(data).includes('error')){
      return res.status(401).json(data);
    }
    res.json(data)
  } catch (e) {
    res.status(401).json({error: true})
  }
  
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// TODO: Create middleware for error response
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ success: false, message: err.message });
});

module.exports = app;