var assert = require('assert');
var nock = require('nock');
var chai = require('chai');
var expect = require('chai').expect;
var users = require('../src/users.js');
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

var mongodb = require('mongo-mock');
var mongoClient = mongodb.MongoClient;
var objectID = require('mongodb').ObjectID;
var sleep = require('sleep');

// Connection URL
var DB = users.DB;
var COLLECTION_USER = users.COLLECTION_USER;
var COLLECTION_SEARCHHISTORY = users.COLLECTION_SEARCHHISTORY;
var uri = 'mongodb://localhost/';

testDataUser = [
    {username: "cabxtest1",
     email:"email1"},
    {username: "cabxtest2",
     email:"email2"}
];

testDataSearch = [
    {userid: objectID('5bf99f06c8c5841bf3d008c6'),
    fromName: "From1",
    toName:"To1"},
    {userid: objectID('5bf99f06c8c5841bf3d008c6'),
    fromName: "From1",
    toName:"To1"},
    {userid: objectID('5bf99f06c8c5841bf3d008c6'),
    fromName: "From2",
    toName:"To2"},
]

exports.createDB = async function() {
  return new Promise(function(resolve, reject) {
      mongoClient.connect(uri, function(err, client) {
        var collection = client.db(DB).collection(COLLECTION_USER);
        collection.insertMany(testDataUser);
        var collection = client.db(DB).collection(COLLECTION_SEARCHHISTORY);
        collection.insertMany(testDataSearch);
        resolve('done');
      });
  });
};

exports.getDB = async function() {
  return new Promise(function(resolve, reject) {
      mongoClient.connect(uri, function(err, client) {
        if (err) {
          return (err);
        } else {
            results = client.db(DB).collection(COLLECTION_SEARCHHISTORY).find({});
            resolve(results);
        }
      });
  });
};

