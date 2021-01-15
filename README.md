# CDK CRUD Typescript Starter

This is a basic starter project for kickstarting a CRUD API with AWS CDK.

## Intro

I moved and generalized some common pieces of my private projects into a reusable, public repository. Some of AWS's documentation on deploying Typescript to Lambda is a bit lacking, so  having an out-of-the-box working starter will be helpful.

The starter code revolves around a contact information CRUD service. Data definition can be changed inside of the `src/db/contact-ddb-item.ts` file. Rest of the code should be generic CRUD (except in `src/lambda/create.ts`)

This is built on top of CDK's vanilla initialization starter, keeping the base layout of CDK files into `bin/` and `lib/`.

## Overview

This package uses AWS CDK to synthesize a CloudFormation stack and deploy assets to AWS. Outside of having a working AWS account and credentials, this should include everything needed to deploy a simple CRUD API.

The CRUD API stack contains three resources:
* API Gateway
* AWS Lambda
* DynamoDB

### API Gateway + Lambda Structure

Public API structure is defined via API Gateway Integrations in the CDK stack class. We also only define one Lambda Function.

This means that all API Gateway requests are picked up by the same Lambda, which will route the request manually inside `src/lambda/router.ts`. This is intentional to prevent Lambda Function bloat in the AWS console (and cleaner repo organization).

### DynamoDB Configuration

Everything in  `/db` should be self sufficient to define DDB interactions for the rest of the codebase.

Inside of `db/contact-ddb-item.ts` DynamoDBMapper is leveraged to define table schema while the table name and partition key are defined as constants.

We Marshall and Unmarshall the date field to provide readability in the AWS console.

It's not necessary to define a schema with DDB, but is helpful for a structured CRUD service.


## Setup

Setup is very simple. Assuming you already have an AWS account and credentials setup, then the process is as follows:

* Clone repository
* `npm install`
* `chmod +X buildDeployPkg.sh`
* `npm run build`
* `cdk synth`
* `cdk deploy`

Your terminal will prompt you to review the CloudFormation resource changelist and confirm.

If all goes well, you should see a success message, the API Gateway URL under Outputs, and the CloudFormation ARN under Stack ARN.

### Redeploy
If just updating code in `src`, then only necessary steps are:
* `npm run build`
* `cdk deploy`

If any changes are made that will change the CloudFormation stack code, then run:
* `npm run build`
* `cdk synth`
* `cdk deploy`

### Useful commands
Here is a full list of useful commands

 * `npm run build`   compile typescript to js and package/zip code assets
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template


### Deployment Package
The buildDeployPkg shell script probably needs some explanation.

At the writing of this project, AWS has not provided an out-of-the-box way to manage lambda code asset deployment package. Simplest way to bootstrap was to create a shell script that automated packaging of code assets into a zip file. AWS CDK Lambda definition would then point to that zip file (instead of directly to src).

Best way to control our node runtime dependencies is to package them directly with the Lambda asset code. [ref](https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html)

Ergo the shell script will:

* Create a separate directory specifically to prep the deploy package.
* Reinstall package.json dependency contents inside of the deploy directory with `--only=Prod` option.
* Since the NodeJS runtime only uses Javascript files, our deploy package has no need for the typescript files and configuration, so only transfer js files to deploy directory.
* Zip deploy directory

When `cdk deploy` runs, the CDK code pointing to the above deploy package will upload it to S3 and then to the created Lambda. 

Until AWS comes out with an official solution to do the above, I'll be keeping this method inside my projects. Feel free to replace if too messy.

Probably best to turn this into a node script in the future.
