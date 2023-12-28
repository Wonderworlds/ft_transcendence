#!/bin/bash
	/bin/bash -ec 'yarn --cwd backend && yarn --cwd backend run start:dev &'
	/bin/bash -ec 'yarn --cwd frontend && yarn --cwd frontend dev'