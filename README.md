# Embedded Virtual Computer Lab in Moodle LMS using AppStream 2.0

## Architecture

## Deployment Steps

### Prerequisites

Install CDK, Node.JS, NPM,
Chalice, Python, boto3

### Deploy AppStream 2.0 Stack and Fleet

1. Go to the cdk directory `cd src/cdk`
2. Run `cdk deploy`

### Deploy LTI Handler API

1. Go to appstream-lti-handler directory
2. Set the password in config.json
2. chalice deploy
3. Configuring your LMS https://aws.amazon.com/blogs/publicsector/integrating-amazon-appstream-2-0-with-your-learning-management-system/