import mongoose from 'mongoose'

const categoriesSchema = new mongoose.Schema({
    title:{type: String, required: true}
}, { timestamps: true })

export default mongoose.model('Categories', categoriesSchema)
