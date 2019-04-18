const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');

const schema = require('./gql-schema');
const { getConfig, getRequestUser } = require('./helpers');

const config = getConfig();

async function start() {
  const connectionUri = config.dbUri;
  const additionalParameters = { useNewUrlParser: true };
  await mongoose.connect(connectionUri, additionalParameters);

  // const testUser = new DAL.User({
  //     email: 'testuser@email.com',
  //     password: 'password2'
  //   });
  // await testUser.save();
  // console.log(testUser);

  // const user = await User.findOne({ _id: "5c9fb20d9fe2d48608cb1150" });
  // console.log(user);
  // user.password = "newone5";
  // user.save();

  // https://github.com/apollographql/apollo-server/issues/1633
  // Getting mongoose ObjectIds to work with apollo is a pain...
  const { ObjectId } = mongoose.Types;
  ObjectId.prototype.valueOf = function valueOf() {
    return this.toString();
  };

  const server = new ApolloServer({
    schema,
    context: getRequestUser(),
    tracing: true,
  });
  const port = config.apiPort;

  return { server, port };
}

module.exports = { start };
