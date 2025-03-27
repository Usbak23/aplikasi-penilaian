const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const compression = require('compression');


const dashboardRouter = require("./app/dashboard/router");
const dpRouter = require("./app/dashboard_peserta/router");
const categoryRouter = require("./app/category/router");
const pesertaRouter = require("./app/peserta/router");
const materiRouter = require("./app/materi/router");
const usersRouter = require("./app/users/router");
const motRouter = require("./app/users/router");
const absensiRouter = require("./app/absensi/router");
const dataAbsensi = require ("./app/data_absensi/router");
const nilaiPsikomotorik = require("./app/nilai_psikomotorik/router");
const nilaiKognitif = require("./app/nilai_tugas/router");
const nilaiAfektifRouter = require("./app/nilai_afektif/router");
const pesertaMakalah = require("./app/makalah_peserta/router");

const app = express();

app.post("/mock-login", (req, res) => {
  req.session.user = { name: "Admin", role: "administrator" };
  res.status(200).send("Login successful");
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.locals.settings = { async: true };
app.use(express.static(path.join(__dirname, 'dist')));
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
app.use(compression());
app.use(flash());
app.use(methodOverride("_method"));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  "/sb-admin2",
  express.static(path.join(__dirname, "/node_modules/admin-lte/"))
);


app.use("/category", categoryRouter);
app.use("/peserta", pesertaRouter);
app.use("/materi", materiRouter);
app.use("/absensi", absensiRouter);
app.use("/", usersRouter);
app.use("/mot", motRouter);
app.use("/dashboard", dashboardRouter);
app.use("/dashboard-peserta", dpRouter);
app.use("/recap_absensi", dataAbsensi);
app.use("/nilai_psikomotorik", nilaiPsikomotorik);
app.use("/nilai-afektif", nilaiAfektifRouter);
app.use("/nilai_tugas", nilaiKognitif);
app.use("/makalah_peserta", pesertaMakalah);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
