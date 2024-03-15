#!/bin/bash

# script generates the alertmanager.yml file and starts the process

envsubst < alertmanager.yml.tpl > alertmanager.yml

/bin/alertmanager --config.file=/etc/alertmanager.yml