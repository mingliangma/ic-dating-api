
const Promise = require('bluebird');
const aws = require('aws-sdk');

module.exports.generatePutPreSignedURL = (fileName, fileType, accountId) => new Promise(
  ((resolve, reject) => {
    aws.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
    });

    console.log('S3_BUCKET: ', process.env.S3_BUCKET);
    console.log('file_name: ', fileName);


    const s3FileKey = `profiles/${accountId}/${fileName}`;
    console.log('S3 file path: ', s3FileKey);


    const s3 = new aws.S3();
    const options = {
      Bucket: process.env.S3_BUCKET,
      Key: s3FileKey,
      Expires: 600,
      ContentType: fileType,
      ACL: 'public-read',
    };

    s3.getSignedUrl('putObject', options, (err, signedURL) => {
      if (err) reject(err);
      console.log('signed_url: ', signedURL);
      resolve({
        signedURL,
        fileLink: `https://s3.amazonaws.com/${process.env.S3_BUCKET}/${s3FileKey}`,
      });
    });
  }),
);
