import * as cdk from '@aws-cdk/core';
import * as apigw from "@aws-cdk/aws-apigateway";
import {CrudProductos} from "./crud-productos";
export class AppTiendaNicotoboCdkStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    // nombre del stack
    const stackName = 'app-cdk-nicotobo';
    // componente que realiza el crud de los productos
    const crudProductos = new CrudProductos(this,"crud-productos");
    // define un recurso API Gateway REST API respaldado por la funcion "Hola"
    const api = new apigw.RestApi(this, `${stackName}-api`, {
      defaultCorsPreflightOptions: {
        // Define respuestas OPTIONS a todos 
        allowOrigins: apigw.Cors.ALL_ORIGINS,
      },
      restApiName: `${stackName}-service`,
    });
    const crudEndpoint = api.root.addResource(`${stackName}-crud`);
    const createOneIntegration = new apigw.LambdaIntegration(crudProductos.lambdaCrud,{
      proxy:false,
      integrationResponses:[
        {
          // Successful response from the Lambda function, no filter defined
          //  - the selectionPattern filter only tests the error message
          // We will set the response status code to 200
          statusCode: "200",
          responseParameters: {
            // We can map response parameters
            // - Destination parameters (the key) are the response parameters (used in mappings)
            // - Source parameters (the value) are the integration response parameters or expressions
            'method.response.header.Content-Type': "'application/json'",
            'method.response.header.Access-Control-Allow-Origin': "'*'",
            'method.response.header.Access-Control-Allow-Credentials': "'true'"
          }
        },
        {
          // For errors, we check if the error message is not empty, get the error data
          selectionPattern: '(\n|.)+',
          // We will set the response status code to 200
          statusCode: "400",
          responseParameters: {
              'method.response.header.Content-Type': "'application/json'",
              'method.response.header.Access-Control-Allow-Origin': "'*'",
              'method.response.header.Access-Control-Allow-Credentials': "'true'"
          }
        }
      ]
    });
    crudEndpoint.addMethod('POST', createOneIntegration,{
      methodResponses:[
        {
          // Successful response from the integration
          statusCode: '200',
          // Define what parameters are allowed or not
          responseParameters: {
            'method.response.header.Content-Type': true,
            'method.response.header.Access-Control-Allow-Origin': true,
            'method.response.header.Access-Control-Allow-Credentials': true
          }
        },
        {
          // Same thing for the error responses
          statusCode: '400',
          responseParameters: {
            'method.response.header.Content-Type': true,
            'method.response.header.Access-Control-Allow-Origin': true,
            'method.response.header.Access-Control-Allow-Credentials': true
          }
        }
      ]
    });
    //addCorsOptions(items);
  }
}
