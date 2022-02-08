// env variables
const os = require("os")

module.exports = Object.freeze({
    startUrl: process.env.SSO_URL ?? error('please set the sso default url'),
    awsCredentialsPath: process.env.AWS_CREDENTIALS_PATH ?? `${os.homedir()}/.aws/credentials`,
    useAccountId: process.env.USE_ACCOUNT_ID === 'true',
    sso_accounts: process.env.ACCOUNTS?.split(','),
    region: process.env.REGION ?? 'us-east-1',
    clientName: os.hostname()
});
