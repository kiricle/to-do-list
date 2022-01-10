/* eslint-disable no-console */
/* eslint-disable max-len */
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose.connect('mongodb+srv://admin-kirill:qweqwe33@cluster0.hwn3c.mongodb.net/todolistDB');

const itemsSchema = {
  name: String,
};

const listSchema = {
  name: String,
  items: [itemsSchema],
};

const List = mongoose.model('List', listSchema);

const Item = mongoose.model('Item', itemsSchema);

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/', (req, res) => {
  Item.find({}, (err, foundItems) => {
    res.render('list', { listTitle: 'Today', newListItems: foundItems });
  });
});

app.get('/:customListName', (req, res) => {
  let { customListName } = req.params;
  customListName = customListName.charAt(0).toUpperCase() + customListName.slice(1);

  List.findOne({ name: customListName }, (err, foundList) => {
    if (!err) {
      if (!foundList) {
        const list = new List({
          name: customListName,
          items: [],
        });
        list.save();
        res.render('list', { listTitle: customListName, newListItems: list.items });
      } else {
        res.render('list', { listTitle: customListName, newListItems: foundList.items });
      }
    }
  });
});

app.post('/', (req, res) => {
  const { newItem } = req.body;
  const { list } = req.body;
  const newListItem = new Item({
    name: newItem,
  });
  if (list === 'Today') {
    newListItem.save();
    res.redirect('/');
  } else {
    List.findOne({ name: list }, (err, foundList) => {
      foundList.items.push(newListItem);
      foundList.save();
      res.redirect(`/${list}`);
    });
  }
});

app.post('/delete', (req, res) => {
  const checkedItemId = req.body.checkbox;
  const { listName } = req.body;
  if (listName === 'Today') {
    Item.findByIdAndRemove(checkedItemId, (err) => {
      if (!err) {
        res.redirect('/');
      }
    });
  } else {
    List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedItemId } } }, (err) => {
      if (!err) {
        res.redirect(`/${listName}`);
      }
    });
  }
});

let { port } = process.env;
if (port === null || port === '') {
  port = 3000;
}
app.listen(port, () => {
  console.log('Server has started successfully');
});
