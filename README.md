# Embedded Virtual Computer Lab in Moodle LMS using AppStream 2.0

Moodle is a popular open source learning management system (LMS). Many education institutions are using Moodle to provide an online learning platform for their students to achieve their learning goals. It is especially critical due to the impact of Covid-19 on the face-to-face learning process. 

There are many plugins available in Moodle which allows you to extend features into your Moodle Platform. In this document, we will be showing how you can integrate Appstream 2.0 with Moodle using AWS CDK and Chalice. 

In this post, we will be focusing on the CDK deployment portion of Appstream 2.0 as a virtual lab integration with Moodle LMS. There is an existing blog about integrating appstream with learning management system that you can refer to at the end of this post

## Architecture

![Solution Overview](/docs/images/Solution-Appstream.jpg "Solution Overview")

The solution is deployed using [AWS Cloud Development Kit (AWS CDK)](https://aws.amazon.com/cdk/) that allows users to define cloud application resources using familiar programming languages and also [AWS Chalice](https://aws.github.io/chalice/) framework for the application logic as code using Python Serverless Micro-framework for AWS to quickly create and deploy applications that use Amazon API Gateway and AWS Lambda. The solution is deployed with the following components:

- [Amazon API Gateway](https://aws.amazon.com/api-gateway/) endpoint is created as part of the AWS Chalice deployment which generates API Gateway resources definition. A HTTP endpoint is exposed which is integrated to backend AWS Lambda (https://aws.amazon.com/lambda/) function where the API Gateway routes request to the lambda function that generates a streaming URL. 
- [Amazon App Stream 2.0](https://aws.amazon.com/appstream2/) is created as part of the CDK Deployment. AppStream is a managed service to provide access to non-persistent desktops and application with increased security, elasticity, and flexibility compared to traditional virtual desktop infrastructure (VDI) solutions which can be used as a virtual lab environment for the LMS.
- As described in Step 1, after the streaming URL is generated, the user is redirected to AppStream in Step 2 which then launch a non-persistent desktops for the user to access.

## Deploying the Solution

### Prerequisites

Install CDK, Node.JS, NPM,
Chalice, Python, boto3

- Install and configure AWS CLI with your IAM user: https://aws.amazon.com/cli/
- Install CDK: https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html#getting_started_install
- Install Chalice: https://aws.github.io/chalice/quickstart.html
- Install boto3: https://boto3.amazonaws.com/v1/documentation/api/latest/guide/quickstart.html

### Deploy Moodle LMS

- Install Moodle Serverless on AWS: https://github.com/hendryanw/cdk-ecs-moodle

### Deploy AppStream 2.0 Stack and Fleet

1. Go to the cdk directory `cd src/cdk`
2. Run `cdk deploy`

### Deploy LTI Handler API

1. Go to appstream-lti-handler directory
2. Set the password in config.json
2. chalice deploy
3. Configuring your LMS https://aws.amazon.com/blogs/publicsector/integrating-amazon-appstream-2-0-with-your-learning-management-system/

### Teardown

You should consider deleting the application infrastructure once you no longer need it to save costs. You can run cdk destroy to delete the CDK application.

## Next Steps

You can also find more information about each of the AWS services used for this solution in the AWS guides:

- [Amazon Lambda Developer Guide](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html)
- [Amazon API Gateway Developer Guide](https://docs.aws.amazon.com/apigateway/latest/developerguide/welcome.html)
- [Amazon AppStream Administration Guide](https://docs.aws.amazon.com/appstream2/latest/developerguide/what-is-appstream.html)

Visit various blogs that features common use-cases and integrations within Moodle such as:

- [Create LTI-ready virtual classroom experiences with Amazon Chime SDK](https://aws.amazon.com/blogs/business-productivity/create-lti-ready-virtual-classroom-experiences-with-amazon-chime-sdk/)
- [Integrating Amazon AppStream 2.0 with your Learning Management System](https://aws.amazon.com/blogs/publicsector/integrating-amazon-appstream-2-0-with-your-learning-management-system/)



