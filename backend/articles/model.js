const mongoose = require('mongoose');
const version = require('mongoose-version');

const articleSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'] },
  description: String,
  content: String,
  tags: [String],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {
  timestamps: true,
});

articleSchema.plugin(version, { collection: 'articles_v' });

const Model = mongoose.model('Article', articleSchema);

module.exports = { Model };
