const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const items = [];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  const today = new Date();

  const options = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  };

  const currentDay = today.toLocaleDateString('en-US', options);

  res.render('list', { kindOfDay: currentDay, newListItems: items });
});

app.post('/', (req, res) => {
  const { newItem } = req.body;

  items.push(newItem);

  res.redirect('/');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
