#!/bin/sh
export APP_HOST=${APP_HOST:-127.0.0.1}
export APP_PORT=${APP_PORT:-5000}
mo /etc/nginx/nginx.template.conf > /etc/nginx/nginx.conf
exec nginx -g "daemon off;"
