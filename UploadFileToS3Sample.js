const req = require('request');
const fs = require('fs');
const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: '',
  secretAccessKey: '',
});
AWS.config.region = 'us-east-1';
const s3 = new AWS.S3();
const params = { Bucket: 'ic-dating', Key: 'profiles/test.png', Expires: 300, ContentType: 'image/png', ACL: 'public-read'};
const url = s3.getSignedUrl('putObject', params);

console.log('signed URL: ', url);
fs.readFile('./test.png', (err, data) => {
  if (err) {
    return console.log(err);
  }
  const request = req({
    method: 'PUT',
    url,
    body: data,
    headers: {
      'Content-Type': 'image/png',
    },
  }, (err1, res, body) => {
    console.log(body);
  });

  console.log('request.headers: ', request.headers);
});
