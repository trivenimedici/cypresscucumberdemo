const { MongoClient } = require('mongodb');
// or as an es module:
// import { MongoClient } from 'mongodb'

// Connection URL
const url = 'mongodb+srv://Url';
const client = new MongoClient(url);


async function findDetails(client, dbName, collectionName, query) {
  // Use connect method to connect to the server
  try {
    await client.connect();
    const val = await find(client, dbName, collectionName, query)
    return val
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}


async function listDatabases(client) {
  const databaseList = await client.db().admin().listDatabases();

  console.log("DataBases");
  databaseList.databases.forEach(db => {
    console.log(`- ${db.name}`)
  })
}

async function findOneRecord(client, nameOfTheListed) {
  const results = await client.db(dbName).collection(collectionName).findOne(
    { number: nameOfTheListed })
  if (results) {
    console.log(`found the data'${nameOfTheListed}'`);
    console.log(results)
  } else {
    console.log(`Not found`)
  }
}

async function find(client, dbName_, collectionName_, query_) {
  const cursor = await client.db(dbName_).collection(collectionName_).find(query_);
  const resultsFind = await cursor.toArray();
  console.log(resultsFind.length);
  return resultsFind;
}

module.exports = { findDetails } 