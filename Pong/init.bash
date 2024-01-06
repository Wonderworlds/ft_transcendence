#!/bin/bash
	/bin/bash -ec 'mkdir backend/secrets'
	/bin/bash -ec 'openssl genpkey -algorithm RSA -out backend/secrets/private-key.pem'
	/bin/bash -ec 'openssl req -new -key backend/secrets/private-key.pem -x509 -subj "/C=FR/ST=IDF/L=Paris/O=42/OU=42/CN=Transcendence/UID=Transcendence" -out backend/secrets/public-certificate.pem'
	/bin/bash -ec 'yarn install'
	/bin/bash -ec 'yarn --cwd backend run start:dev &'
	/bin/bash -ec 'yarn --cwd frontend dev'