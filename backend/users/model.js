const mongoose = require('mongoose');
const version = require('mongoose-version');

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, required: [true, 'Email is required'] },
    // a password is required if the user is not required to reset the password on the next login
    password: {
      type: String,
      required: [() => !this.requirePasswordReset, 'Password is required'],
    },
    active: Boolean,
    requirePasswordReset: Boolean,
    roles: [String],
  },
  {
    timestamps: true,
  },
);

/**
 * Article.createdBy joins to User._id
 *
 * Returns an array of articles create by this user
 */
userSchema.virtual('articles', {
  ref: 'Article',
  localField: '_id',
  foreignField: 'createdBy',
  justOne: false,
  options: { sort: { lastUpdateBy: -1 } },
});

userSchema.plugin(version, { collection: 'users_v' });

const Model = mongoose.model('User', userSchema);

module.exports = { Model };
