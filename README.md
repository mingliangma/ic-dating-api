# ic

IC Dating API

## Install It
```
npm install
```

## Run It
#### Run in *development* mode:

```
npm run dev
```

#### Run in *production* mode:

```
npm run compile
npm start
```

### Try It
* Point you're browser to [http://localhost:3000](http://localhost:3000)
* Invoke the example REST endpoint `curl http://localhost:3000/api/v1/examples`
   
## Dockerization

### build

```
docker build -t ic .
```

### run
```
docker run -p 3000:3000 ic
```

## AWS EB Deployment

URL: http://docs.aws.amazon.com/elasticbeanstalk/latest/dg/create_deploy_nodejs_express.html#create_deploy_nodejs_express_eb_init-rds

## API

### Image Upload from mobile app directly to AWS S3

These are the high level steps:
* A file is selected for upload by the user in the mobile app;
* The app makes a request to our IC server, which produces a temporary signature with which to sign the upload request to AWS S3 Bucket;
* The temporary signed request is returned to the app in JSON format;
* The app then uploads the file directly to Amazon S3 using the signed request supplied by our IC server.

**IC Server API: Generate PreSigned URL**

GET URL: /api/v1/account/$accountId/image/gen-presigned-url?fileName=$fileName&fileType=$fileType

```$xslt
curl -X GET 'http://api.ic.kllect.com/api/v1/account/59c555ddddefe0ccdf86960a/image/gen-presigned-url?fileName=test.png&fileType=image%2Fpng'
```

The expected result should be:
```
{
    "signedURL": "https://ic-dating.s3.amazonaws.com/profiles/59c555ddddefe0ccdf86960a/test.png?AWSAccessKeyId=AKIAIFPWWJJ47NC5FSZQ&Content-Type=image%2Fpng&Expires=1506543054&Signature=F8MfvFDRx7aX7OebjkvCGMUk0XU%3D&x-amz-acl=public-read",
    "fileLink": "https://s3.amazonaws.com/ic-dating/profiles/59c555ddddefe0ccdf86960a/test.png"
}
```

Using the signed url make a put request to aws:
```$xslt
const request = req({
    method: 'PUT',
    url: ${signedURL},
    body: file,
    headers: {
      'Content-Type': 'image/png',
    },
  }, (err1, res, body) => {
    console.log(body);
  });
```

The sample web image uploader is at http://api.ic.kllect.com/fileUploader.html



