import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import * as dynamodb from "@aws-cdk/aws-dynamodb";

export class CrudProductos extends cdk.Construct{
    // permite acceder a la funcion lambda crud que se crea dentro del construct
    public readonly lambdaCrud: lambda.Function;
    // Constructor de la clase
    constructor(scope: cdk.Construct,id:string){
       super(scope,id);
       // define un recurso lambda y lo asigna al atributo de la clase
       this.lambdaCrud = new lambda.Function(this, "LambdaFunctionCrud",{
           functionName: "lambda-cdk-products-crud",
           runtime: lambda.Runtime.NODEJS_14_X, //Ambiente de ejecucion
           code: lambda.Code.fromAsset("lambda"), // codigo cargado de un directorio lambda
           handler: "lambda-function-crud.handler" // el archivo es lambda-function-crud, la funcion en "handler"
        });
       // Define el nombre de la tabla
       const tName= "dynamodb-cdk-nicotobo";
       //Crea la tabla
       const table = new dynamodb.Table(this,"dynamoProducts",{
        // Asigna a la dynamo el nombre definido
        tableName: tName,
        // define la PK
        partitionKey: {name:"id", type: dynamodb.AttributeType.STRING },
        // The default removal policy is RETAIN, which means that cdk destroy will not attempt to delete
        // the new table, and it will remain in your account until manually deleted. By setting the policy to 
        // DESTROY, cdk destroy will delete the table (even if it has data in it)
        removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT recommended for production code
       });
      // da permisos de lectura/escritura de la funcion a la lambda
      table.grantReadWriteData(this.lambdaCrud);
    }
}