#!/usr/bin/python
import sys
import hashlib
import os

in_user = sys.argv[1]
in_password = sys.argv[2]
in_password = hashlib.sha256(in_password.encode("utf-8")).hexdigest()
f = open('users.db', 'w+')
new_line = in_user + ":" + in_password
if os.path.getsize("users.db") > 0:
    f.write("\n" + new_line)
else:
    f.write(new_line)
f.close()
