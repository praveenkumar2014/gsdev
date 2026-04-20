# Agent Editor Chart Implementation

## Issue

User reported not seeing any chart under the agent editor related screen after the app loads.

## Investigation

1. Scanned the codebase for chart/visualization components
2. Found `MermaidBlock` component for rendering mermaid diagrams
3. Found `AgentMessageUsage` component showing token usage as text (not a chart)
4. No traditional chart libraries (recharts, chartjs, etc.) were found in the agent features

## Solution

Created a new `AgentUsageChart` component to visualize token usage as a bar chart:

- Shows input vs output tokens as a horizontal bar chart
- Blue segment for input tokens
- Purple segment for output tokens
- Displays token counts as text labels
- Integrated into assistant message display alongside existing text-based usage indicator

## Files Modified

1. **Created:** `src/renderer/features/agents/ui/agent-usage-chart.tsx`

   - New component for visualizing token usage as a chart

2. **Modified:** `src/renderer/features/agents/ui/agent-message-usage.tsx`

   - Added export for `AgentUsageChart`

3. **Modified:** `src/renderer/features/agents/main/assistant-message-item.tsx`

   - Imported `AgentUsageChart`
   - Added chart display next to existing text-based usage indicator

## Chart Location

The chart now appears in the agent editor under each assistant message that has token usage metadata, displayed as:

- A horizontal bar showing the proportion of input vs output tokens
- Text labels showing actual token counts
- Located next to the existing token count badge

## Testing

- GSDEV is running on <http://localhost:5173>
- Chart component has been integrated
- Will be visible when agent messages include token usage metadata (inputTokens, outputTokens)
