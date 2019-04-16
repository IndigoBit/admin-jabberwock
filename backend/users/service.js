const { Model } = require('./model');

// limit/skip/sort?
async function getUserList() {
  return Model.find({});
}

async function getUser({ _id }) {
  return Model.findById(_id);
}

async function createUser({
  name, email, username, active,
}) {
  const user = new Model({
    name, email, username, active,
  });
  user.requirePasswordReset = true;

  return user.save();
}

async function updateUser({
  _id, name, email, username, active,
}) {
  const update = {
    name, email, username, active,
  };

  Object.keys(update).forEach((field) => {
    if (typeof update[field] === 'undefined') {
      delete update[field];
    }
  });

  return Model.findOneAndUpdate({ _id }, { $set: update });
}

async function destroyUser({ _id }) {
  return Model.findOneAndRemove({ _id });
}

async function enableUser({ _id }) {
  return Model.findOneAndUpdate({ _id }, { $set: { active: true } });
}

async function disableUser({ _id }) {
  return Model.findOneAndUpdate({ _id }, { $set: { active: false } });
}

async function resetUserPassword({ _id }) {
  return Model.findOneAndUpdate(
    { _id },
    { $set: { requirePasswordReset: true } },
  );
}

async function getUsersArticles() {
  throw new Error('Unimplemented Feature');
}

module.exports = {
  getUserList,
  getUser,
  createUser,
  updateUser,
  destroyUser,
  enableUser,
  disableUser,
  resetUserPassword,
  getUsersArticles,
};
