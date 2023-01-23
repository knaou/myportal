#!/bin/sh
export APP_BIND=${APP_BIND:-127.0.0.1}
export APP_PORT=${APP_PORT:-5000}
exec uvicorn --host "${APP_BIND}" --port "${APP_PORT}" main:app
