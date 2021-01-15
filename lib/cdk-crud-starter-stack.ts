import * as cdk from '@aws-cdk/core';
import * as cdk_crud_starter_service from './cdk-crud-starter-service';

export class CdkCrudStarterStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new cdk_crud_starter_service.CdkCrudStarterService(this, 'crud-service');
  }
}
