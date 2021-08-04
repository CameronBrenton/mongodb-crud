// Project 1 Cluster 1

const { MongoClient } = require('mongodb');

async function main() {
	const uri = "mongodb+srv://Cameron:password1001@cluster1.fhszb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

	const client = new MongoClient(uri);

	try {
		await client.connect();
		console.log('Successfully connected to mongo db!')
		
		await createListing(client, {
			name: "Lovely Loft",
			summary: "A charming loft in Paris",
			bedrooms: 1,
			bathrooms: 1
		})
	}catch(err) {
		console.error(err);
	} finally {
		await client.close();
	}
}

main().catch(console.error);

async function createListing(client, newListing) {
	const result = await client.db("sample_airbnb").collection("listingsAndReviews").insertOne(newListing);

	console.log(`New listing created with the following id: ${result.insertedId}`);
}

async function listDatabases(client) {
	const databasesList = await client.db().admin().listDatabases();

	console.log("Databases: ");
	databasesList.databases.forEach(db => {
		console.log(`- ${db.name}`)
	})
}