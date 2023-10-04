#!/bin/bash
	/bin/bash -ec 'yarn --cwd backend && yarn --cwd backend run start:dev &'
	sleep 3
	/bin/bash -ec 'yarn --cwd frontend && yarn --cwd frontend dev'