const mongoose = require('mongoose')

const enquirySchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        phone: {type: String, require: true},
        message: {type: String, default: "I want to know more about this"},
        status: {
            type: String,
            enum: ['Pending',  'Completed'],
            default: 'Pending'
          },
          createdAt: {
            type: Date,
            default: Date.now
          }
    }
)
module.exports = mongoose.model('Enquiry', enquirySchema)