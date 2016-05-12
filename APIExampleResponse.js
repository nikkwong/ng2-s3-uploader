module.exports = function s3PolicyGenerator(projectId) {
  return {
    s3Signature: s3Signature,
    signatureKey: signatureKey,
    base64Policy: base64Policy,
    accessKeyId: accessKeyId,
    folder: folder,
    xAmzDate: xAmzDateWSuffix,
    xAmzCredential: xAmzCredential,
    xAmzAlgorithm: xAmzAlgorithm,
    xAmzServerSideEncryption: xAmzServerSideEncryption,
    xAmzAcl: xAmzAcl,
    xAmzBucket: xAmzBucket,
    xAmzMetaUuid: xAmzMetaUuid
  };
};

var CryptoJS = require("crypto-js"),
    serviceName = 's3',

    // Config

    accessKeyId = 'YOUR AWS PUBLIC KEY',
    folder = 'YOUR S3 FOLDER',
    region = 'YOUR S3 REGION ex. us-west-2',
    secretAccessKey = 'YOUR SECRET KEY',
    xAmzBucket = 'YOUR S3 BUCKET NAME',

    // Policy credentials

    expiration = '2020-01-01T12:00:00.000Z',
    xAmzDate = buildTimestamp(),
    xAmzDateWSuffix = xAmzDate +  'T000000Z',
    xAmzServerSideEncryption = 'AES256',
    xAmzAlgorithm = "AWS4-HMAC-SHA256",
    xAmzAcl = "public-read",
    expiration = '2020-01-01T12:00:00.000Z',
    xAmzMetaUuid = '14365123651274',    
    xAmzCredential = accessKeyId + "/" + xAmzDate + "/" + region + "/" + serviceName + "/aws4_request",

    policy = {
      "expiration": expiration,
      "conditions": [
        {"bucket": xAmzBucket},
        ["starts-with", "$key", folder + "/"],
        {"acl": xAmzAcl},
        ["starts-with", "$Content-Type", ""],
        {"x-amz-server-side-encryption": xAmzServerSideEncryption},
        {"x-amz-credential": xAmzCredential},
        {"x-amz-algorithm": xAmzAlgorithm},    
        {"x-amz-meta-uuid": xAmzMetaUuid},
        {"x-amz-date": xAmzDateWSuffix }
      ]
    },
    
    base64Policy = new Buffer(JSON.stringify(policy), "utf-8").toString("base64"),
    signatureKey = getSignatureKey(secretAccessKey, xAmzDate, region, serviceName),
    s3Signature = CryptoJS.HmacSHA256(base64Policy, signatureKey).toString(CryptoJS.enc.Hex);



function getSignatureKey(key, dateStamp, regionName, serviceName) {
   var kDate = CryptoJS.HmacSHA256(dateStamp, "AWS4" + key);
   var kRegion = CryptoJS.HmacSHA256(regionName, kDate);
   var kService = CryptoJS.HmacSHA256(serviceName, kRegion);
   var kSigning = CryptoJS.HmacSHA256("aws4_request", kService);

   return kSigning;
}

function buildTimestamp() {
    var date = new Date();
    var year = date.getFullYear();
    var month = ("0" + (date.getMonth() + 1)).slice(-2);
    var day = ("0" + date.getDate()).slice(-2);
    return year + month + day;
}