import mongoose from "mongoose";

const reviewSchema = mongoose.Schema(
  {
    userName: {type: String, required: true},
    userImage: {type: String},
    rating: {type: Number, required: true},
    comment: {type: String, required: true},
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true,
    }
  },
  {
    timestamps: true,
  }
)

const MovieSchema = new mongoose.Schema(
  {
    userId:{type: mongoose.Schema.Types.ObjectId, ref:'User'},
    name:{type: String, required: true},
    desc:{type: String, required: true},
    tilteImage:{type: String},
    image: {type: String},
    category:{type: String, required: true},
    language:{type: String, required: true},
    year:{type: String, required: true},
    time: {type: Number, required: true},
    video:{type: String},
    rate:{type: Number, required: true, default: 0}, 
    numberOfReviews:{type: Number, required: true, default: 0},
    reviews:[reviewSchema],
    casts:[
      {
        name: {type: String, required: true}, 
        image: {type: String, required: true},
      }
    ]
  },
  { timestamps: true }
);
 
export default mongoose.model("Movie", MovieSchema);