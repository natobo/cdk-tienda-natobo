import * as cdk from "@aws-cdk/core";
import * as cloudfront from "@aws-cdk/aws-cloudfront";
import * as waf from "@aws-cdk/aws-wafv2";
import * as s3 from "@aws-cdk/aws-s3";

export class CloudfrontWafCdk extends cdk.Construct{
    constructor(scope: cdk.Construct,id:string){
        super(scope,id);
        const acl = new waf.CfnWebACL(this, "ACL2", {
            defaultAction: {
                allow: { allow: true },
            },
            scope: "CLOUDFRONT",
            visibilityConfig: {
                cloudWatchMetricsEnabled: true,
                metricName: "waf",
                sampledRequestsEnabled: false,
            },
            rules: [
                {
                    name: 'AWS-AWSManagedRulesAmazonIpReputationList',
                    priority: 0,
                    statement: {
                        managedRuleGroupStatement: {
                            vendorName: 'AWS',
                            name: 'AWSManagedRulesAmazonIpReputationList',
                        },
                    },
                    overrideAction: {
                        none: {},
                    },
                    visibilityConfig: {
                        sampledRequestsEnabled: true,
                        cloudWatchMetricsEnabled: true,
                        metricName: 'Staging-AWS-AWSManagedRulesAmazonIpReputationList',
                    },
                },
                {
                    name: 'AWS-AWSManagedRulesCommonRuleSet',
                    priority: 1,
                    statement: {
                        managedRuleGroupStatement: {
                            vendorName: 'AWS',
                            name: 'AWSManagedRulesCommonRuleSet',
                        },
                    },
                    overrideAction: {
                        none: {},
                    },
                    visibilityConfig: {
                        sampledRequestsEnabled: true,
                        cloudWatchMetricsEnabled: true,
                        metricName: 'Staging-AWS-AWSManagedRulesCommonRuleSet',
                    },
                },
                {
                    name: 'AWS-AWSManagedRulesKnownBadInputsRuleSet',
                    priority: 2,
                    statement: {
                        managedRuleGroupStatement: {
                            vendorName: 'AWS',
                            name: 'AWSManagedRulesKnownBadInputsRuleSet',
                        },
                    },
                    overrideAction: {
                        none: {},
                    },
                    visibilityConfig: {
                        sampledRequestsEnabled: true,
                        cloudWatchMetricsEnabled: true,
                        metricName: 'Staging-AWS-AWSManagedRulesKnownBadInputsRuleSet',
                    },
                },
                {
                    name: 'AWS-AWSManagedRulesLinuxRuleSet',
                    priority: 3,
                    statement: {
                        managedRuleGroupStatement: {
                            vendorName: 'AWS',
                            name: 'AWSManagedRulesLinuxRuleSet',
                        },
                    },
                    overrideAction: {
                        none: {},
                    },
                    visibilityConfig: {
                        sampledRequestsEnabled: true,
                        cloudWatchMetricsEnabled: true,
                        metricName: 'Staging-AWS-AWSManagedRulesLinuxRuleSet',
                    },
                },
                {
                    name: 'AWS-AWSManagedRulesSQLiRuleSet',
                    priority: 4,
                    statement: {
                        managedRuleGroupStatement: {
                            vendorName: 'AWS',
                            name: 'AWSManagedRulesSQLiRuleSet',
                        },
                    },
                    overrideAction: {
                        none: {},
                    },
                    visibilityConfig: {
                        sampledRequestsEnabled: true,
                        cloudWatchMetricsEnabled: true,
                        metricName: 'Staging-AWS-AWSManagedRulesSQLiRuleSet',
                    },
                },
            ],
        });
        
        // Importa el bucket donde esta el front alojado
        const myBucket = s3.Bucket.fromBucketName(this,"mybucket","stack-tienda-nicolas-tobo.demo");
        
        // Origin access identity for cloudfront to access the bucket
        const myCdnOai = new cloudfront.OriginAccessIdentity(this, "CdnOai");
        myBucket.grantRead(myCdnOai);
        
        // Crea la distribucion del CDN dentro de la aplicacion
        const cdn = new cloudfront.CloudFrontWebDistribution(this, "Cdn", {
          originConfigs: [
            {
              
              s3OriginSource: {
                
                s3BucketSource: myBucket,
                originAccessIdentity: myCdnOai,
              },
              behaviors: [
                {
                  isDefaultBehavior: true,
              
                }
              ]
            }
          ],
         webACLId: acl.attrArn
        });
        // Output del sitio en cloudfront
        new cdk.CfnOutput(this, "Cloudfront", {
            value: 'https://'+cdn.distributionDomainName,
        });
    }
}