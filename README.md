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

#### Deploy to the Cloud
e.g. CloudFoundry

```
cf push ic
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