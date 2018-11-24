var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;

var uri = "mongodb+srv://cabxuser:B0M9wK83NbqUdokJ@cluster0-ounxj.mongodb.net/";

MongoClient.connect(uri, function(err, client) {
   console.log(err);
   //console.log(client);
   //const db = client.db("cabx").collection("users").insert({ item: "card", qty: 15 });

   const collection = client.db("cabx").collection("searchhistories").insertOne({
    userid: ObjectID("5063114bd386d8fadbd6b004"),
    from: 'Columbia University1',
    to: 'Empire State Building1'
   });

   const result = client.db("cabx").collection("searchhistories").find({from: 'Columbia University1'})
   // perform actions on the collection object
   console.log(result.toArray());
   client.close();
});