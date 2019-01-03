const { ObjectId } = require("mongodb"); // maybe make this only available in data-acess??
const { normalize } = require("./helpers");

async function destroyDocument(collection, id) {
  const doc = await collection.findOne(id);

  await collection.deleteOne({ _id: id });

  return normalize(doc);
}

async function updateDocument(collection, _params, whiteList) {
  Object.freeze(_params);

  const params = Object.assign({}, _params);
  const docId = ObjectId(params._id);
  const updatedFields = {};

  Object.keys(params)
    .filter(param => whiteList.includes(param))
    .forEach(param => (updatedFields[param] = params[param]));

  // only update if they're something to update in the first place
  if (Object.keys(updatedFields).length) {
    await collection.updateOne({ _id: docId }, { $set: updatedFields });
  }

  return normalize(await collection.findOne(docId));
}

async function createDocument(collection, _params, whiteList) {
  Object.freeze(_params);

  const params = Object.assign({}, _params);
  const document = {};

  Object.keys(params)
    .filter(param => whiteList.includes(param))
    .forEach(param => (document[param] = params[param]));

  const res = await collection.insertOne(document);
  const newID = res.insertedId;

  return normalize(await collection.findOne(newID));
}

async function getOneById(collection, id) {
  return getOneByQuery(collection, { _id: ObjectId(id) });
}

async function getOneByQuery(collection, query) {
  return normalize(await collection.findOne(query));
}

async function getAll(collection, query) {
  return (await collection.find(query).toArray()).map(normalize);
}

module.exports = {
  getAll,
  getOneById,
  getOneByQuery,
  createDocument,
  updateDocument,
  destroyDocument
};
