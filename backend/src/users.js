var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;

var uri = "mongodb+srv://cabxuser:<PW>@cluster0-ounxj.mongodb.net/";

exports.createUser = async function(sUsername, sEmail) {
  res = {};
  if (sUsername=='') {
    res['error'] = 'Username is empty';
    return(res)
  }
  userExists = await module.exports.doesUserAlreadyExist(sUsername);
  if (userExists) {
    res['error'] = 'Username is already in use';
    return(res)
  }
  if (sEmail!='') {
    eMailExsts = await module.exports.doesEmailAlreadyExist(sEmail);
    if (eMailExsts) {
      res['error'] = 'Email is already in use';
      return(res)
    }
  }
  responseInsert = await module.exports.insertUser(sUsername, sEmail).then(
    function(res) {
      return res;
    }
  );
  userId  = responseInsert['ops'][0]['_id']
  res['userid'] = userId
  return(res);
};

exports.insertSearchHistory = function(userid, fromName, toName) {
  MongoClient.connect(uri, function(err, client) {
    if (ObjectID.isValid(userid)) {
      client.db("cabx").collection("searchhistories").insertOne({userid: ObjectID(userid), fromName: fromName, toName: toName})
    }
  });
}

exports.insertUser = async function(sUsername, sEmail) {
  return new Promise(function(resolve, reject) {
    MongoClient.connect(uri, function(err, client) {
     res = client.db("cabx").collection("users").insertOne({username: sUsername, email: sEmail}).then(
    function(docsInserted) {
      return(docsInserted);
    }
    );
     resolve(res);
    });
  });
};

exports.doesUserAlreadyExist = async function(sUsername) {
  response = await module.exports.findUserByName(sUsername).then(
    function(res) {
      return res.toArray()
    }
  );
  if (response.length == 0) {
    return (false);
  } else {
    return (true);
  }
};

exports.getUserIdByName = async function(sUsername) {
  res = {};
  response = await module.exports.findUserByName(sUsername).then(
    function(res) {
      return res.toArray()
    }
  );
  res['userid'] = response[0]['_id'];
  return (res);
};

exports.doesEmailAlreadyExist = async function(sEmail) {
  response = await module.exports.findUserByEmail(sEmail).then(
    function(res) {
      return res.toArray()
    }
  );
  if (response.length == 0) {
    return (false);
  } else {
    return (true);
  }
};

exports.getFromSearchHistoryByUserId = async function(userid, maxResults) {
  response = {};
  if (!ObjectID.isValid(userid)) {
    response['error'] = 'UserId is not a valid ObjectID';
    return (response);
  } 
  response = await module.exports.findFromSearchHistoryByUserId(userid, maxResults).then(
    function(res) {
      return res
    }
  );
  return(response);
};

exports.findFromSearchHistoryByUserId = function(userid, maxResults) {
  return new Promise(function(resolve, reject) {
    MongoClient.connect(uri, function(err, client) {
     resolve(client.db("cabx").collection("searchhistories").distinct('fromName', {userid: ObjectID(userid)}));
    });
  });
};

exports.getToSearchHistoryByUserId = async function(userid, maxResults) {
  response = {};
  if (!ObjectID.isValid(userid)) {
    response['error'] = 'UserId is not a valid ObjectID';
    return (response);
  }
  response = await module.exports.findToSearchHistoryByUserId(userid, maxResults).then(
    function(res) {
      return res
    }
  );
  return(response);
};

exports.findToSearchHistoryByUserId = function(userid, maxResults) {
  return new Promise(function(resolve, reject) {
    MongoClient.connect(uri, function(err, client) {
     resolve(client.db("cabx").collection("searchhistories").distinct('toName', {userid: ObjectID(userid)}));
    });
  });
};

exports.findUserByName = function(sUsername) {
  return new Promise(function(resolve, reject) {
    MongoClient.connect(uri, function(err, client) {
     resolve(client.db("cabx").collection("users").find({username: sUsername}));
    });
  });
};

exports.findUserByEmail = function(sEmail) {
  return new Promise(function(resolve, reject) {
    MongoClient.connect(uri, function(err, client) {
     resolve(client.db("cabx").collection("users").find({email: sEmail}));
    });
  });
};
