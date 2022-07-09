const superagent = require('superagent')


class GraphQLServiceDefinition {
    constructor(veritoneJWT) {
        this.headers = {"Authorization": 'bearer ' + veritoneJWT}
    }

    // useLogin requests a new token for a given user and password
    async userLogin(veritoneApiUrl, catmanPassword, catmanUser) {
        let query = `
          mutation {
          userLogin(
            input: {
              userName: "${catmanUser}"
              password: "${catmanPassword}"
            }
          ) {
            token
          }
        }`
        let response = await superagent.post(veritoneApiUrl)
            .field('query', query)
        return response.body
    };

    // createTDO creates a new empty TDO and returns its ID
    async createTDO(veritoneApiUrl) {
        let query = `
        mutation createTDO {
            createTDO(
              input: {
                startDateTime: 1533761172
                stopDateTime: 1533761227
              }
            ) {
              id
              status
              assets {
                records {
                  id
                }
              }
            }
            }`
        let response = await superagent.post(veritoneApiUrl)
            .set(this.headers)
            .field('query', query)
        return response.body
    }

    // getAssets list the assets of a given TDO
    async getAssets(veritoneApiUrl, tdoID) {
        let query = `
        query getAssets {
          temporalDataObject(id: "${tdoID}") {
            id
            previewUrl
            thumbnailUrl
            assets {
              records {
                id
                assetType
                signedUri
                details
                jsondata
                fileData {
                  md5sum
                  size
                  originalFileUri
                  mediaDurationMs
                }
                sourceData {
                  engine {
                    id
                    name
                  }
                }
              }
            }
          }
        }`
        let response = await superagent.post(veritoneApiUrl)
            .set(this.headers)
            .field('query', query)
        return response.body
    }

    // createAsset creates a new assets (image, text or any kind of file) inside a given TDO
    async createAsset(veritoneApiUrl, publicUrl, contentType, assetType, tdoID) {
        let query = `
        mutation createNewAssetOnTdo {
            createAsset(input: {
              containerId: ${tdoID}
              assetType: "${assetType}"
              contentType: "${contentType}"
              uri: "${publicUrl}"
                        sourceData: {
            engineId: "62f2b2a7-bfd6-44c8-ab78-c02b47f95974"
          }
            }) {
              id
              signedUri
            }
        }`
        let response = await superagent.post(veritoneApiUrl)
            .set(this.headers)
            .field('query', query)
        return response.body
    }

    // createTDOwithAsset creates a new assets (image, text or any kind of file) inside a given TDO
    async createTDOwithAsset(veritoneApiUrl) {
        let query = `
        mutation createTDOWithAsset {
            createTDOWithAsset(
              input: {
                startDateTime: 1533761172
                stopDateTime: 1533761227
                contentType: "image/jpeg"
                assetType: "media"
                addToIndex: true
                uri: "https://vtn-dev-test-files.s3.amazonaws.com/media/image/celebrity-recognition-johnny-depp.jpeg"
              }
            ) {
              id
              status
              assets {
                records {
                  id
                  assetType
                  contentType
                  signedUri
                }
              }
            }
            }`
        let response = await superagent.post(veritoneApiUrl)
            .set(this.headers)
            .field('query', query)
        return response.body
    }
}

module.exports = { GraphQLService: GraphQLServiceDefinition}
