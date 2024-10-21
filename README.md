# Serverless-app

Api application based Nodejs and serverless framework to be used on cloud.
For Database I used MongoDb running on Docker locally and Mongo Atlas to run on AWS.

## Getting Started

Run `sls offline` to up the server locally.

## Deploy Changes

Run `sls deploy --stage=prd` to deploy you application up-to-dated.

## Mock Login

In order to test login endpoint, I inserted a user into mongoDB local and Mongo Atlas so that you get JWT token and used on other endpoints:
`{
    user: kevin
    password: 5e2e9949c696bd2b38ada1818ff8ed870f82b823ea9fe4557e72ca798666c3467a63fb783e763d008e5d73acd7af8170cd7dc52dee65d1eaee62b29e6e50939f
}`