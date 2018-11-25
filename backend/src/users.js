var objectID = require('mongodb').ObjectID;

var DB = 'cabx';
var COLLECTION_USER = 'users';
var COLLECTION_SEARCHHISTORY = 'searchhistories';


exports.DB = DB;
exports.COLLECTION_USER = COLLECTION_USER;
exports.COLLECTION_SEARCHHISTORY = COLLECTION_SEARCHHISTORY;

exports.createUser = async function(sUsername, sEmail, mongoClient, uri) {
  res = {};
  if (sUsername=='') {
    return ({error: 'Username is empty'});
  }
  userExists = await module.exports.doesUserAlreadyExist(
      sUsername, mongoClient, uri);
  if (userExists.hasOwnProperty('error')) {
    return (userExists);
  }
  if (userExists) {
    return ({error: 'Username is already in use'});
  }
  if (sEmail!='') {
    eMailExsts = await module.exports.doesEmailAlreadyExist(
        sEmail, mongoClient, uri);
    if (eMailExsts.hasOwnProperty('error')) {
      return (eMailExsts);
    }
    if (eMailExsts) {
      return ({error: 'Email is already in use'});
    }
  }
  responseInsert = await module.exports.insertUser(
      sUsername, sEmail, mongoClient, uri).then(
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

exports.insertSearchHistory = function(
userid, fromName, toName, mongoClient, uri) {
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

exports.insertUser = async function(sUsername, sEmail, mongoClient, uri) {
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

exports.doesUserAlreadyExist = async function(sUsername, mongoClient, uri) {
  res = {};
  res['res'] = await module.exports.findUserByName(
    sUsername, mongoClient, uri).then(
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

exports.getUserIdByName = async function(sUsername, mongoClient, uri) {
  res = {};
  res['res'] = await module.exports.findUserByName(
    sUsername, mongoClient, uri).then(
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
  if (res['res'].length == 0) {
    return ({error: 'No user found'});
  }
  res['userid'] = res['res'][0]['_id'];
  return ({userid: res['userid']});
};

exports.doesEmailAlreadyExist = async function(sEmail, mongoClient, uri) {
  res = {};
  res['res'] = await module.exports.findUserByEmail(
      sEmail, mongoClient, uri).then(
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

exports.getFromSearchHistoryByUserId = async function(
  userid, maxResults, mongoClient, uri) {
    res = {};
    if (!objectID.isValid(userid)) {
      res['error'] = 'UserId is not a valid ObjectID';
      return (res);
    }
    res['res'] = await module.exports.findFromSearchHistoryByUserId(
        userid, maxResults, mongoClient, uri).then(
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

exports.findFromSearchHistoryByUserId = function(
  userid, maxResults, mongoClient, uri) {
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

exports.getToSearchHistoryByUserId = async function(
  userid, maxResults, mongoClient, uri) {
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

exports.findToSearchHistoryByUserId = function(
  userid, maxResults, mongoClient, uri) {
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

exports.findUserByName = function(sUsername, mongoClient, uri) {
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

exports.findUserByEmail = function(sEmail, mongoClient, uri) {
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
