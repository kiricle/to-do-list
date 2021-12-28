const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const items = [];
const workItems = [];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  const today = new Date();

  const options = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  };

  const currentDay = today.toLocaleDateString('en-US', options);

  res.render('list', { listTitle: currentDay, newListItems: items });
});

app.get('/work', (req, res) => {
  res.render('list', { listTitle: 'Work', newListItems: workItems });
});

app.post('/work', (req, res) => {
  const { newItem } = req.body;
  workItems.push(newItem);
  res.redirect('/work');
});

app.post('/', (req, res) => {
  const { newItem } = req.body;

  if (req.body.list === 'Work') {
    workItems.push(newItem);
    res.redirect('/work');
  } else {
    items.push(newItem);
    res.redirect('/');
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
