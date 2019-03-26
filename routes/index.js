const routes = require('express').Router();
const dateFormat = require('dateformat');
const fs = require('fs');

// Read file lifeforms.json in data directory
let retrievedData = fs.readFileSync('data/lifeforms.json');
let aliensNewList = JSON.parse(retrievedData);


routes.get('/', (req, res) => {
  res.render('index', {aliensArr: aliensNewList}); // render aliens list into view
});

// Get individual page with ID
routes.get('/alien/:id', function(req, res) {
  let alien = aliensNewList.find((a) => a.id === parseInt(req.params.id, 10));
  if ( alien < 0 || alien === undefined ) {
    return res.status(404).render('error');
  }
  res.render('alien', { alien });
});

// Create Form view 
routes.get('/create', (req, res) => {
  res.render('create');
});

// Handle Form
routes.post('/create', function(req, res) {
  let postDate = dateFormat(new Date(), "dd/mm/yyyy, HH:MM:ss");
  let newAlien = {
    id: 0,
    name: req.body.name,
    image: req.body.image,
    description: req.body.description,
    behaviour: req.body.behaviour,
    date: postDate
  }

  // Defining alien ID starting at 0
  newAlien.id = aliensNewList.length;

  // Check the last id in array and add 1
  let lastId = aliensNewList.reduce((biggest, a) => Math.max(biggest, a.id), 0) + 1;
  console.log(lastId);

  newAlien.id = lastId; 
  
  aliensNewList.push(newAlien); // Add new alien to array

  // Write files in lifeforms.json
  fs.writeFile('data/lifeforms.json', JSON.stringify(aliensNewList, null, 4), function (err) {
      if (err) throw err;
      console.log('Saved!');
  });
  res.redirect('/'); // Redirect to home page
});

// Delete item
routes.get('/delete/:id' , function(req, res) {
  let index = aliensNewList.find((a) => a.id === parseInt(req.params.id, 10));
  if ( index < 0 || index === undefined ) {
    return res.status(404).render('error');
  }
  aliensNewList.splice(index, 1);

  // Write files in lifeforms.json
  fs.writeFile('data/lifeforms.json', JSON.stringify(aliensNewList, null, 4), function (err) {
    if (err) throw err;
    console.log('Saved!');
  });
  res.redirect('/'); // Redirect to home page
});

// Edit item
routes.get('/edit/:id', function(req, res) {
  let alien = aliensNewList.find((a) => a.id === parseInt(req.params.id, 10)); // Loop into the array to find matching element
  if ( alien < 0 || alien === undefined ) {
    return res.status(404).render('error');
  }
  console.log(alien);
  res.render('edit', { alien }); // Render edit view for edition
});

// Handle edition form
routes.post('/edit/:id', function(req, res) {

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
    if(aliensNewList[i].id === updatedAlien.id){
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

module.exports = routes;
