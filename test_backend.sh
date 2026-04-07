#!/bin/bash

# Kill any existing servers
pkill -f "node.*server.js" || true
sleep 1

# Start the backend
echo "Starting backend server..."
cd /Users/yashbaing/Downloads/booking-system/backend
node server.js > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

sleep 2

# Test the API
echo ""
echo "Testing API endpoint..."
RESPONSE=$(curl -s http://localhost:5000/bookings)
echo "Response: $RESPONSE"

if [ -z "$RESPONSE" ]; then
  echo "❌ API not responding"
  echo "Backend logs:"
  cat /tmp/backend.log
else
  echo "✅ API responding successfully"
fi
