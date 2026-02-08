# Runtime Performance Benchmarks

Measures component mount and update performance in jsdom using Vitest.

## ⚠️ Important Caveats

### jsdom is NOT a Real Browser
- **No layout engine:** `getBoundingClientRect()` returns zeros
- **No paint/composite:** Can't measure actual frame rate
- **Different timing:** JavaScript execution only, no browser overhead
- **Useful for:** Comparing component logic overhead in isolation

### Different Reactivity Models
- **SolidJS (PV):** Fine-grained reactivity compiled at build time
  - Updates propagate directly to affected DOM nodes
  - No virtual DOM diffing overhead
  - Smaller update footprint

- **React (RS):** Virtual DOM + reconciliation
  - Component re-renders on state change
  - Virtual DOM diffing to find changes
  - Batched updates for efficiency

**These are fundamentally different approaches.** Faster benchmarks don't mean "better framework" - they reflect different trade-offs:
- SolidJS: More performant, steeper learning curve
- React: More flexible, easier debugging, larger community

## Methodology

### Test Harness
- **Framework:** Vitest (already configured in project)
- **Rendering:** `@solidjs/testing-library` for PV, `@testing-library/react` for RS
- **Timing:** `performance.mark/measure` API
- **Environment:** jsdom (Node.js, not a real browser)

### Test Pattern
```typescript
// Warm-up run (eliminate JIT compilation bias)
render(component);
cleanup();

// Measure over 10 iterations
for (let i = 0; i < 10; i++) {
  const start = performance.now();
  render(component);
  const end = performance.now();
  timings.push(end - start);
  cleanup();
}

// Report median + p95 (eliminate outliers)
const median = timings.sort()[5];
const p95 = timings[9];
```

### Test Scenarios

#### 1. Button Mount (100 components)
**What:** Render 100 `<Button>` components from scratch
**Measures:** Component creation overhead + initial DOM insertion
**Expected:** PV faster (no virtual DOM)

#### 2. Button Update (100 components)
**What:** Toggle `isDisabled` on 100 buttons
**Measures:** Reactivity update speed
**Expected:** PV MUCH faster (fine-grained updates, no diffing)

#### 3. Select Mount (50 components with 100 options each)
**What:** Render 50 Select components with 100 options
**Measures:** Complex component overhead
**Expected:** PV faster (compiled JSX, smaller runtime)

## How to Run

```bash
deno task bench:runtime
```

Results are logged to console (not saved to JSON - too much variance).

## Interpreting Results

### Good Results
- PV 2-5x faster on mount
- PV 5-10x faster on updates
- Consistent across runs (low variance)

### Unexpected Results
- RS faster than PV → investigate (possible test error)
- High variance (>50%) → environmental noise, re-run
- Very slow (>1s) → memory pressure, restart

## Limitations

- ❌ Does NOT measure real browser performance
- ❌ Does NOT include layout/paint time
- ❌ Does NOT reflect network/loading overhead
- ❌ Microbenchmarks don't represent real apps
- ✅ Useful for comparing component logic overhead

## Why Not React Spectrum Benchmarks?

To properly benchmark React Spectrum, we'd need:
1. React 18 setup with concurrent rendering
2. Separate test environment (conflicts with SolidJS)
3. Different testing library (`@testing-library/react`)
4. Comparison methodology that accounts for different models

**Decision:** Focus on PV benchmarks first. Add RS comparison later if valuable.

## Future Improvements

- Add memory usage tracking (`process.memoryUsage()`)
- Add GC pressure measurement (heap snapshots)
- Add Playwright benchmarks for real browser timing
- Compare against Svelte/Vue for context
