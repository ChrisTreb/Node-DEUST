const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
const dateFormat = require('dateformat');
const bodyParser = require('body-parser');
const fs = require('fs');

app.use(bodyParser.urlencoded({ extended: true }));

// Read file lifeforms.json in data directory
let retreivedData = fs.readFileSync('data/lifeforms.json');
let aliensNewList = JSON.parse(retreivedData);

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

app.get('/', (req, res) => {
  res.render('index', {aliensArr: aliensNewList}); // Mettre les variable dans la vue
});

// Get individual page with ID
app.get('/alien/:id', function(req, res) {
  let alien = aliensNewList[req.params.id];
  res.render('alien', { alien }); // Render edit view for edition
});

// Create Form view 
app.get('/create', (req, res) => {
  res.render('create');
});

// Handle Form
app.post('/create', function(req, res) {
  let postDate = dateFormat(new Date(), "dd/mm/yyyy, HH:MM:ss");
  let newAlien = {
    id: 0,
    name: req.body.name,
    image: req.body.image,
    description: req.body.description,
    behaviour: req.body.behaviour,
    date: postDate
  }

  newAlien.id = aliensNewList.length + 1; // Defining alien ID starting at 1

  // Check if ID already exists in array and add 1 if exist
  aliensNewList.forEach(element => {
    if(element.id == newAlien.id)
    newAlien.id ++; 
  });
  
  aliensNewList.push(newAlien); // Add new alien to array

  // Write files in lifeforms.json
  fs.writeFile('data/lifeforms.json', JSON.stringify(aliensNewList, null, 4), function (err) {
      if (err) throw err;
      console.log('Saved!');
  });
  res.redirect('/'); // Redirect to home page
});

// Delete item
app.get('/delete/:id' , function(req, res) {
  aliensNewList.splice(req.params.id, 1);

  // Write files in lifeforms.json
  fs.writeFile('data/lifeforms.json', JSON.stringify(aliensNewList, null, 4), function (err) {
    if (err) throw err;
    console.log('Saved!');
  });
  res.redirect('/'); // Redirect to home page
});

// Edit item
app.get('/edit/:id', function(req, res) {
  let alien = aliensNewList[req.params.id];
  res.render('edit', { alien }); // Render edit view for edition
});

// Handle edition form
app.post('/edit/:id', function(req, res) {

  let editionDate = dateFormat(new Date(), "dd/mm/yyyy, HH:MM:ss");
  let updatedAlien = {
    id: parseInt(req.params.id),
    name: req.body.name,
    image: req.body.image,
    description: req.body.description,
    behaviour: req.body.behaviour,
    updateDate: editionDate
  }

  for(i=0;i<aliensNewList.length;i++) {
    if(aliensNewList[i].id == updatedAlien.id){
      console.log(aliensNewList[i].id);
      console.log(updatedAlien.id);
      // Replace the old data with updated
      aliensNewList.splice(i, 1, updatedAlien);
    }
  }

   // Write files in lifeforms.json
   fs.writeFile('data/lifeforms.json', JSON.stringify(aliensNewList, null, 4), function (err) {
    if (err) throw err;
    console.log('Saved!');
  });
  res.redirect('/'); // Redirect to home page
});

app.listen(process.env.PORT || 3000, () => {
  console.log('App is running → PORT 3000');
});