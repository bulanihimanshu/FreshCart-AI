# Discussion Log - Phase 02: EDA & Preprocessing

**Date:** 2026-04-11

## Q&A Audit Trail

### EDA Depth & Visuals
- **Q:** Do you want to add specific charts geared toward your university report?
- **User Selection:** "choose charts according to you"
- **Decision:** the agent's Discretion.

### Item Sequence Strategy
- **Q:** Should we use a fixed window or full sequences with padding?
- **User Selection:** "take full sequences"
- **Decision:** Use full sequences with padding.

### Vocabulary Selection
- **Q:** Should we select products by Total Frequency or Reorder Frequency?
- **User Selection:** "total frequency"
- **Decision:** Use Top 5,000 by Total Frequency.

### Split Ratios
- **Q:** Do you have a preferred ratio (e.g., 80/10/10)?
- **User Selection:** "take 80 10 10"
- **Decision:** Use 80% Train, 10% Val, 10% Test.
