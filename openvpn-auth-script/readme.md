# OpenVPN auth script

Hi! This is Python scripts for enable password authentication on your own openVPN server. Its uses file to save credentials.

# Setup

Set the server.conf parameters like this: 
	
    verify-client-cert none
    script-security 2
    username-as-common-name
    auth-user-pass-verify "/etc/openvpn/auth.py" via-file

## Create files and folders

Clone this repo into your OpenVPN configuration folder:

    git clone  https://github.com/kenteg/openvpn-auth-script /etc/openvpn/
 Don't forget grant access for scripts!
 Create new user by adduser.py script:

     ./adduser.py username password
Will be created file users.db containing username:hashedpassword
## Setup Client
In you **client.ovpn** add line:

    auth-user-pass

password will be automatically requested
or
you can create file **pass.txt**, where will be store credentials in format:
`username  
password`

and set path to file in client config: 
 `auth-user-pass c:\\vpn\\pass.txt`
