#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AppStreamLtiStack } from '../lib/appstream-lti-stack';

const app = new cdk.App();
new AppStreamLtiStack(app, 'appstream-lti-stack', {
  fleetName: 'appstream-lti-fleet',
  fleetDisplayName: 'appstream-lti-fleet',
  fleetImageName: 'Amazon-AppStream2-Sample-Image-02-04-2019',
  stackName: 'appstream-lti-stack',
  createAppStreamIamServiceRole: false
});