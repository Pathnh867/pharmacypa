const TypeSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
  });
  
  module.exports = mongoose.model('Type', TypeSchema);
  