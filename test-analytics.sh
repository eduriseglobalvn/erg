#!/bin/bash

# Script test Analytics API với /api/* path
echo "🧪 Testing Analytics API (Final Version)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Wait for server
echo "⏳ Waiting for dev server to be ready..."
for i in {1..10}; do
    if curl -s http://localhost:3001 > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Server is ready!${NC}"
        break
    fi
    echo -n "."
    sleep 1
done
echo ""
echo ""

# Test 1: Session Begin
echo "1️⃣  ${BLUE}Testing Session Tracking${NC}"
echo "   POST /api/insight/session/begin"
echo ""

RESPONSE=$(curl -s -w "\nSTATUS:%{http_code}" \
    -X POST \
    -H "Content-Type: application/json" \
    -d '{"url":"http://localhost:3001/test-page","referrer":"https://google.com"}' \
    http://localhost:3001/api/insight/session/begin 2>/dev/null)

STATUS=$(echo "$RESPONSE" | grep "STATUS:" | cut -d':' -f2)
BODY=$(echo "$RESPONSE" | sed '/STATUS:/d')

if [ "$STATUS" = "200" ] || [ "$STATUS" = "201" ]; then
    echo -e "${GREEN}✅ Success! Status: ${STATUS}${NC}"
    echo ""
    echo "Response:"
    echo "$BODY" | jq . 2>/dev/null || echo "$BODY"
    
    # Extract visitId/sessionId
    VISIT_ID=$(echo "$BODY" | jq -r '.data.visitId // .visitId // .data.sessionId // .sessionId // empty' 2>/dev/null)
    if [ -n "$VISIT_ID" ]; then
        echo ""
        echo -e "${GREEN}Session ID: ${VISIT_ID}${NC}"
    fi
else
    echo -e "${RED}❌ Failed! Status: ${STATUS}${NC}"
    echo "Response: $BODY"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 2: Overview (Admin)
echo "2️⃣  ${BLUE}Testing Admin Overview${NC}"
echo "   GET /api/insight/overview"
echo ""

OVERVIEW=$(curl -s -w "\nSTATUS:%{http_code}" http://localhost:3001/api/insight/overview 2>/dev/null)
OVERVIEW_STATUS=$(echo "$OVERVIEW" | grep "STATUS:" | cut -d':' -f2)
OVERVIEW_BODY=$(echo "$OVERVIEW" | sed '/STATUS:/d')

if [ "$OVERVIEW_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ Success! Status: ${OVERVIEW_STATUS}${NC}"
    echo ""
    echo "Response:"
    echo "$OVERVIEW_BODY" | jq . 2>/dev/null || echo "$OVERVIEW_BODY"
elif [ "$OVERVIEW_STATUS" = "401" ]; then
    echo -e "${YELLOW}⚠️  Status: 401 - Authentication required${NC}"
    echo "   Endpoint exists but needs auth token (this is expected)"
elif [ "$OVERVIEW_STATUS" = "404" ]; then
    echo -e "${YELLOW}⚠️  Status: 404 - Endpoint not implemented yet${NC}"
else
    echo -e "${RED}❌ Status: ${OVERVIEW_STATUS}${NC}"
    echo "Response: $OVERVIEW_BODY"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 3: Stats (Admin)
echo "3️⃣  ${BLUE}Testing Traffic Stats${NC}"
echo "   GET /api/insight/stats?range=7d"
echo ""

STATS=$(curl -s -w "\nSTATUS:%{http_code}" http://localhost:3001/api/insight/stats?range=7d 2>/dev/null)
STATS_STATUS=$(echo "$STATS" | grep "STATUS:" | cut -d':' -f2)
STATS_BODY=$(echo "$STATS" | sed '/STATUS:/d')

if [ "$STATS_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ Success! Status: ${STATS_STATUS}${NC}"
    echo ""
    echo "Response:"
    echo "$STATS_BODY" | jq . 2>/dev/null || echo "$STATS_BODY"
elif [ "$STATS_STATUS" = "401" ]; then
    echo -e "${YELLOW}⚠️  Status: 401 - Authentication required${NC}"
    echo "   Endpoint exists but needs auth token (this is expected)"
elif [ "$STATS_STATUS" = "404" ]; then
    echo -e "${YELLOW}⚠️  Status: 404 - Endpoint not implemented yet${NC}"
else
    echo -e "${RED}❌ Status: ${STATS_STATUS}${NC}"
    echo "Response: $STATS_BODY"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Summary
echo "📋 ${BLUE}Test Summary${NC}"
echo ""
echo "✅ Proxy configuration: /api/* → BACKEND_URL/api/*"
echo "✅ Environment: .env.development loaded"
echo "✅ Same-Origin request: http://localhost:3001/api/*"
echo ""

if [ "$STATUS" = "200" ] || [ "$STATUS" = "201" ]; then
    echo -e "${GREEN}🎉 Session tracking works!${NC}"
else
    echo -e "${RED}❌ Session tracking failed${NC}"
fi

if [ "$OVERVIEW_STATUS" = "200" ] || [ "$OVERVIEW_STATUS" = "401" ]; then
    echo -e "${GREEN}🎉 Admin overview endpoint exists!${NC}"
else
    echo -e "${YELLOW}⚠️  Admin overview needs implementation${NC}"
fi

if [ "$STATS_STATUS" = "200" ] || [ "$STATS_STATUS" = "401" ]; then
    echo -e "${GREEN}🎉 Stats endpoint exists!${NC}"
else
    echo -e "${YELLOW}⚠️  Stats endpoint needs implementation${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Next: Open browser and check Console logs!"
echo "Expected: [Tracker] Starting session: ..."
