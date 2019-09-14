#!/bin/bash

/app/bin/wait-for-it.sh -t 0 auth-api:80

if [ $NODE_ENV = "development" ]; then
  npm run start:dev
else
  npm run start
fi
