const express = require('express');
const { resolve } = require('path');
const dotenv = require('dotenv');
const connectDatabase = require('./database');
const bodyParser = require('body-parser');
const menu = require('./schema');
const mongoose = require('mongoose');
dotenv.config();

connectDatabase();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('static'));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.get('/menu', async (req, res) => {
  const menuItems = await menu.find({});
  res.json(menuItems);
});

app.post('/menu', async (req, res) => {
  try {
    const {name,price,description}=req.body;
    if(!name || !price || !description){
      res.status(400).json({"error":"Please provide all the details"});
    }
    const newMenuItem=new menu({name,price,description});
    await newMenuItem.save();
    res.status(201).json({"message":"Item added successfully"});
    
  } catch (error) {
    res.status(500).json({ "error": "Internal Server Error" });
  }
})

app.put("/menu/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedItem = await menu.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedItem) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    res.status(200).json({ message: "Menu item updated successfully", updatedItem });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.delete('/menu/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMenuItem = await menu.findByIdAndDelete(id);
    if (!deletedMenuItem) {
      return res.status(404).json({ "error": "Item not found" });
    }
    res.status(200).json("Item deleted successfully");
    
  } catch (error) {
    res.status(500).json({ "error": "Internal Server Error" });
  }
})
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
