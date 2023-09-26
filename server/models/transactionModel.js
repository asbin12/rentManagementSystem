const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    userid: {
      type: String,
      required: true,
    },
    tenantsName: {
      type: String,
      required: [true, "Amount is required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
    },
    type: {
      type: String,
      required: [true, "type is required"],
    },
    // type: {
    //   type: String,
    //   required: [true, "Type is required"],
    // },
    // category: {
    //   type: String,
    //   required: [true, "Category is required"],
    // },
    // reference: {
    //     type: String,
    // },
    roomTypes: {
      type: String,
      required: [true, "Category is required"],
    },
    advanceAmount: {
      type: Number,
    },
    dueAmount: {
      type: Number,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
  },
  { timestamps: true }
);

// const transactionModel = mongoose.model("transactions", transactionSchema);
const transactionModel = mongoose.model("rent-details", transactionSchema);

module.exports = transactionModel;
