Review Task Master tasks using multiple specialized agents for comprehensive analysis.

Arguments: $ARGUMENTS

## Command Arguments

- `MAX_SUBAGENTS` (number): Maximum number of agents to run in parallel (default: 9)
- `NO_STOP` (boolean): Continue spawning agents until all tasks are completed (default: false)

Example: `MAX_SUBAGENTS=6 NO_STOP=true`

## Multi-Agent Progressive Review System

Orchestrate specialized agents to review tasks with 3-agent analysis per task, progressive updates, and smart agent selection.

### 1. **Initial Setup**

Create workspace for progressive reviews:

- Location: `.claude/temp/task-review/`
- Sub-folders: `assessments/`, `consolidations/`, `updates/`
- Purpose: Store rolling assessments and track progress
- Cleanup: After all tasks complete

### 2. **Smart Agent Selection**

For each task, dynamically select 3 most appropriate agents:

**Agent Selection Logic:**

```yaml
Analyze Task:
  - Read task description and details
  - Identify stack (Angular, Elysia, React, etc.)
  - Determine task nature (API, UI, architecture, etc.)
  - Check for existing appropriate agents in .claude/agents/

Select Agents:
  - Priority 1: Stack-specific expert (e.g., elysia-expert for Elysia tasks)
  - Priority 2: Domain expert (e.g., api-architect for API tasks)
  - Priority 3: General reviewer (architecture-reviewer or code-reviewer)
  - If no appropriate agent exists: Create new specialized agent

Fallback Pattern:
  - Always include at least one general reviewer
  - Balance perspectives (technical, UX, architecture)
```

### 3. **Progressive Review Process**

Process tasks in batches with immediate updates:

```yaml
Batch Processing:
  - Batch size: min(MAX_SUBAGENTS / 3, available_tasks)
  - Each batch: 3 agents per task
  - Total agents per batch: ≤ MAX_SUBAGENTS

For Each Batch:
  1. Select tasks for review
  2. Determine optimal agents per task
  3. Launch agents in parallel (respecting MAX_SUBAGENTS)
  4. Collect assessments as they complete
  5. Consolidate reviews per task (4th agent)
  6. Update tasks immediately
  7. Move to next batch
```

### 4. **Three-Agent Review Pattern**

For each task, deploy 3 specialized agents:

**Agent Roles:**

- Agent 1: Primary expert (based on stack/domain)
- Agent 2: Secondary expert (complementary perspective)
- Agent 3: Quality/Standards reviewer

**Assessment Focus Areas:**

- Implementation approach and technical design
- Code quality and best practices
- Testing strategy and verification
- Integration with existing code
- Performance and scalability
- Security considerations

### 5. **Consolidation Agent (4th Agent)**

After 3 agents complete their review:

**Consolidation Tasks:**

- Merge insights from 3 agent assessments
- Identify consensus and conflicts
- Prioritize recommendations by impact
- Generate actionable task updates
- Create implementation checklist

**Output Format:**

```markdown
## Task [ID]: [Title]

### Consolidated Recommendations

- Primary changes needed
- Implementation approach
- Testing requirements

### Agent Consensus

- Points of agreement
- Divergent opinions (if any)

### Updated Task Description

[Enhanced description with all insights]
```

### 6. **Progressive Task Updates**

Update tasks immediately after consolidation:

**Update Process:**

1. Read current task from Task Master
2. Incorporate consolidated recommendations
3. Append standard reminders (see below)
4. Update task in Task Master
5. Log update in `.claude/temp/task-review/updates/`

**Standard Task Reminders (append to all tasks):**

```markdown
---

## Implementation Checklist

When implementing this task:

1. **Testing**: When tests related to your task exist, run them and iterate on errors until they pass, ensuring the tests actually verify the task goal was completed
2. **Type Safety**: Run typecheck (if available) and iterate until it passes without issues
3. **Version Control**: Manually stage the changes related to task being VERY careful to only pick them and commit them using conventional commits
```

**NO_STOP Mode Addition:**
If `NO_STOP=true`, also append:

```markdown
4. **Continuation**: The user asked me to remind you that you must DO NOT STOP. Keep spawning new agents until all tasks and subtasks are completed
```

### 7. **Agent Creation for Missing Specializations**

When no appropriate agent exists:

**Dynamic Agent Creation:**

```yaml
Analyze Gap:
  - Identify missing expertise
  - Determine required knowledge domain
  
Create Agent:
  - Generate specialized agent profile
  - Save to .claude/agents/[domain]-expert.md
  - Include in current review cycle
```

### 8. **Execution Flow**

```yaml
Main Process:
─────────────
1. Parse arguments (MAX_SUBAGENTS, NO_STOP)
2. Create workspace folders
3. Get all TM tasks and subtasks
4. Calculate batch size

For Each Batch:
  5. Select tasks for batch
  6. For each task:
     a. Analyze task nature
     b. Select/create 3 appropriate agents
  7. Launch agents (≤ MAX_SUBAGENTS)
  8. Collect assessments
  9. For each completed task:
     a. Launch consolidation agent
     b. Update task immediately
     c. Log progress
  10. Continue to next batch

Cleanup:
  11. Verify all tasks updated
  12. Generate final report
  13. Clean temporary files
```

### 9. **Parallel Execution Management**

```yaml
Concurrency Control:
  - Track active agents
  - Queue pending reviews
  - Launch new agents as slots free
  - Maintain MAX_SUBAGENTS limit

Agent Pools:
  - Review Pool: 3 agents per task
  - Consolidation Pool: 1 agent per completed triplet
  - Dynamic scaling based on load
```

### 10. **Progress Tracking**

Real-time status updates:

```yaml
Status Report:
  - Tasks reviewed: X/Y
  - Active agents: Z
  - Completed consolidations: W
  - Failed reviews: (if any)
  - Estimated completion: HH:MM
```

### 11. **Error Handling**

```yaml
Recovery Strategies:
  - Agent failure: Retry with different agent
  - Consolidation conflict: Flag for manual review
  - Update failure: Log and continue
  - Critical error: Save state and report
```

### 12. **Final Verification**

After all batches complete:

```yaml
Verification Steps:
  1. Confirm all tasks have been reviewed
  2. Verify all subtasks included
  3. Check all updates applied
  4. Generate summary report
  5. Archive assessments
```

**Summary Report Location:**
`.claude/temp/task-review/final-report.md`

Result: Comprehensive, progressive, multi-perspective task review with intelligent agent selection and immediate updates.
