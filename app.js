// Project 1 Cluster 1

const { MongoClient } = require('mongodb');

async function main() {
	const uri = "mongodb+srv://Cameron:password1001@cluster1.fhszb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

	const client = new MongoClient(uri);

	try {
		await client.connect();
		
		await findListingWithMinimumBedroomsBathroomsAndMostRecentReviews(client, {
			minimumNumberOfBedrooms: 4,
			minimumNumberOfBathrooms: 2,
			maximumNumberOfResults: 5
		});
	}catch(err) {
		console.error(err);
	} finally {
		await client.close();
	}
}

main().catch(console.error);

async function findListingWithMinimumBedroomsBathroomsAndMostRecentReviews(client, {
	minimumNumberOfBedrooms = 0,
	minimumNumberOfBathrooms = 0,
	maximumNumberOfResults = Number.MAX_SAFE_INTEGER
} = {}) {

	const curser = client.db("sample_airbnb").collection("listingsAndReviews").find({
		bedrooms: { $gte: minimumNumberOfBedrooms },
		bathrooms: { $gte: minimumNumberOfBathrooms }
	}).sort({ last_review: -1 })
		.limit(maximumNumberOfResults);

	const results = await curser.toArray();

	if (results.length > 0) {
		console.log(`Found listing(s) with at least ${minimumNumberOfBedrooms} bedrooms, ${minimumNumberOfBathrooms} bathrooms and most recent review`);
		results.forEach((result, i) => {
			date = new Date(result.last_review).toDateString();
			console.log();
			console.log(`${i + 1}. name: ${result.name}`);
			console.log(`    id: ${result._id}`);
			console.log(`    bedrooms: ${result.bedrooms}`);
			console.log(`    bathrooms: ${result.bathrooms}`);
			console.log(`    most recent review date: ${new Date(result.last_review).toDateString()}`);
		});
	} else {
		console.log(`No listings found with at least ${minimumNumberOfBedrooms} bedrooms and ${minimumNumberOfBathrooms} bathrooms`);
	}
}

async function findOneListingsByName(client, nameOfListing) {
	const result = await client.db("sample_airbnb").collection("listingsAndReviews").findOne({ name: nameOfListing });

	if(result){
		console.log(`Found a listing in the collection with the name '${nameOfListing}'`)
		console.log(result);
	}else{
		console.log(`No listings found with the name '${nameOfListing}'`)
	}
}

async function createMulitipleListings(client, newListings) {
	const result = await client.db("sample_airbnb").collection("listingsAndReviews").insertMany(newListings);

	console.log(`${result.insertedCount} new listings created with the following id(s):`);
	console.log(result.insertedIds);
}

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