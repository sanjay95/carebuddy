// Import the Appwrite SDK
const { Client, Databases } = require("node-appwrite");

// Initialize Appwrite client
const client = new Client();
client
    .setEndpoint('https://cloud.appwrite.io/v1') // Your Appwrite endpoint
    .setProject('675959ef000936e95cd5') // Your project ID
    .setKey('standard_0d13ac71b902adf6f11a3121e1770687dfdbb206b24ad1cb52d2635a462a3edefc8134dfd2f71448720ec3ee0c8b174e6991d510abb901da36d7234a31ac19535a310d7026ee7f42ccddadec00e4a8294c02b414e4f955243fadad2ebd32d8719f56bcf3124c68d62acffd443bc344a16da06161013db368d528536b9dd6aa64'); // Your API key


const databases = new Databases(client);

// Database and collection IDs
const DATABASE_ID = '67595ac1002b67474905';
const COLLECTION_ID = '67598b98003e362363a0';

// Attribute definitions for Appointment collection
const attributes = [
    { key: "appointmentId", type: "string", size: 256, required: true },
    { key: "patient", type: "string", size: 256, required: true },
    { key: "schedule", type: "datetime", required: true },
    { key: "status", type: "string", size: 50, required: true },
    { key: "primaryPhysician", type: "string", size: 256, required: true },
    { key: "reason", type: "string", size: 500, required: false },
    { key: "note", type: "string", size: 1000, required: false },
    { key: "userId", type: "string", size: 256, required: true },
    { key: "cancellationReason", type: "string", size: 500, required: false },
];

// Function to create or update attributes
async function updateAttributes() {
    try {
        // Retrieve existing attributes
        const collection = await databases.getCollection(DATABASE_ID, COLLECTION_ID);
        const existingKeys = collection.attributes.map((attr) => attr.key);

        // Iterate over attribute definitions
        for (const attribute of attributes) {
            const { key, type, ...config } = attribute;

            // If attribute already exists, delete it first
            if (existingKeys.includes(key)) {
                console.log(`Attribute '${key}' exists. Deleting...`);
                await databases.deleteAttribute(DATABASE_ID, COLLECTION_ID, key);
            }

            // Create the attribute based on its type
            console.log(`Creating attribute '${key}'...`);
            switch (type) {
                case "string":
                    await databases.createStringAttribute(
                        DATABASE_ID,
                        COLLECTION_ID,
                        key,
                        config.size,
                        config.required
                    );
                    break;
                case "datetime":
                    await databases.createDatetimeAttribute(
                        DATABASE_ID,
                        COLLECTION_ID,
                        key,
                        config.required
                    );
                    break;
                default:
                    console.log(`Unsupported attribute type: '${type}'`);
            }
        }

        console.log("Attributes updated successfully!");
    } catch (error) {
        console.error("Error updating attributes:", error);
    }
}

updateAttributes();
