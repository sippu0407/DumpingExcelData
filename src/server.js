const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const XLSX = require('xlsx');
const app = express();
const port = 3000;

// Connect to MongoDB
async function connected(){
    await mongoose.connect('mongodb+srv://infosarthaktech:bsrM4Shla9cnnFmr@cluster0.mkoefd2.mongodb.net/carpet'); 

}

connected();

console.log("db connected");

const ChallanSchema = new mongoose.Schema({
  
  challanNo: { type: Number, required: true, unique: true },
  challanDate:{type:Date,require},
  optCustomer:{type:String, require:true},
  carpetList:[
      {
          qualityDesign: { type: String, require: true },
          qualityCode: { type: String, require: true },
          colour: { type: String, require: true },
          colourCode: { type: String, require: true },
          size: { type: String, require: true },
          sizeCode: { type: String, require: true },
          area: { type: String, require: true },
          rate:{ type: String, require: true },
          evkPrice: { type: String, require: true },
          barCode: { type: String, require: true },
          returnStatus:{type:Boolean,default:false}
        },
  ]
});

console.log("Challan schema created");

const Challan = mongoose.model('Challan', ChallanSchema); 

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });




app.post('/upload', upload.single('excelFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }

    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json(worksheet);

  
    const groupedData = {};

    rawData.forEach((row) => {
      const { challanNo, challanDate, optCustomer, barCode, saleStatus } = row;

      if (!groupedData[challanNo]) {

        groupedData[challanNo] = {
          challanNo: parseInt(challanNo),
          challanDate: new Date(challanDate),
          optCustomer,
          carpetList: [],
        };
      }

      groupedData[challanNo].carpetList.push({
        qualityDesign: null,
        qualityCode: null,
        colour: null,
        colourCode: null,
        size: null,
        sizeCode: null,
        area: null,
        rate: null,
        evkPrice: null,
        barCode,
        returnStatus: saleStatus === 'negative', 
      });
    });

    const dataToInsert = Object.values(groupedData);


    await Challan.insertMany(dataToInsert);

    res.status(200).send(dataToInsert);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send(`Error inserting data: ${error.message}`);
  }
});


app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});

