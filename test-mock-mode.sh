#!/bin/bash

echo "🧪 Testing MOCK MODE"
echo "===================="
echo ""

# Test AI parse endpoint
echo "📤 Sending test request to AI parser..."
echo ""

RESPONSE=$(curl -s -X POST http://localhost:3001/api/ai/parse \
  -H "Content-Type: application/json" \
  -d '{"text":"купил кофе 25 и круассан 15"}')

echo "$RESPONSE" | python3 -c "import sys, json; print(json.dumps(json.loads(sys.stdin.read()), indent=2, ensure_ascii=False))" 2>/dev/null || echo "$RESPONSE"

echo ""
echo "✅ Check backend logs for '🧪 MOCK MODE ENABLED' message"

