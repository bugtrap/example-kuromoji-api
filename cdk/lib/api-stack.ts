import { join } from "path";

import { CfnOutput, Duration, Stack, StackProps } from "aws-cdk-lib";
import {
    AccessLogFormat,
    Cors,
    EndpointType,
    JsonSchemaType,
    LambdaIntegration,
    LogGroupLogDestination,
    RestApi,
} from "aws-cdk-lib/aws-apigateway";
import { Code, Function, LayerVersion, Runtime } from "aws-cdk-lib/aws-lambda";
import { LogGroup, RetentionDays } from "aws-cdk-lib/aws-logs";
import { Construct } from "constructs";

export class ApiStack extends Stack {
    constructor(scope?: Construct, id?: string, props?: StackProps) {
        super(scope, id, props);

        const appProjectDir = join(__dirname, "../../app/");

        const nodeModuleLayer = new LayerVersion(this, "NodeModule", {
            code: Code.fromAsset(join(appProjectDir, "dist-layer")),
            compatibleRuntimes: [Runtime.NODEJS_18_X],
        });
        const app = new Function(this, "App", {
            runtime: Runtime.NODEJS_18_X,
            memorySize: 600,
            timeout: Duration.seconds(30),
            code: Code.fromAsset(join(appProjectDir, "dist")),
            handler: "index.handler",
            layers: [nodeModuleLayer],
            environment: {
                KUROMOJIN_DIC_PATH: "/opt/nodejs/node_modules/kuromoji/dict",
            },
        });

        const logGroup = new LogGroup(this, "KuromojiApiLog", {
            retention: RetentionDays.ONE_MONTH,
        });

        const api = new RestApi(this, "KuromojiApi", {
            endpointTypes: [EndpointType.REGIONAL],
            deploy: true,
            deployOptions: {
                stageName: "v1",
                accessLogDestination: new LogGroupLogDestination(logGroup),
                accessLogFormat: AccessLogFormat.jsonWithStandardFields(),
            },
        });

        // API 実行プラン
        const plan = api.addUsagePlan("BasicPlan", {
            name: "KuromojiApiBasicPlan",
            throttle: {
                // 秒間リクエスト数
                rateLimit: 10,
                // レート超過可能な秒数
                burstLimit: 2,
            },
        });
        plan.addApiStage({ stage: api.deploymentStage });

        // API キー生成
        const apiKey = api.addApiKey("Key1");
        plan.addApiKey(apiKey);

        const tokenizeRequestModel = api.addModel("TokenizeRequestModel", {
            modelName: "TokenizeRequestModel",
            contentType: "application/json",
            schema: {
                type: JsonSchemaType.OBJECT,
                properties: {
                    text: {
                        type: JsonSchemaType.STRING,
                    },
                },
                required: ["text"],
            },
        });

        const tokenizeResponseModel = api.addModel("TokenizeResponseModel", {
            modelName: "TokenizeResponseModel",
            contentType: "application/json",
            schema: {
                type: JsonSchemaType.OBJECT,
                properties: {
                    text: {
                        type: JsonSchemaType.STRING,
                    },
                    words: {
                        type: JsonSchemaType.ARRAY,
                        items: {
                            type: JsonSchemaType.OBJECT,
                            properties: {
                                word_id: { type: JsonSchemaType.INTEGER },
                                word_type: { type: JsonSchemaType.STRING },
                                word_position: { type: JsonSchemaType.INTEGER },
                                surface_form: { type: JsonSchemaType.STRING },
                                pos: { type: JsonSchemaType.STRING },
                                pos_detail_1: { type: JsonSchemaType.STRING },
                                pos_detail_2: { type: JsonSchemaType.STRING },
                                pos_detail_3: { type: JsonSchemaType.STRING },
                                conjugated_type: { type: JsonSchemaType.STRING },
                                conjugated_form: { type: JsonSchemaType.STRING },
                                basic_form: { type: JsonSchemaType.STRING },
                                reading: { type: JsonSchemaType.STRING },
                                pronunciation: { type: JsonSchemaType.STRING },
                            },
                        },
                    },
                },
            },
        });

        const validator = api.addRequestValidator("ValidateBody", {
            requestValidatorName: "ValidateBody",
            validateRequestParameters: false,
            validateRequestBody: true,
        });

        // API: POST /kuromoji/tokenize
        const resKuromoji = api.root.addResource("kuromoji");
        const resTokenize = resKuromoji.addResource("tokenize");
        resTokenize.addMethod(
            "POST",
            new LambdaIntegration(app, {
                proxy: true,
            }),
            {
                apiKeyRequired: true,
                operationName: "tokenizeSentence",
                requestValidator: validator,
                requestModels: {
                    "application/json": tokenizeRequestModel,
                },
                methodResponses: [
                    {
                        statusCode: "200",
                        responseModels: {
                            "application/json": tokenizeResponseModel,
                        },
                    },
                ],
            }
        );

        resTokenize.addCorsPreflight({
            allowMethods: ["POST"],
            allowOrigins: Cors.ALL_ORIGINS,
            allowHeaders: Cors.DEFAULT_HEADERS,
        });

        new CfnOutput(this, "ApiUrl", {
            value: `${api.url}kuromoji/tokenize`,
        });
    }
}
