const express = require('express');
const mongoose = require('mongoose');
const app = express();

const PORT = 8080;
const API_ROUTE = '/api/checklists';

//Database
mongoose.connect('mongodb://127.0.0.1:27017/checklistdb', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to database"))
    .catch(err => console.log(err));

// Make Mongoose use `findOneAndUpdate()`.
mongoose.set('useFindAndModify', false);

//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Controllers
const checklistController = require('./controllers/checklistController');

//Routes
app.post(API_ROUTE, checklistController.create);
app.post(`${API_ROUTE}/:id/items`, checklistController.addItem);
app.put(`${API_ROUTE}/:id`, checklistController.update);
app.put(`${API_ROUTE}/:id/items/:itemId`, checklistController.updateItem);
app.get(`${API_ROUTE}/:id`, checklistController.retrieve);
app.delete(`${API_ROUTE}/:id`, checklistController.delete);
app.delete(`${API_ROUTE}/:id/items/:itemId`, checklistController.deleteItem);

//Start Server
app.listen(PORT, () => console.log(`Server started on ${PORT}`));