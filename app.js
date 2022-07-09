const graphQL = require('./graphqlService').GraphQLService
const storage = require("./googleStorage")
const {catmanPassword, catmanUser} = require("./creds/login");

try {
    (async () => {

        // define variables veritone endpoint
        const payloadConfig = {};
        let tdoID = ""
        payloadConfig["veritoneApiUrl"] = 'https://api.stage.us-1.veritone.com/v3/graphql';

        // define file properties
        let contentType = "text/plain"
        let assetType = "media"

        const filePath = "./data/textExample.txt"
        const destFileName = "textExample.txt"
        const bucketName = "veritone-integration-bucket"
        const publicUrl = "https://storage.googleapis.com/"+bucketName+"/"+destFileName

        // get auth token
        console.log("\nGetting authorization token.")
        let login = new graphQL();

        const getToken = await login
            .userLogin(payloadConfig.veritoneApiUrl, catmanPassword, catmanUser);

        let token = getToken.data['userLogin'].token;
        console.log("\nAuthorization bearer: ", token)


        let assetCreator = new graphQL(token)

        // create new TDO
        console.log("\nCreating new TDO")

        const newTDO = await assetCreator
            .createTDO(payloadConfig.veritoneApiUrl);
        tdoID = newTDO.data['createTDO'].id
        console.log("\nNew TDO created: ", newTDO);
        console.log("\nTDO id: ", tdoID);



        // get assets from TDO
        console.log("\nGetting assets from TDO id: ", tdoID)

        const assets = await assetCreator
            .getAssets(payloadConfig.veritoneApiUrl, tdoID)
        console.log("\nAssets of given tdo: ", assets)



        // upload file into Google Storage to get public URL
        await storage.uploadFile(bucketName, filePath, destFileName)



        // create asset on TDO
        // the problem here is that we have to use a public url, not a local file
        console.log("\nCreating asset on TDO")

        const createAssets = await assetCreator
            .createAsset(payloadConfig.veritoneApiUrl, publicUrl, contentType, assetType, tdoID)
        console.log("\nAssets created: ", createAssets)
        

        /*
        // create new TDO with asset
        // we aren't using this one but seemed useful
        console.log("\nCreating new TDO with asset")

        const newTDOwAsset = await assetCreator
            .createTDOwithAsset(payloadConfig.veritoneApiUrl);
        console.log("\nNew TDO with asset created: ", newTDOwAsset);
        tdoID = newTDOwAsset.data.createTDOWithAsset.id

        */

        // get assets from TDO
        console.log("\nGetting assets from TDO id: ", tdoID)


        const newAssets = await assetCreator
            .getAssets(payloadConfig.veritoneApiUrl, tdoID)
        console.log("\nAssets of given tdo: ", newAssets.data.temporalDataObject.assets)

    })();

}  catch (err) {
    console.log("\nProcessing failed with error: ", err);
};


