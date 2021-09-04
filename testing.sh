#!/bin/bash

#curl -d "username=dax&password=secret" -X POST http://localhost:5000/requests
curl -d '{"notification": {"title": "Sample", "body": "Testing"},"deviceToken":"fM0lSaCITpGi4o7VFgmiwK:APA91bFmXaaOOXXdc4dEVEXMHUcMdJVzF6ki1Xcucvhn82wy142JmVQUtAGus3jS-qPkZDB1mKdGTYGYsaaM97bmObzKYzSQT0GGkg4Xp-rLGIytHF_ZMq9S8mSNzvvcKLrBKh9ugi9P"}' -H "Content-Type: application/json" http://localhost:5000/notification