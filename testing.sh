#!/bin/bash

#curl -d "username=dax&password=secret" -X POST http://localhost:5000/requests
curl -d '{"email": "account@sample.com"}' -H "Content-Type: application/json" http://localhost:5000/create-user