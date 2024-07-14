import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: [true, "Please add an username"], unique: true },
    email: { type: String, required: [true, "Please add an email"], unique: true },
    password: { type: String, required: [true, "Please add a password"], minlenght:[6, "Password must be at least 6 characters"]},
    profilePicture: { type: String, default: "" },
    isAdmin: { type: Boolean, default: false },
    likedMovies:[{type: mongoose.Schema.Types.ObjectId, ref: "Movie"}, ],
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
