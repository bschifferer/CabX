var mongoClient = require('mongodb').MongoClient;
var objectID = require('mongodb').ObjectID;

var DB = 'cabx';
var COLLECTION_USER = 'users';
var COLLECTION_SEARCHHISTORY = 'searchhistories';
var uri = 'mongodb+srv://cabxuser:<PW>@cluster0-ounxj.mongodb.net/';

exports.createUser = async function(sUsername, sEmail) {
  res = {};
  if (sUsername=='') {
    res['error'] = 'Username is empty';
    return (res);
  }
  userExists = await module.exports.doesUserAlreadyExist(sUsername);
  if (userExists.hasOwnProperty('error')) {
    return (userExists);
  }
  if (userExists) {
    res['error'] = 'Username is already in use';
    return (res);
  }
  if (sEmail!='') {
    eMailExsts = await module.exports.doesEmailAlreadyExist(sEmail);
    if (eMailExsts.hasOwnProperty('error')) {
      return (eMailExsts);
    }
    if (eMailExsts) {
      res['error'] = 'Email is already in use';
      return (res);
    }
  }
  responseInsert = await module.exports.insertUser(sUsername, sEmail).then(
      function(response) {
        return (response);
      }
  ).catch((err) => {
    res['error'] = err;
  });
  if (res.hasOwnProperty('error')) {
    res['error'] = 'An internal error occured';
    return (res);
  };
  userId = responseInsert['ops'][0]['_id'];
  return ({userid: userId});
};

exports.insertSearchHistory = function(userid, fromName, toName) {
  mongoClient.connect(uri, function(err, client) {
    if (err) {
      return (err);
    } else {
      if (objectID.isValid(userid)) {
        client.db(DB).collection(COLLECTION_SEARCHHISTORY).insertOne(
            {userid: objectID(userid), fromName: fromName, toName: toName}
        );
      };
    }
  });
};

exports.insertUser = async function(sUsername, sEmail) {
  return new Promise(function(resolve, reject) {
    mongoClient.connect(uri, function(err, client) {
      if (err) {
        reject(err);
      } else {
        res = client.db(DB).collection(COLLECTION_USER).insertOne(
            {username: sUsername, email: sEmail}
        ).then(
            function(docsInserted) {
              return (docsInserted);
            }
        );
        resolve(res);
      }
    });
  });
};

exports.doesUserAlreadyExist = async function(sUsername) {
  res = {};
  res['res'] = await module.exports.findUserByName(sUsername).then(
      function(response) {
        return (response.toArray());
      }
  ).catch((err) => {
    res['error'] = err;
  });
  if (res.hasOwnProperty('error')) {
    res['error'] = 'An internal error occured';
    return (res);
  }
  if (res.res.length == 0) {
    return (false);
  } else {
    return (true);
  }
};

exports.getUserIdByName = async function(sUsername) {
  res = {};
  res['res'] = await module.exports.findUserByName(sUsername).then(
      function(res) {
        return (res.toArray());
      }
  ).catch((err) => {
    res['error'] = err;
  });
  if (res.hasOwnProperty('error')) {
    res['error'] = 'An internal error occured';
    return (res);
  }
  res['userid'] = res['res'][0]['_id'];
  return ({userid: res['userid']});
};

exports.doesEmailAlreadyExist = async function(sEmail) {
  res = {};
  res['res'] = await module.exports.findUserByEmail(sEmail).then(
      function(response) {
        return (response.toArray());
      }
  ).catch((err) => {
    res['error'] = err;
  });
  if (res.hasOwnProperty('error')) {
    res['error'] = 'An internal error occured';
    return (res);
  }
  if (res.res.length == 0) {
    return (false);
  } else {
    return (true);
  }
};

exports.getFromSearchHistoryByUserId = async function(userid, maxResults) {
  res = {};
  if (!objectID.isValid(userid)) {
    res['error'] = 'UserId is not a valid ObjectID';
    return (res);
  }
  res['res'] = await module.exports.findFromSearchHistoryByUserId(
      userid, maxResults).then(
      function(response) {
        return (response);
      }
  ).catch((err) => {
    res['error'] = err;
  });
  if (res.hasOwnProperty('error')) {
    res['error'] = 'An internal error occured';
    return (res);
  }
  return (res.res);
};

exports.findFromSearchHistoryByUserId = function(userid, maxResults) {
  return new Promise(function(resolve, reject) {
    mongoClient.connect(uri, function(err, client) {
      if (err) {
        reject(err);
      } else {
        resolve(client.db(DB).collection(COLLECTION_SEARCHHISTORY).distinct(
            'fromName', {userid: objectID(userid)}));
      }
    });
  });
};

exports.getToSearchHistoryByUserId = async function(userid, maxResults) {
  res = {};
  if (!objectID.isValid(userid)) {
    res['error'] = 'UserId is not a valid ObjectID';
    return (res);
  }
  res['res'] = await module.exports.findToSearchHistoryByUserId(
      userid, maxResults).then(function(response) {
    return (response);
  }
  ).catch((err) => {
    res['error'] = err;
  });
  if (res.hasOwnProperty('error')) {
    res['error'] = 'An internal error occured';
    return (res);
  };
  return (res.res);
};

exports.findToSearchHistoryByUserId = function(userid, maxResults) {
  return new Promise(function(resolve, reject) {
    mongoClient.connect(uri, function(err, client) {
      if (err) {
        reject(err);
      } else {
        resolve(client.db(DB).collection(COLLECTION_SEARCHHISTORY).distinct(
            'toName', {userid: objectID(userid)}));
      }
    });
  });
};

exports.findUserByName = function(sUsername) {
  return new Promise(function(resolve, reject) {
    mongoClient.connect(uri, function(err, client) {
      if (err) {
        reject(err);
      } else {
        resolve(client.db(DB).collection(COLLECTION_USER).find(
            {username: sUsername}));
      }
    });
  });
};

exports.findUserByEmail = function(sEmail) {
  return new Promise(function(resolve, reject) {
    mongoClient.connect(uri, function(err, client) {
      if (err) {
        reject(err);
      } else {
        resolve(client.db(DB).collection(COLLECTION_USER).find(
            {email: sEmail})
        );
      }
    });
  });
};
