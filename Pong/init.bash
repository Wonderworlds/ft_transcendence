#!/bin/bash
	/bin/bash -ec 'yarn --cwd backend/ run start:dev &'
	sleep 5
	/bin/bash -ec 'yarn --cwd frontend/ dev'