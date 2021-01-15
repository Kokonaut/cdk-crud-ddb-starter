#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdkCrudStarterStack } from '../lib/cdk-crud-starter-stack';

const app = new cdk.App();
new CdkCrudStarterStack(app, 'cdk-crud-starter-stack');
