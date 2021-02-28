import * as cdk from '@aws-cdk/core';
import {CrudProductos} from "./crud-productos";
import {ImagenProductos} from "./imagen-productos";
import {ApiGatewayCdk} from "./api-gateway-cdk";
import {CognitoCdk} from "./cognito-cdk";
import {CloudfrontWafCdk} from "./cloudfront-waf-cdk";

export class AppTiendaNicotoboCdkStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    // nombre del stack
    const pStackName = 'app-cdk-nicotobo';
    // Componente que realiza el crud de los productos
    const crudProductos = new CrudProductos(this,"crud-productos");
    // Componente que sube imagenes de los productos
    const imagenProductos = new ImagenProductos(this,"imagenes-productos");
    // Componente que sube el apigateway de la aplicacion
    new ApiGatewayCdk(this,"api-gateway-cdk",{
      functionCrud: crudProductos.lambdaCrud,
      functionImg: imagenProductos.lambdaSign,
      stackName: pStackName
    });
    // Componente que crea el userpool de Cognito
    new CognitoCdk(this,"cognito-productos");
    // Componente que crea CDN y WAF
    new CloudfrontWafCdk(this,"Waf-Cloudfront-productos");
  }
}
