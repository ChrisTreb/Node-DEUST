const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const routes = require('./routes');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

// Register Handlebars view engine
app.engine('.hbs', exphbs(
  {
  defaultLayout: 'main',
  extname: '.hbs',
  layoutsDir: "views/layouts",
  })
);

// Use Handlebars view engine
app.set('view engine', '.hbs');

// Routing
app.use('/', routes);

// Page not found
app.use((req, res, next) => {
  res.status(404).render('error');
})

// Internal server error
app.use((err, req, res, next) => {
  res.status(500).send('Internal server error');
})

app.listen(process.env.PORT || 3000, () => {
  console.log('App is running → PORT 3000');
});
