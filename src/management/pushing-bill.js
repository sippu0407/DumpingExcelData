const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const XLSX = require('xlsx');
const app = express();
const port = 3000;

const NewSaleBill=require('./model');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


app.patch('/update-date', upload.single('excelFile'), async (req, res) => {
      try {
        if (!req.file) {
          return res.status(400).send('No file uploaded');
        }
  const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
 const worksheet = workbook.Sheets[sheetName];
 const excelData = XLSX.utils.sheet_to_json(worksheet);
   let i=1; 
excelData.forEach(async (row) => {
  
   const billNo = row['Bill No'];
   const dateValue = row['Bill Date']; // Assuming it's a number

// Convert Excel date number to JavaScript Date object
   const billDate = new Date((dateValue - (25567 + 1)) * 86400 * 1000); // Convert Excel number to JavaScript timestamp

  
   await NewSaleBill.updateOne({ billNo: billNo }, { $set: { billDate: billDate } });
    
    console.log(`Updated Bill No ${billNo} with new Bill Date: ${billDate} ${i++}`);
  });

  res.send("done");
}    catch (error) {
    console.error(`Error updating Bill No ${row['Bill No']}: ${error.message}`);
  }
});






// app.post('/upload-bill', upload.single('excelFile'), async (req, res) => {
//     try {
//       if (!req.file) {
//         return res.status(400).send('No file uploaded');
//       }
  
//       const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
//       const sheetName = workbook.SheetNames[0];
//       const worksheet = workbook.Sheets[sheetName];
//       const data = XLSX.utils.sheet_to_json(worksheet);
  
//       const bills = {};
  
//       data.forEach(row => {
//         const billNo = row['Bill No'];
//         const challanNo = row['Challan no'].toString(); // Convert to string
  
//         if (!bills[billNo]) {
//           bills[billNo] = {
//             billNo: billNo,
//             billDate: new Date(row['Bill Date']),
//             customer: row['Customer name'], // Fixed this to match your schema
//             challanList: [challanNo],
//             totalAmount: 0,
//             discount: 0,
//             gstAmount: 0,
//             profit: 0,
//             grossTotal: 0
//           };
//         } else {
//           if (!bills[billNo].challanList) {
//             bills[billNo].challanList = [];
//           }
//           bills[billNo].challanList.push(challanNo);
//         }
//       });
  
//       // Convert bills object to an array
//       const billsArray = Object.values(bills);
  
//       // Insert bills into MongoDB
//       await NewSaleBill.insertMany(billsArray);
  
//       res.status(200).send(billsArray);
//     } catch (error) {
//       console.error('Error:', error.message);
//       res.status(500).send(`Error inserting data: ${error.message}`);
//     }
//   });
  


    app.listen(port, () => {
        console.log(`Server started on http://localhost:${port}`);
      });

