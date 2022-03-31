import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as appstream from 'aws-cdk-lib/aws-appstream';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';

export interface AppStreamLtiStackProps extends StackProps {
  fleetName: string;
  fleetDisplayName: string;
  fleetImageName: string;
  stackName: string;
  createAppStreamIamServiceRole: boolean;
}

export class AppStreamLtiStack extends Stack {
  constructor(scope: Construct, id: string, props: AppStreamLtiStackProps) {
    super(scope, id, props);
    
    // VPC
    const vpc = new ec2.Vpc(this, 'vpc', {
      maxAzs: 2
    });

    const privateSubnets = vpc.selectSubnets({
      subnetType: ec2.SubnetType.PRIVATE_WITH_NAT
    }).subnetIds;

    // AppStream
    const fleet = new appstream.CfnFleet(this, 'appstream-fleet', {
      name: props.fleetName,
      displayName: props.fleetDisplayName,
      imageName: props.fleetImageName,
      instanceType: 'stream.standard.medium',
      fleetType: 'ON_DEMAND',
      computeCapacity: {
        desiredInstances: 1
      },
      vpcConfig: {
          subnetIds: privateSubnets,
          securityGroupIds: [ vpc.vpcDefaultSecurityGroup ]
      },
      maxUserDurationInSeconds: 57600,
      disconnectTimeoutInSeconds: 900,
      enableDefaultInternetAccess: false,
      streamView: 'DESKTOP',
    });
    fleet.addOverride('CreationPolicy', {
      'StartFleet': 'true'
    });

    const homeFolderBucket = new s3.Bucket(this, 'home-folder-bucket', {
      versioned: false
    });

    const stack = new appstream.CfnStack(this, 'appstream-stack', {
      name: props.stackName,
      storageConnectors: [{
        connectorType: 'HOMEFOLDERS',
        resourceIdentifier: homeFolderBucket.bucketArn
      }]
    });

    if (props.createAppStreamIamServiceRole) {
      const appStreamRole = new iam.Role(this, 'appstream-service-role', {
        managedPolicies: [ iam.ManagedPolicy.fromManagedPolicyArn(this, 'AmazonAppStreamServiceAccess', 'arn:aws:iam::aws:policy/service-role/AmazonAppStreamServiceAccess') ],
        roleName: 'AmazonAppStreamServiceAccess',
        path: '/service-role/',
        assumedBy: new iam.ServicePrincipal('appstream.amazonaws.com')
      });
      stack.node.addDependency(appStreamRole);
    }

    const stackFleetAssociation = new appstream.CfnStackFleetAssociation(this, 'FullDesktopStackFleetAssociation', {
      fleetName: fleet.name,
      stackName: stack.name!
    });
    stackFleetAssociation.addDependsOn(fleet);
    stackFleetAssociation.addDependsOn(stack);

    new CfnOutput(this, 'fleet-name', {
      value: fleet.name
    });
    new CfnOutput(this, 'stack-name', {
      value: stack.name!
    });
  }
}
