import * as cdk from '@aws-cdk/core';
import * as lambda from "@aws-cdk/aws-lambda";
import * as apigw from "@aws-cdk/aws-apigateway";
import { appendFile } from 'fs';
// Interfaz que define las propiedas de la clase
export interface ApiGatewayCdkProps{
    /**
     * Funcion encargada de crear el crud
     */
    functionCrud: lambda.IFunction;
    /**
     * Funcion encargada de crear la img
     */
    functionImg: lambda.IFunction;
    /**
     * Nombre del stack
     */
    stackName: string;
}
// Clase que define el Apugateway de la aplicacion
export class ApiGatewayCdk extends cdk.Construct{
    constructor(scope:cdk.Construct,id:string,props:ApiGatewayCdkProps){
    super(scope,id);
    // ========================================================================
    // Resource: Amazon API Gateway
    // ========================================================================
    const api = new apigw.RestApi(this, `${props.stackName}-api`, {
        defaultCorsPreflightOptions: {
          // Define respuestas OPTIONS a todos los origenes
          allowOrigins: apigw.Cors.ALL_ORIGINS,
        },
        restApiName: `${props.stackName}-service`,
      });
      // ========================================================================
      // Resource: Amazon API Gateway Endpoint CRUD
      // ========================================================================
      // Crea el endopoint para el crud dentro del API gateway
      const crudEndpoint = api.root.addResource(`${props.stackName}-crud`);
      // Crea la integracion de las respuestas del Lambda, con un encabezado CORS
      const IntegrationLambdaCrud = new apigw.LambdaIntegration(props.functionCrud,{
        proxy:false,
        integrationResponses:[
          {
            // Respuesta exitosa de la función Lambda, sin filtro definido
            // - el filtro selectionPattern solo prueba el mensaje de error
            // Estableceremos el código de estado de respuesta en 200
            statusCode: "200",
            responseParameters: {
            // Podemos mapear los parámetros de respuesta
            // - Los parámetros de destino (la clave) son los parámetros de respuesta (usados ​​en mapeos)
            // - Los parámetros de origen (el valor) son los parámetros o expresiones de respuesta de integración
              'method.response.header.Content-Type': "'application/json'",
              'method.response.header.Access-Control-Allow-Origin': "'*'",
              'method.response.header.Access-Control-Allow-Credentials': "'true'"
            }
          },
          {
            // Para errores, verificamos si el mensaje de error no está vacío, obtenemos los datos del error  
            selectionPattern: '(\n|.)+',
            // Estableceremos el código de estado de respuesta en 200
            statusCode: "400",
            responseParameters: {
                'method.response.header.Content-Type': "'application/json'",
                'method.response.header.Access-Control-Allow-Origin': "'*'",
                'method.response.header.Access-Control-Allow-Credentials': "'true'"
            }
          }
        ]
      });
      // Añade el metodo post y dentro incluye a los metodos de respuesta del api gateway con encabezados CORS
      crudEndpoint.addMethod('POST', IntegrationLambdaCrud,{
        methodResponses:[
          {
           // Respuesta exitosa de la integración
            statusCode: '200',
          // Definir qué parámetros están permitidos o no
            responseParameters: {
              'method.response.header.Content-Type': true,
              'method.response.header.Access-Control-Allow-Origin': true,
              'method.response.header.Access-Control-Allow-Credentials': true
            }
          },
          {
            // Lo mismo para las respuestas de error
            statusCode: '400',
            responseParameters: {
              'method.response.header.Content-Type': true,
              'method.response.header.Access-Control-Allow-Origin': true,
              'method.response.header.Access-Control-Allow-Credentials': true
            }
          }
        ]
      });
      // ========================================================================
      // Resource: Amazon API Gateway Endpoint SIGN
      // ========================================================================
      // Crea el endopoint para el manejo de imagenes dentro del API gateway
      const singEndpoint = api.root.addResource(`${props.stackName}-sign`);
      // Crea la integracion de las respuestas del Lambda, con un encabezado CORS
      const IntegrationLambdaSign = new apigw.LambdaIntegration(props.functionImg,{
        proxy:false,
        integrationResponses:[
          {
            // Respuesta exitosa de la función Lambda, sin filtro definido
            // - el filtro selectionPattern solo prueba el mensaje de error
            // Estableceremos el código de estado de respuesta en 200
            statusCode: "200",
            responseParameters: {
            // Podemos mapear los parámetros de respuesta
            // - Los parámetros de destino (la clave) son los parámetros de respuesta (usados ​​en mapeos)
            // - Los parámetros de origen (el valor) son los parámetros o expresiones de respuesta de integración
              'method.response.header.Content-Type': "'application/json'",
              'method.response.header.Access-Control-Allow-Origin': "'*'",
              'method.response.header.Access-Control-Allow-Credentials': "'true'"
            }
          },
          {
            // Para errores, verificamos si el mensaje de error no está vacío, obtenemos los datos del error  
            selectionPattern: '(\n|.)+',
            // Estableceremos el código de estado de respuesta en 200
            statusCode: "400",
            responseParameters: {
                'method.response.header.Content-Type': "'application/json'",
                'method.response.header.Access-Control-Allow-Origin': "'*'",
                'method.response.header.Access-Control-Allow-Credentials': "'true'"
            }
          }
        ]
      });
      // Añade el metodo post y dentro incluye a los metodos de respuesta del api gateway con encabezados CORS
      singEndpoint.addMethod('POST', IntegrationLambdaSign,{
        methodResponses:[
          {
           // Respuesta exitosa de la integración
            statusCode: '200',
          // Definir qué parámetros están permitidos o no
            responseParameters: {
              'method.response.header.Content-Type': true,
              'method.response.header.Access-Control-Allow-Origin': true,
              'method.response.header.Access-Control-Allow-Credentials': true
            }
          },
          {
            // Lo mismo para las respuestas de error
            statusCode: '400',
            responseParameters: {
              'method.response.header.Content-Type': true,
              'method.response.header.Access-Control-Allow-Origin': true,
              'method.response.header.Access-Control-Allow-Credentials': true
            }
          }
        ]
      });
      new cdk.CfnOutput(this, "Endpoint-crud", {
        exportName: "endpoint-root-para-comunicar-crud",
        value:`${props.stackName}-crud`,
      });
      new cdk.CfnOutput(this, "Endpoint-sign", {
        exportName: "endpoint-root-para-comunicar-sign",
        value:`${props.stackName}-sign`,
      });
    } 
}