#!/bin/bash
rm deploy_pkg.zip
mkdir deploy_pkg
mkdir deploy_pkg/node_modules
cp -R src/ deploy_pkg/
cp package.json deploy_pkg/
cp package-lock.json deploy_pkg/
cd deploy_pkg
npm install --only=prod
cd ..
rm -rf deploy_pkg/node_modules/@aws-cdk/
rm deploy_pkg/lambda/*.ts
rm deploy_pkg/db/*.ts
zip -r deploy_pkg.zip deploy_pkg/*
rm -rf deploy_pkg/