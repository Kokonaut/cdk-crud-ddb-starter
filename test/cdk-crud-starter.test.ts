import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import { test } from '@jest/globals';
import * as cdk from '@aws-cdk/core';
import * as CdkCrudStarter from '../lib/cdk-crud-starter-stack';

test('Empty Stack', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new CdkCrudStarter.CdkCrudStarterStack(app, 'MyTestStack');
  // THEN
  expectCDK(stack).to(matchTemplate({
    "Resources": {}
  }, MatchStyle.EXACT))
});
