# Port Report: @tsports/go-colorful v1.3.0

**Upstream**: https://github.com/lucasb-eyer/go-colorful
**Previous version**: v1.2.0
**Target version**: v1.3.0
**Generated**: 2026-02-17T03:13:28.825Z

## Summary

- **Commits**: 26
- **Files changed**: 19

## Changed Files

| File                        | Status   | +Lines | -Lines | Relevant? |
| --------------------------- | -------- | ------ | ------ | --------- |
| .github/FUNDING.yml         | modified | +1     | -1     | no        |
| .github/workflows/test.yml  | modified | +3     | -10    | no        |
| CHANGELOG.md                | modified | +24    | -0     | no        |
| README.md                   | modified | +20    | -19    | no        |
| colorgens.go                | modified | +24    | -12    | **YES**   |
| colorgens_test.go           | modified | +25    | -5     | test      |
| colors.go                   | modified | +199   | -22    | **YES**   |
| colors_test.go              | modified | +169   | -10    | test      |
| doc/colorgens/colorgens.go  | modified | +18    | -13    | no        |
| doc/colorsort/colorsort.go  | added    | +83    | -0     | no        |
| doc/colorsort/colorsort.png | added    | +0     | -0     | no        |
| happy_palettegen.go         | modified | +11    | -7     | **YES**   |
| hexcolor.go                 | modified | +20    | -0     | **YES**   |
| hsluv.go                    | modified | +3     | -2     | **YES**   |
| rand.go                     | added    | +22    | -0     | **YES**   |
| soft_palettegen.go          | modified | +12    | -5     | **YES**   |
| sort.go                     | added    | +191   | -0     | **YES**   |
| sort_test.go                | added    | +29    | -0     | test      |
| warm_palettegen.go          | modified | +11    | -7     | **YES**   |

## Files to Port

These Go source files have changes that need to be reflected in TypeScript:

### colorgens.go

- **Status**: modified
- **Changes**: +24 / -12
- **TS counterpart**: `src/colorgens.ts` (verify path)
- **New functions**: `FastWarmColorWithRand`, `WarmColorWithRand`, `randomWarmWithRand`, `FastHappyColorWithRand`, `HappyColorWithRand`, `randomPimpWithRand`

### colors.go

- **Status**: modified
- **Changes**: +199 / -22
- **TS counterpart**: `src/colors.ts` (verify path)
- **New functions**: `DistanceLinearRgb`, `DistanceRiemersma`, `parseHexColor`, `BlendLinearRgb`, `OkLab`, `XyzToOkLab`, `OkLabToXyz`, `BlendOkLab`, `OkLch`, `XyzToOkLch`, `OkLchToXyz`, `OkLabToOkLch`, `OkLchToOkLab`, `BlendOkLch`

### happy_palettegen.go

- **Status**: modified
- **Changes**: +11 / -7
- **TS counterpart**: `src/happy_palettegen.ts` (verify path)
- **New functions**: `FastHappyPaletteWithRand`, `HappyPaletteWithRand`

### hexcolor.go

- **Status**: modified
- **Changes**: +20 / -0
- **TS counterpart**: `src/hexcolor.ts` (verify path)
- **New functions**: `MarshalYAML`, `UnmarshalYAML`

### hsluv.go

- **Status**: modified
- **Changes**: +3 / -2
- **TS counterpart**: `src/hsluv.ts` (verify path)

### rand.go

- **Status**: added
- **Changes**: +22 / -0
- **TS counterpart**: `src/rand.ts` (verify path)
- **New functions**: `Float64`, `Intn`, `getDefaultGlobalRand`

### soft_palettegen.go

- **Status**: modified
- **Changes**: +12 / -5
- **TS counterpart**: `src/soft_palettegen.ts` (verify path)
- **New functions**: `SoftPaletteExWithRand`, `SoftPaletteWithRand`

### sort.go

- **Status**: added
- **Changes**: +191 / -0
- **TS counterpart**: `src/sort.ts` (verify path)
- **New functions**: `newElement`, `find`, `union`, `allToAllDistancesCIEDE2000`, `sortEdges`, `minSpanTree`, `traverseMST`, `Sorted`

### warm_palettegen.go

- **Status**: modified
- **Changes**: +11 / -7
- **TS counterpart**: `src/warm_palettegen.ts` (verify path)
- **New functions**: `FastWarmPaletteWithRand`, `WarmPaletteWithRand`

## Suggested Porting Order

### New files (create from scratch)

1. `rand.go` → `src/rand.ts`
1. `sort.go` → `src/sort.ts`

### Modified files (update existing)

1. `hsluv.go` (+3/-2)
1. `soft_palettegen.go` (+12/-5)
1. `happy_palettegen.go` (+11/-7)
1. `warm_palettegen.go` (+11/-7)
1. `hexcolor.go` (+20/-0)
1. `colorgens.go` (+24/-12)
1. `colors.go` (+199/-22)

## Checklist

- [ ] Review all changed Go files above
- [ ] Port new functions/types to TypeScript
- [ ] Update existing functions with Go changes
- [ ] Add Go-style API wrappers for new exports (`src/go-style.ts`)
- [ ] Update `src/index.ts` exports
- [ ] Update/add tests
- [ ] Run `bun test` and verify all tests pass
- [ ] Update CHANGELOG.md
- [ ] Commit and merge to main
