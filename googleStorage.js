// Imports the Google Cloud client library.
const {Storage} = require('@google-cloud/storage');


// Instantiates a client. Explicitly use service account credentials by
// specifying the private key file. All clients in google-cloud-node have this
// helper, see https://github.com/GoogleCloudPlatform/google-cloud-node/blob/master/docs/authentication.md
const projectId = 'veritone-334718'
const keyFilename = './creds/credentials.json'
const storage = new Storage({projectId, keyFilename});


async function listBuckets() {
    try {
        const [buckets] = await storage.getBuckets();

        console.log('Buckets:');
        buckets.forEach(bucket => {
            console.log(bucket.name);
        });
    } catch (err) {
        console.error('ERROR:', err);
    }
}

async function uploadFile(bucketName, filePath, destFileName) {
    await storage.bucket(bucketName).upload(filePath, {
        destination: destFileName,
    });

    console.log(`${filePath} uploaded to ${bucketName}`);
}

async function listFiles() {
    // Lists files in the bucket
    const [files] = await storage.bucket(bucketName).getFiles();
    console.log('Files:');
    files.forEach(file => {
        console.log(file.name);
    });
}


// running
//listBuckets();
//uploadFile().catch(console.error);
//listFiles().catch(console.error);

module.exports = { uploadFile}