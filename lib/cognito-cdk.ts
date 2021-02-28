import * as cdk from "@aws-cdk/core";
import * as cognito from "@aws-cdk/aws-cognito";

export class CognitoCdk extends cdk.Construct{
  constructor(scope:cdk.Construct,id:string){
    super(scope,id);
    // ========================================================================
    // Resource: Amazon Cognito User Pool
    // ========================================================================
    const userPool = new cognito.UserPool(this, "UserPool", {
        userPoolName: 'userpool-tienda-cdk-nicotobo',
        selfSignUpEnabled: true, // Allow users to sign up
        autoVerify: { email: true }, // Verify email addresses by sending a verification code
        signInAliases: { username: true }, 
      });
    const userPoolClient = new cognito.UserPoolClient(this, "UserPoolClient", {
        userPool,
        generateSecret: false, // Don't need to generate secret for web app running on browsers
      });
      const identityPool = new cognito.CfnIdentityPool(this, "IdentityPool", {
        allowUnauthenticatedIdentities: false, // Don't allow unathenticated users
        cognitoIdentityProviders: [
          {
            clientId: userPoolClient.userPoolClientId,
            providerName: userPool.userPoolProviderName,
          },
        ],
      });
      new cdk.CfnOutput(this, "UserPoolId", {
        value: userPool.userPoolId,
      });
      new cdk.CfnOutput(this, "UserPoolClientId", {
        value: userPoolClient.userPoolClientId,
      });
  }
}