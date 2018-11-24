var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;

var uri = "mongodb+srv://cabxuser:B0M9wK83NbqUdokJ@cluster0-ounxj.mongodb.net/";

exports.createUser = async function(sUsername, sEmail) {
  if (sUsername=='') {
    return('error empty')
  }

  userExists = await module.exports.doesUserAlreadyExist(sUsername);
  if (userExists) {
    return('error user');
  }
  if (sEmail=='') {
    eMailExsts = await module.exports.doesEmailAlreadyExist(sEmail);
    if (eMailExsts) {
      return('error email');
    }
  }
  responseInsert = await module.exports.insertUser(sUsername, sEmail).then(
    function(res) {
      return res;
    }
  );
  userId  = responseInsert['ops'][0]['_id']
  return(userId);
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
     a = client.db("cabx").collection("users").insertOne({username: sUsername, email: sEmail}).then(
    function(err, docsInserted) {
      return(err);
    }
    );
     resolve(a);
    });
  });
};

exports.doesUserAlreadyExist = async function(sUsername) {
  response = await module.exports.getUserByName(sUsername).then(
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

exports.doesEmailAlreadyExist = async function(sEmail) {
  response = await module.exports.getUserByEmail(sEmail).then(
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

exports.getUserByName = function(sUsername) {
  return new Promise(function(resolve, reject) {
    MongoClient.connect(uri, function(err, client) {
     resolve(client.db("cabx").collection("users").find({username: sUsername}));
    });
  });
};

exports.getUserByEmail = function(sEmail) {
  return new Promise(function(resolve, reject) {
    MongoClient.connect(uri, function(err, client) {
     resolve(client.db("cabx").collection("users").find({email: sEmail}));
    });
  });
};

exports.test_createUser = async function(s1, s2) {
  response = await module.exports.createUser(s1, s2);
  console.log(response);

}

//module.exports.test_createUser('benny12345689ab', 'benny');

