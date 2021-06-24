# ¡Bienvenido a cdk-tienda-natobo! 🚀

_Esta es una aplicación que despliega un backend serverless, un CDN del front desde un bucket s3 especificado y una capa de segruidad del servicio de WAF de AWS. La aplicación esta desarrollada con el framework CDK de AWS y hace parte de la instancia del stack (`AppTiendaNicotoboCdkStack`)_

El arichivo `cdk.json` explica como ejecutar la instalación.

## Comandos útiles ⚙️

 * `npm run build`   Compilar typescript a javascript
 * `npm run watch`   estar atento a los cambios y compilar
 * `npm run test`    realiza las pruebas unitarias (no implementadas)
 * `cdk deploy`      desplegar el stack en su cuenta / región predeterminada de AWS
 * `cdk diff`        compara la pila desplegada con el estado actual
 * `cdk synth`       emite la plantilla CloudFormation sintetizada

# Introducción 📋
Este proyecto se desarrollo con el fin de crear un CRUD básico de una tienda con servicios de AWS y para aprender a utilizar el framework CDK. Dentro del proyecto se utilizan los siguientes productos de AWS:
* Api gateway
* Lambda functions
* Cloudfront
* WAF
* S3
* Cognito
* DynamoDB
* IAM

# Pasos para realizar el despliegue de toda la arquitectura 📦

- Verificar que se tiene [Node.js](https://nodejs.org) mínimo versión 10.14 o más alta

    ```bash
    # determinar version de node
    node --version
    ```

- Clonar el repositorio

    ```bash
    git clone https://github.com/natobo/cdk-tienda-natobo
    ```

- Dentro de la terminal, navegar a `cdk-tienda-natobo/`

    ```bash
    cd cdk-tienda-natobo
    ```
- Instalar módulos con npm

    ```bash
     npm install
    ```
 - Asegurarse de tener bien las [credenciales de AWS](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html) en el archivo  `.aws/credentials` y 
correr el siguiente comando en consola:
    ```bash
    cdk deploy
    ```
    
## Lecturas talleres relacionados 📖
- [CDK Workshop](https://cdkworkshop.com/)
- [cloudformation Workshop](https://cfn101.workshop.aws/)
