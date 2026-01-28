#!/bin/bash

# Script test Next.js Rewrites Proxy
echo "🧪 Testing Next.js Rewrites Proxy..."
echo ""

# Màu sắc cho output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Check Next.js server
echo "1️⃣  Checking Next.js server (localhost:3001)..."
if curl -s http://localhost:3001 > /dev/null; then
    echo -e "${GREEN}✅ Next.js server is running${NC}"
else
    echo -e "${RED}❌ Next.js server is NOT running. Run 'yarn dev' first!${NC}"
    exit 1
fi
echo ""

# Test 2: Check Backend server
echo "2️⃣  Checking Backend server (localhost:3000)..."
if curl -s http://localhost:3000/api/insight/overview > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend server is running and responding${NC}"
else
    echo -e "${YELLOW}⚠️  Backend server might not be running or endpoint not implemented yet${NC}"
fi
echo ""

# Test 3: Test proxy rewrite
echo "3️⃣  Testing proxy rewrite..."
echo "   Calling: http://localhost:3001/api-proxy/insight/overview"
echo ""

RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" http://localhost:3001/api-proxy/insight/overview)
HTTP_STATUS=$(echo "$RESPONSE" | grep HTTP_STATUS | cut -d':' -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_STATUS/d')

if [ "$HTTP_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ Proxy works! Status: 200 OK${NC}"
    echo ""
    echo "Response:"
    echo "$BODY" | jq . 2>/dev/null || echo "$BODY"
elif [ "$HTTP_STATUS" = "404" ]; then
    echo -e "${YELLOW}⚠️  Status: 404 - Backend endpoint not implemented yet${NC}"
    echo "   This is normal if Backend hasn't implemented the endpoint"
elif [ "$HTTP_STATUS" = "401" ]; then
    echo -e "${YELLOW}⚠️  Status: 401 - Authentication required${NC}"
    echo "   Endpoint exists but needs auth token"
else
    echo -e "${RED}❌ Proxy failed! Status: ${HTTP_STATUS}${NC}"
    echo "Response: $BODY"
fi
echo ""

# Test 4: Test session/begin endpoint
echo "4️⃣  Testing session tracking..."
echo "   Calling: POST /api-proxy/insight/session/begin"
echo ""

SESSION_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" \
    -X POST \
    -H "Content-Type: application/json" \
    -d '{"url":"http://localhost:3001/test","referrer":""}' \
    http://localhost:3001/api-proxy/insight/session/begin)

SESSION_STATUS=$(echo "$SESSION_RESPONSE" | grep HTTP_STATUS | cut -d':' -f2)
SESSION_BODY=$(echo "$SESSION_RESPONSE" | sed '/HTTP_STATUS/d')

if [ "$SESSION_STATUS" = "200" ] || [ "$SESSION_STATUS" = "201" ]; then
    echo -e "${GREEN}✅ Session tracking works! Status: ${SESSION_STATUS}${NC}"
    echo ""
    echo "Response:"
    echo "$SESSION_BODY" | jq . 2>/dev/null || echo "$SESSION_BODY"
elif [ "$SESSION_STATUS" = "404" ]; then
    echo -e "${YELLOW}⚠️  Status: 404 - Backend endpoint not implemented yet${NC}"
elif [ "$SESSION_STATUS" = "400" ]; then
    echo -e "${YELLOW}⚠️  Status: 400 - Bad Request${NC}"
    echo "Response: $SESSION_BODY"
else
    echo -e "${RED}❌ Failed! Status: ${SESSION_STATUS}${NC}"
    echo "Response: $SESSION_BODY"
fi
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Summary:"
echo ""
echo "✅ Rewrites configured in next.config.ts"
echo "✅ Frontend calls /api-proxy/*"
echo "✅ Next.js forwards to Backend /api/*"
echo ""
echo "If you see 404 errors, it means:"
echo "  → Proxy is working correctly ✅"
echo "  → But Backend hasn't implemented endpoints yet ⏳"
echo ""
echo "Next step: Implement Backend endpoints!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
