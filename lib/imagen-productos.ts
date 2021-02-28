import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import * as s3 from "@aws-cdk/aws-s3";
import * as iam from '@aws-cdk/aws-iam';
import { Effect } from "@aws-cdk/aws-iam";

export class ImagenProductos extends cdk.Construct{
  // Permite acceder a la funcion lambda crud que se crea dentro del construct
  public readonly lambdaSign: lambda.Function;
  // Constructor de la clase
  constructor(scope: cdk.Construct,id:string){
     super(scope,id);
    // ========================================================================
    // Resource: Bucket s3
    // ========================================================================
    // Asigna un nombre al bucket que maneja las imagenes de los productos
    const bucketImgName = "bucket-cdk-imagenes-nicotobo";
    // bucket que contiene las imagenes de las imagenes de los productos
    const bucketImg = new s3.Bucket(this,"bucket-imagenes",{
        bucketName: bucketImgName,
        // elimina el bucket s3 junto con el stack 
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        // permite el acceso publico de los acl´s
        blockPublicAccess:new s3.BlockPublicAccess({
           blockPublicAcls: false,
           ignorePublicAcls: false, 
        }),
        // permite el acceso publico con reglas de CORS
        cors:[
            {
                allowedHeaders: ["*"],
                allowedMethods: [s3.HttpMethods.GET,s3.HttpMethods.PUT,s3.HttpMethods.POST, s3.HttpMethods.DELETE, s3.HttpMethods.HEAD],
                allowedOrigins: ["*"],
            }
        ]
     });
     // ========================================================================
     // Resource: Lambda Function
     // ========================================================================
     // Define un recurso lambda y lo asigna al atributo de la clase
     this.lambdaSign = new lambda.Function(this, "lambda-function-sign",{
       functionName: "lambda-cdk-images-sign",
       runtime: lambda.Runtime.NODEJS_14_X, //Ambiente de ejecucion
       code: lambda.Code.fromAsset("lambda"), // codigo cargado de un directorio lambda
       handler: "lambda-function-sign.handler", // el archivo es lambda-function-crud, la funcion en "handler"
       environment:{
         bucket: bucketImg.bucketName
        } 
      });
      // Le da permisos a la funcion lambda para poner imagenes, retirarlas y poner objetos por medio de un ACL
     this.lambdaSign.addToRolePolicy(new iam.PolicyStatement({
      actions: ["s3:GetObject","s3:PutObjectAcl","s3:PutObject"],
      resources: [`arn:aws:s3:::${bucketImgName}/*`],
      effect: Effect.ALLOW
      }))
    }
}