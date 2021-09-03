#!/bin/bash

curl -d "username=dax" -X POST http://localhost:5000/requests
#curl -d '{"name": "dax"}' -H "Content-Type: application/json" http://localhost:5000/requests