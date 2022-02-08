#!/usr/bin/python
import sys
import hashlib

tmpFile = open(sys.argv[1], 'r')
lines = tmpFile.readlines()
input_user = lines[0].strip()
input_pass = lines[1].strip().encode("utf-8")
input_pass = hashlib.sha256(input_pass).hexdigest()
f = open('users.db', 'r')
for line in f:
    line = line.strip()
    array = line.split(":")
    user = array[0]
    password = array[1]
    if user == input_user:
        if password == input_pass:
            print("auth success! ")
            sys.exit(0)
print("epic fail")
sys.exit(1)