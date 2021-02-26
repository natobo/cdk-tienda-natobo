#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { AppTiendaNicotoboCdkStack } from '../lib/app-tienda-nicotobo-cdk-stack';

const app = new cdk.App();
new AppTiendaNicotoboCdkStack(app, 'AppTiendaNicotoboCdkStack');
