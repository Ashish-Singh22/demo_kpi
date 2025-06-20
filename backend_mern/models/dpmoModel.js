const mongoose = require('mongoose')

const dpmoSchema = mongoose.Schema({
    duration: {
    type: String,
    required: true,
  },
  claim_resp: {
    type: String,
    required: true,
  },
  claim_data: {
    type: Map,
    of: new mongoose.Schema({
      // Nested object structure like: { "MISPACK/WPIB": [2, 14, 46950.46] }
      type: Map,
      of: [Number]
    }),
    required: true,
  },
  t_claim: {
    type: Number,
    required: true,
  },
  t_quantity: {
    type: Number,
    required: true,
  },
  t_claim_value: {
    type: Number,
    required: true,
  },
  claim_status: {
    type: String,
    required: true,
  },

},{
    timestamps : true
})

const dpmoModel = mongoose.model("dpmo",dpmoSchema)

module.exports = dpmoModel