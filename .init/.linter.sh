#!/bin/bash
cd /tmp/kavia/workspace/code-generation/note-keeper-2457-2466/frontend_web
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

