import * as cdk from "@aws-cdk/core";
import * as apigateway from "@aws-cdk/aws-apigateway";
import * as lambda from "@aws-cdk/aws-lambda";
import * as dynamodb from "@aws-cdk/aws-dynamodb";
import { Duration } from "@aws-cdk/core";
import ContactDDBItem from "../src/db/contact-ddb-item";


export class CdkCrudStarterService extends cdk.Construct {
  constructor(scope: cdk.Construct, id: string) {
    super(scope, id);

    const dynamoTable = new dynamodb.Table(this, ContactDDBItem.TABLE_NAME, {
      partitionKey: {
        name: ContactDDBItem.PARTITION_KEY_NAME,
        type: dynamodb.AttributeType.STRING
      },
      tableName: ContactDDBItem.TABLE_NAME,

      // The default removal policy is RETAIN, which means that cdk destroy will not attempt to delete
      // the new table, and it will remain in your account until manually deleted. By setting the policy to 
      // DESTROY, cdk destroy will delete the table (even if it has data in it)
      removalPolicy: cdk.RemovalPolicy.RETAIN
    });

    const lambdaFunc = new lambda.Function(this, 'lambda-function', {
      code: new lambda.AssetCode('deploy_pkg.zip'),
      handler: 'deploy_pkg/lambda/router.main',
      runtime: lambda.Runtime.NODEJS_10_X,
      environment: {
        CONTACT_TABLE_NAME: dynamoTable.tableName,
        PRIMARY_KEY: ContactDDBItem.PARTITION_KEY_NAME
      },
      timeout: Duration.seconds(5),
    });

    dynamoTable.grantReadWriteData(lambdaFunc);

    const api = new apigateway.RestApi(this, 'contacts-api', {
      restApiName: 'cdk-crud-starter-service'
    });

    const items = api.root.addResource('contacts');

    const getAllIntegration = new apigateway.LambdaIntegration(lambdaFunc);
    items.addMethod('GET', getAllIntegration);

    const createOneIntegration = new apigateway.LambdaIntegration(lambdaFunc);
    items.addMethod('POST', createOneIntegration);
    this.addCorsOptions(items);

    const singleItem = items.addResource('{id}');
    const getOneIntegration = new apigateway.LambdaIntegration(lambdaFunc);
    singleItem.addMethod('GET', getOneIntegration);

    this.addCorsOptions(singleItem);
  }

  addCorsOptions(apiResource: apigateway.IResource) {
    apiResource.addMethod('OPTIONS', new apigateway.MockIntegration({
      integrationResponses: [{
        statusCode: '200',
        responseParameters: {
          'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
          'method.response.header.Access-Control-Allow-Origin': "'*'",
          'method.response.header.Access-Control-Allow-Credentials': "'false'",
          'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,POST'",
        },
      }],
      passthroughBehavior: apigateway.PassthroughBehavior.NEVER,
      requestTemplates: {
        "application/json": "{\"statusCode\": 200}"
      },
    }), {
      methodResponses: [{
        statusCode: '200',
        responseParameters: {
          'method.response.header.Access-Control-Allow-Headers': true,
          'method.response.header.Access-Control-Allow-Methods': true,
          'method.response.header.Access-Control-Allow-Credentials': true,
          'method.response.header.Access-Control-Allow-Origin': true,
        },
      }]
    })
  }
}