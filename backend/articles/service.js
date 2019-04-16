const { Model } = require('./model');

// limit/skip/sort?
async function getArticleList() {
  return Model.find({});
}

async function getArticle({ _id }) {
  return Model.findById(_id);
}

async function createArticle({
  name, description, content, tags, creator,
}) {
  const user = new Model({
    name,
    description,
    content,
    tags,
    creator,
  });
  await user.save();

  return user;
}

async function updateArticle({
  _id, name, description, content, tags,
}) {
  const update = {
    name,
    description,
    content,
    tags,
  };

  Object.keys(update).forEach((field) => {
    if (typeof update[field] === 'undefined') {
      delete update[field];
    }
  });

  return Model.findOneAndUpdate({ _id }, { $set: update });
}

async function destroyArticle({ _id }) {
  return Model.findOneAndRemove({ _id });
}

module.exports = {
  getArticleList,
  getArticle,
  createArticle,
  updateArticle,
  destroyArticle,
};
