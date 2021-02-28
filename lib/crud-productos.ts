import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import * as dynamodb from "@aws-cdk/aws-dynamodb";

export class CrudProductos extends cdk.Construct{
    // permite acceder a la funcion lambda crud que se crea dentro del construct
    public readonly lambdaCrud: lambda.Function;
    // Constructor de la clase
    constructor(scope: cdk.Construct,id:string){
       super(scope,id);
       // ========================================================================
       // Resource: Lambda Function
       // ========================================================================
       // define un recurso lambda y lo asigna al atributo de la clase
       this.lambdaCrud = new lambda.Function(this, "LambdaFunctionCrud",{
           functionName: "lambda-cdk-products-crud",
           runtime: lambda.Runtime.NODEJS_14_X, //Ambiente de ejecucion
           code: lambda.Code.fromAsset("lambda"), // codigo cargado de un directorio lambda
           handler: "lambda-function-crud.handler" // el archivo es lambda-function-crud, la funcion en "handler"
        });
       // ========================================================================
       // Resource: Dynamo DB Table
       // ========================================================================
       // Define el nombre de la tabla
       const tName= "dynamodb-cdk-nicotobo";
       //Crea la tabla
       const table = new dynamodb.Table(this,"dynamoProducts",{
        // Asigna a la dynamo el nombre definido
        tableName: tName,
        // define la PK
        partitionKey: {name:"id", type: dynamodb.AttributeType.STRING },
        // La política de eliminación predeterminada es RETAIN, lo que significa que cdk destroy no intentará eliminar
        // la nueva tabla, y permanecerá en su cuenta hasta que se elimine manualmente. Al establecer la política en
        // DESTROY, cdk destroy eliminará la tabla (incluso si tiene datos)
        removalPolicy: cdk.RemovalPolicy.DESTROY, // NO recomendado para el código de producción
       });
      // da permisos de lectura/escritura de la funcion a la lambda
      table.grantReadWriteData(this.lambdaCrud);
      new cdk.CfnOutput(this, "dynamodb-name", {
        value:`${table.tableName}`,
      });
    }
}