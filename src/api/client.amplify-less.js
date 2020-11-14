function generateDataKey() {
    const kms = new aws.KMS();
    return new Promise((resolve, reject) => {
        const params = {
            KeyId: 'alias/simple-crypto-key',
            KeySpec: 'AES_256',
            EncryptionContext:{
                environment: 'production',
                application: 'notification',
            }
        };
        kms.generateDataKey(params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

let key = undefined;

key = generateDataKey().then(result => {
    return result;
});


exports.lambdaHandler = async (event, context) => {
    try {
        // const ret = await axios(url);
        response = {
            'statusCode': 200,
            'body': JSON.stringify({
                message: key.KeyId,
                // location: ret.data.trim()
            })
        }
    } catch (err) {
        console.log(err);
        return err;
    }
    return response
};
