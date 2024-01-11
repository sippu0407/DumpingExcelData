// Connect to MongoDB
const mongoose = require('mongoose');
async function connected(){
    await mongoose.connect('mongodb+srv://infosarthaktech:bsrM4Shla9cnnFmr@cluster0.mkoefd2.mongodb.net/carpet'); 

}

connected();

console.log("db connected");


// Define the schema for the Bill model
const NewSaleBillSchema = new mongoose.Schema({
  billNo: {
    type: String,
    required: true,
    unique: true // Assuming bill numbers are unique
  },
  billDate: {
    type: Date,
    required: true
  },
  customer: {
    type: String,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    required: true
  },
  gstAmount: {
    type: Number,
    required: true
  },
  profit: {
    type: Number,
    required: true
  },
  grossTotal: {
    type: Number,
    required: true
  },
  challanList: [{
    type: String,
    ref: 'Challan' // Assuming you'll have a Challan model with a schema that contains challanNo
  }]
});

// Create and export the Bill model
const NewSaleBill = mongoose.model('NewSaleBill', NewSaleBillSchema);

module.exports=NewSaleBill;