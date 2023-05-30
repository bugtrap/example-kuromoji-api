import { App, Environment } from "aws-cdk-lib";

import { ApiStack } from "../lib/api-stack";

const env: Environment = {
    // CDK_DEFAULT_XX 環境変数は cdk コマンド実行時点の AWS サインイン状況を元に自動セットされる
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

new ApiStack(app, "KuromojiApiStack", {
    env,
});
