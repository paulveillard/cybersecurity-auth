const dotenv = require('dotenv')
dotenv.config()

const { awsCredentialsPath, useAccountId} = require('./params')
const ConfigParser = require('configparser')
const {
    getAccountRoleCredentials,
    getAccountRoles,
    getAccounts,
    getAccessToken,
    authorizeDevice,
    registerClient} = require("./aws")
const {error} = require("./util")
const config = new ConfigParser()

const updateCredentials = async () => {
    // search for credentials file first, default: ~/.aws/credentials
    try {
        await config.readAsync(awsCredentialsPath)
    } catch (e){
        error('cannot open file: ' + awsCredentialsPath)
    }

    // start authentication flow
    const { clientId, clientSecret } = await registerClient()
    // needs to the user to be fully logged in
    const { deviceCode, userCode } = await authorizeDevice(clientId, clientSecret)
    const { accessToken } = await getAccessToken(clientId, clientSecret, deviceCode, userCode)
    const { accountList } = await getAccounts(accessToken)

    for (const { accountId, accountName } of accountList) {
        const { roleList } = await getAccountRoles(accessToken, accountId)

        for (const { roleName } of roleList) {
            const { accessKeyId, secretAccessKey, sessionToken } = await getAccountRoleCredentials(accessToken, accountId, roleName)

            // default format is [account-name_AWSRoleName]
            const account_section_name = useAccountId ? accountId : accountName + '_' + roleName
            !config.sections().includes(account_section_name) ? config.addSection(account_section_name) : ''
            config.set(account_section_name, 'aws_access_key_id', accessKeyId)
            config.set(account_section_name, 'aws_secret_access_key', secretAccessKey)
            config.set(account_section_name, 'aws_session_token', sessionToken)
            console.log(config.items(account_section_name))
        }
    }

    // saves changes into credentials file
    config.write(awsCredentialsPath)
    console.log('credentials updated')

}

updateCredentials()