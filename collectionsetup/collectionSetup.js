const { Client, Databases } = require('node-appwrite');

const client = new Client();
const databases = new Databases(client);

client
  .setEndpoint('https://cloud.appwrite.io/v1') // Your Appwrite endpoint
  .setProject('675959ef000936e95cd5') // Your project ID
  .setKey('standard_0d13ac71b902adf6f11a3121e1770687dfdbb206b24ad1cb52d2635a462a3edefc8134dfd2f71448720ec3ee0c8b174e6991d510abb901da36d7234a31ac19535a310d7026ee7f42ccddadec00e4a8294c02b414e4f955243fadad2ebd32d8719f56bcf3124c68d62acffd443bc344a16da06161013db368d528536b9dd6aa64'); // Your API key


  async function createAttributes() {
    const databaseId = '67595ac1002b67474905';
    const collectionId = '67598b7e000e5febc53e';
  
    try {
      // Add attributes for `Patient`
      await databases.createStringAttribute(databaseId, collectionId, 'identificationDocumentId', 100, false);
      await databases.createStringAttribute(databaseId, collectionId, 'identificationDocumentUrl', 1000, false);
    //   await databases.createStringAttribute(databaseId, collectionId, 'name', 100, true);
    //   await databases.createEmailAttribute(databaseId, collectionId, 'email', true);
    //   await databases.createStringAttribute(databaseId, collectionId, 'phone', 15, false);
    //   await databases.createDatetimeAttribute(databaseId, collectionId, 'birthDate', false);
    //   await databases.createEnumAttribute(databaseId, collectionId, 'gender', ['male', 'female', 'other'], false);
    //   await databases.createStringAttribute(databaseId, collectionId, 'address', 255, false);
    //   await databases.createStringAttribute(databaseId, collectionId, 'occupation', 100, false);
    //   await databases.createStringAttribute(databaseId, collectionId, 'emergencyContactName', 100, false);
    //   await databases.createStringAttribute(databaseId, collectionId, 'emergencyContactNumber', 15, false);
    //   await databases.createStringAttribute(databaseId, collectionId, 'primaryPhysician', 100, false);
    //   await databases.createStringAttribute(databaseId, collectionId, 'insuranceProvider', 100, false);
    //   await databases.createStringAttribute(databaseId, collectionId, 'insurancePolicyNumber', 50, false);
    //   await databases.createStringAttribute(databaseId, collectionId, 'allergies', 255, false);
    //   await databases.createStringAttribute(databaseId, collectionId, 'currentMedication', 255, false);
    //   await databases.createStringAttribute(databaseId, collectionId, 'familyMedicalHistory', 255, false);
    //   await databases.createStringAttribute(databaseId, collectionId, 'pastMedicalHistory', 255, false);
    //   await databases.createStringAttribute(databaseId, collectionId, 'identificationType', 50, false);
    //   await databases.createStringAttribute(databaseId, collectionId, 'identificationNumber', 50, false);
    //   await databases.createFileAttribute(databaseId, collectionId, 'identificationDocument', false);
    //   await databases.createBooleanAttribute(databaseId, collectionId, 'privacyConsent', true);
  
      console.log('Attributes created successfully!');
    } catch (error) {
      console.error('Error creating attributes:', error);
    }
  }
  
  createAttributes();
  