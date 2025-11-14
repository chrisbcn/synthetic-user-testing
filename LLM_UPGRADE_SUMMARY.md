# LLM Upgrade Summary - Interview Quality Improvements

## Issues Identified

1. **Outdated Models**: Using Claude 3 Haiku (March 2024) - very old and limited
2. **Shallow Responses**: Prompt limited to "2-4 sentences" making interviews shallow
3. **Poor Speaker Distinction**: Conversation history built as plain strings, losing structure
4. **Missing Interviewer Context**: Interviewer name/details not used in prompts
5. **Wrong API Format**: Using `generateText` instead of Messages API with proper roles

## Improvements Made

### 1. Model Upgrades

**Before:**
- Interview responses: `claude-3-haiku-20240307` (March 2024)
- Question suggestions: `claude-3-haiku-20240307`
- Analysis: `claude-3-5-sonnet-20241022` (October 2024)

**After:**
- Interview responses: `claude-3-7-sonnet-20250219` (Latest Claude 3.7 Sonnet)
- Question suggestions: `claude-3-7-sonnet-20250219`
- Analysis: `claude-3-5-sonnet-20241022` (Keep for now, can upgrade later)

**Benefits:**
- Much better reasoning and conversation quality
- Better understanding of context and nuance
- More natural, in-depth responses

### 2. Proper Messages API Format

**Before:**
```typescript
// Simple string concatenation
conversationContext = conversationHistory
  .map(turn => `${speaker}: ${turn.message}`)
  .join("\n")
```

**After:**
```typescript
// Proper Messages API format with roles
messages: [
  { role: "user", content: "Sophia Chen-Laurent: How's your day going?" },
  { role: "assistant", content: "It's been great, thanks for asking..." },
  { role: "user", content: "Sophia Chen-Laurent: Tell me about..." }
]
```

**Benefits:**
- Clear speaker distinction maintained throughout conversation
- Model understands who said what
- Better context retention

### 3. Interviewer Context Integration

**Before:**
- Interviewer name/details not included
- Generic "Researcher" label used

**After:**
- Interviewer name included: "Sophia Chen-Laurent"
- Interviewer specialization included: "Luxury Fashion & Consumer Psychology"
- Interviewer style included in system prompt
- Interviewer name used in message labels

**Benefits:**
- More personalized, realistic conversations
- Persona can reference interviewer by name
- Better understanding of interviewer expertise

### 4. Deeper, More In-Depth Responses

**Before:**
- Prompt: "SUBSTANTIVE but CONCISE - 2-4 sentences"
- max_tokens: 1000

**After:**
- Prompt: "Be SUBSTANTIVE and THOROUGH - provide detailed, thoughtful responses (3-8 sentences typically)"
- max_tokens: 2000
- Temperature: 0.7 (more natural conversation)

**Benefits:**
- Much more detailed, thoughtful responses
- Better examples and elaboration
- More realistic interview depth

### 5. Enhanced System Prompt

**Added:**
- Core personality traits
- Communication style
- Interviewer details and style
- Better examples (good vs bad responses)
- Instructions for depth and engagement

## Model Comparison: Claude vs Gemini/Vertex

### Claude 3.7 Sonnet (Recommended ✅)

**Pros:**
- Best for conversational AI and interviews
- Excellent reasoning and context understanding
- Strong personality consistency
- Great at maintaining character
- Extended context window (200K tokens)
- Better at following complex instructions

**Cons:**
- Slightly more expensive than Gemini
- No multimodal (but not needed for interviews)

**Cost:** ~$3 per 1M input tokens, ~$15 per 1M output tokens

### Gemini 2.0 Flash / Vertex AI

**Pros:**
- Very fast responses
- Lower cost
- Good for simple tasks
- Multimodal capabilities (not needed here)

**Cons:**
- Less sophisticated reasoning
- May struggle with maintaining persona consistency
- Less natural conversation flow
- Not as good at following complex character instructions

**Cost:** ~$0.075 per 1M input tokens, ~$0.30 per 1M output tokens

### Recommendation

**Stick with Claude 3.7 Sonnet** because:
1. Interview quality is paramount - Claude excels here
2. Persona consistency is critical - Claude maintains character better
3. The cost difference is worth it for quality
4. Better at understanding nuanced instructions
5. More natural conversation flow

**Consider Gemini/Vertex only if:**
- Cost becomes a major concern
- You need faster response times (though Claude is fast enough)
- You add multimodal features later

## Testing Checklist

- [ ] Test with existing personas to verify improved depth
- [ ] Verify speaker distinction works correctly
- [ ] Check that interviewer names appear correctly
- [ ] Test with longer conversations (10+ turns)
- [ ] Verify responses are 3-8 sentences (not too short)
- [ ] Check that persona consistency is maintained
- [ ] Test error handling with new API format

## Next Steps

1. **Deploy and test** the upgraded interview route
2. **Monitor response quality** - are interviews more in-depth?
3. **Check speaker distinction** - can you clearly tell who said what?
4. **Consider upgrading analysis route** to Claude 3.7 Sonnet as well
5. **A/B test** if needed to compare old vs new

## Rollback Plan

If issues arise, you can rollback by:
```bash
git revert <commit-hash>
```

Or manually change model back to:
- `claude-3-haiku-20240307` for interviews
- Revert to `generateText` API if needed

