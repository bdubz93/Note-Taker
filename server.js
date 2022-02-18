const fs = require('fs');
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const apiDB = path.join(__dirname, `db/db.json`);
let notes = [];

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get(`/notes`, (req, res) => res.sendFile(path.join(__dirname, `public/notes.html`)));
app.get(`/api/notes`, (req, res) => res.sendFile(apiDB));
app.get(`*`, (req, res) => res.sendFile(path.join(__dirname, `public/index.html`)));

app.post(`/api/notes`, (req, res) => {
    const newNote = req.body;
    newNote.id = uuidv4();
    notes.push(newNote);
    saveDB(notes);
    res.json(newNote.id);
})



function saveDB (notes) {
   let data = JSON.stringify(notes, null, 2);
   fs.writeFile(apiDB, data, (err) => err ? console.error(err) : console.log('Updated'));
}

const loadDB = (req, res) => {
    fs.readFile(apiDB, (err, data) => {
      if (err) {
        console.error(err);
      } else {
        notes = JSON.parse(data);
        console.log(notes);
      }
    });
};

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);

loadDB();