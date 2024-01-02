const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const XLSX = require('xlsx');

const app = express();
const port = 3000;

// Connect to MongoDB
async function connected(){
await mongoose.connect('mongodb://127.0.0.1:27017/your_database_name'); 

}

connected();

console.log("db connected");

const challanSchema = new mongoose.Schema({
  'Challan no': Number,
  'rg_dat': String,
  'kode': String,
  'anr': Number,
  'asd': String
});

console.log("Challan schema created");

const Challan = mongoose.model('Challan', challanSchema); // 'challans' is the collection name

// Set up Multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Handle Excel upload and data insertion
app.post('/upload', upload.single('excelFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }

    // Read and convert Excel data to JSON
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];

    console.log(sheetName);

    const worksheet = workbook.Sheets[sheetName];

    console.log(worksheet);

    const data = XLSX.utils.sheet_to_json(worksheet);

    console.log(data);

    // Insert data into MongoDB
    await Challan.insertMany(data);

    res.status(200).send('Data inserted successfully');
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send(`Error inserting data: ${error.message}`);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});

