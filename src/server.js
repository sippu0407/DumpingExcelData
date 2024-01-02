const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const XLSX = require('xlsx');

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/dumpingData', { useNewUrlParser: true, useUnifiedTopology: true });

// Define a schema and model (replace 'YourSchema' and 'your_collection_name' accordingly)
const challanSchema = new mongoose.Schema({});
const Challan = mongoose.model('Challan',challanSchema);

// Set up Multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Define route to handle Excel upload and data insertion
app.post('/upload', upload.single('excelFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }

    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    await YourModel.insertMany(data);

    res.status(200).send('Data inserted successfully');
  } catch (error) {
    res.status(500).send('Error inserting data');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