describe('users.js', function() {
  //Before starting the test, create a sandboxed database connection
  //Once a connection is established invoke done()
  before(async function() {
    res = await module.exports.createDB();
    await sleep.msleep(500);
  });

  it('findUserByEmail - success', async function() {
    await sleep.msleep(500);
    var res1 = {};
    res1['res'] = await users.findUserByEmail('email1', mongoClient, uri).then(
      function(response) {
        return (response.toArray());
      }
      ).catch((err) => {
        res1['error'] = err;
      });
      assert.equal(res1.res.length, 1);
      assert.equal(res1.res[0]['username'], 'cabxtest1');
  });

  it('findUserByEmail - no results', async function() {
    var res1 = {};
    res1['res'] = await users.findUserByEmail('abc', mongoClient, uri).then(
      function(response) {
        return (response.toArray());
      }
      ).catch((err) => {
        res1['error'] = err;
      });
      assert.equal(res1.res.length, 0);
  });

  it('findUserByName - success', async function() {
    var res1 = {};
    res1['res'] = await users.findUserByName('cabxtest2', mongoClient, uri).then(
      function(response) {
        return (response.toArray());
      }
      ).catch((err) => {
        res1['error'] = err;
      });
      assert.equal(res1.res.length, 1);
      assert.equal(res1.res[0]['email'], 'email2');
  });

  it('findUserByName - no results', async function() {
    var res1 = {};
    res1['res'] = await users.findUserByName('abc', mongoClient, uri).then(
      function(response) {
        return (response.toArray());
      }
      ).catch((err) => {
        res1['error'] = err;
      });
      assert.equal(res1.res.length, 0);
  });

  /* Missing distint in mongodb mock
  it('findToSearchHistoryByUserId - success', async function() {
    res = {};
    expectedResponse = [{toName:"To1"}, {toName:"To2"}];
    res['res'] = await users.findToSearchHistoryByUserId('5bf99f06c8c5841bf3d008c6', 1, mongoClient, uri).then(
      function(response) {
        return (response.toArray());
      }
      ).catch((err) => {
        res['error'] = err;
      });
      console.log(res);
      assert.equal(res.res.length, 2);
      assert.deepEqual(res.res, expectedResponse);
  });
  */

  it('doesEmailAlreadyExist - exists', async function() {
    var res1 = {};
    res1['res'] = await users.doesEmailAlreadyExist('email1', mongoClient, uri);
    assert.equal(res1.res, true);
  });

  it('doesEmailAlreadyExist - does not exists', async function() {
    var res1 = {};
    res1['res'] = await users.doesEmailAlreadyExist('abc', mongoClient, uri);
    assert.equal(res1.res, false);
  });

  it('doesUserAlreadyExist - exists', async function() {
    var res1 = {};
    res1['res'] = await users.doesUserAlreadyExist('cabxtest2', mongoClient, uri);
    assert.equal(res1.res, true);
  });

  it('doesUserAlreadyExist - does not exists', async function() {
    var res1 = {};
    res1['res'] = await users.doesUserAlreadyExist('abc', mongoClient, uri);
    assert.equal(res1.res, false);
  });

  it('getUserIdByName - success', async function() {
    var res1 = {};
    res1['res'] = await users.getUserIdByName('cabxtest1', mongoClient, uri);
    expect(res1.res.hasOwnProperty("userid")).to.equal(true);
  });

  it('getUserIdByName - no results', async function() {
    var res1 = {};
    res1['res'] = await users.getUserIdByName('abc', mongoClient, uri);
    expect(res1.res.hasOwnProperty("error")).to.equal(true);
  });

  it('insertUser - success', async function() {
    var res1 = {};
    res1['res'] = await users.insertUser('sUsername', 'sEmail', mongoClient, uri);
    res1['res1'] = await users.doesUserAlreadyExist('sUsername', mongoClient, uri);
    res1['res2'] = await users.doesEmailAlreadyExist('sEmail', mongoClient, uri);
    assert.equal(res1.res1, true);
    assert.equal(res1.res2, true);
  });

  /* Too slow
  it('insertSearchHistory - success', async function() {
    var res1 = {};
    res1['res'] = await users.insertSearchHistory('5bf99f06c8c5841bf3d008c6', 'abc', 'dfg', mongoClient, uri);
    await sleep.msleep(1500);
    res1['res2'] = await module.exports.getDB().then(
      function(response) {
        return (response.toArray());
      }).catch((err) => {
        res1['error'] = err;
      });
    var blFrom = false;
    var blTo = false;
    for (let i=0; i<res1['res2'].length; i++) {
      if (res1['res2'][i].fromName == 'abc') {
        blFrom = true;
      }
      if (res1['res2'][i].toName == 'dfg') {
        blTo = true;
      }
    }
    assert.equal(blFrom, true);
    assert.equal(blTo, true);
  });
  */

  it('createUser - success', async function() {
    var res1 = {};
    res1['res'] = await users.createUser('sUsername1', '', mongoClient, uri);
    expect(res1['res'].hasOwnProperty("userid")).to.equal(true);
  });

  it('createUser - empty username', async function() {
    var res1 = {};
    var expected = {error: 'Username is empty'};
    res1['res'] = await users.createUser('', 'sEmail2', mongoClient, uri);
    assert.deepEqual(res1.res, expected);
  });

  it('createUser - username exists', async function() {
    var res1 = {};
    var expected = {error: 'Username is already in use'};
    res1['res'] = await users.createUser('cabxtest1', 'sEmail2', mongoClient, uri);
    assert.deepEqual(res1.res, expected);
  });

  it('createUser - email exists', async function() {
    var res1 = {};
    var expected = {error: 'Email is already in use'};
    res1['res'] = await users.createUser('newuser12345', 'email1', mongoClient, uri);
    assert.deepEqual(res1.res, expected);
  });

  //After all tests are finished drop database and close connection
  after(function() {
    mongoClient.connect(uri, function(err, db) {
      client.drop_database(DB);
      });
  });
});
