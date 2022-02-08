const open = require('open');
const {waitForInput} = require("./util");

const { startUrl, region, clientName } = require('./params')

const { SSOClient, ListAccountsCommand, ListAccountRolesCommand, GetRoleCredentialsCommand } = require("@aws-sdk/client-sso");
const { SSOOIDCClient, RegisterClientCommand, StartDeviceAuthorizationCommand, CreateTokenCommand } = require("@aws-sdk/client-sso-oidc");

const clientSso = new SSOClient({ region: region });
const clientDevice = new SSOOIDCClient({ region: region });

exports.registerClient = async () => {
    const registerClientCommand = new RegisterClientCommand({ clientName: clientName, clientType: 'public' })
    return await clientDevice.send(registerClientCommand)
}

exports.authorizeDevice = async (clientId, clientSecret) => {
    const startDeviceAuthorizationCommand = new StartDeviceAuthorizationCommand({
        clientId: clientId, clientSecret: clientSecret, startUrl: startUrl
    })
    const { verificationUri, deviceCode, userCode } = await clientDevice.send(startDeviceAuthorizationCommand)

    open(`${verificationUri}?user_code=${userCode}`)
    await waitForInput('After login in press a key...')

    return {
        deviceCode: deviceCode,
        userCode: userCode
    }
}

exports.getAccessToken = async (clientId, clientSecret, deviceCode, userCode) => {
    const createTokenCommand = new CreateTokenCommand({
        clientId: clientId,
        clientSecret: clientSecret,
        grantType: 'urn:ietf:params:oauth:grant-type:device_code',
        deviceCode: deviceCode,
        code: userCode
    })
    return await clientDevice.send(createTokenCommand)
}

exports.getAccounts = async (accessToken) => {
    const listAccountsCommand = new ListAccountsCommand({ accessToken: accessToken })
    return await clientSso.send(listAccountsCommand)
}

exports.getAccountRoles = async (accessToken, accountId) => {
    const listAccountRolesCommand = new ListAccountRolesCommand({accessToken: accessToken, accountId: accountId})
    return await clientSso.send(listAccountRolesCommand)
}

exports.getAccountRoleCredentials = async (accessToken, accountId, roleName) => {
    const getRoleCredentialsCommand = new GetRoleCredentialsCommand({
        accessToken: accessToken, accountId: accountId, roleName: roleName
    })
    const { roleCredentials } = await clientSso.send(getRoleCredentialsCommand)
    return roleCredentials
}

