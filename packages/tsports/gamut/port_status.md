# Port Status Tracking: @tsports/gamut

## Core Implementation

| Go Reference File   | TypeScript Port File     | Status  | Notes                       |
| ------------------- | ------------------------ | ------- | --------------------------- |
| `gamut.go`          | `src/palette.ts`         | ✅ Done | Core Palette implementation |
| `gamut_test.go`     | `test/palette.test.ts`   | ✅ Done | Original gamut tests        |
| `colors.go`         | `src/colors.ts`          | ✅ Done | Color manipulation logic    |
| `colors_test.go`    | `test/colors.test.ts`    | ✅ Done | Original color tests        |
| `generator.go`      | `src/generator.ts`       | ✅ Done | Color generation logic      |
| `generator_test.go` | `test/generator.test.ts` | ✅ Done | Original generator tests    |

## Palettes (`palette/`)

| Go Reference File          | TypeScript Port File       | Status  | Notes                              |
| -------------------------- | -------------------------- | ------- | ---------------------------------- |
| `palette/palettes.go`      | `src/palette/index.ts`     | ✅ Done | Palette collection index           |
| `palette/monokai.go`       | `src/palette/monokai.ts`   | ✅ Done | Monokai palette data               |
| `palette/crayola.go`       | `src/palette/crayola.ts`   | ✅ Done | Crayola color data                 |
| `palette/css.go`           | `src/palette/css.ts`       | ✅ Done | CSS named colors                   |
| `palette/ral.go`           | `src/palette/ral.ts`       | ✅ Done | RAL color data                     |
| `palette/resene.go`        | `src/palette/resene.ts`    | ✅ Done | Resene color data                  |
| `palette/wikipedia.go`     | `src/palette/wikipedia.ts` | ✅ Done | Wikipedia color data               |
| `palette/palettes_test.go` |                            | ✅ Done | Tests coverage in `test/*.test.ts` |

## Themes (`theme/`)

| Go Reference File      | TypeScript Port File  | Status  | Notes                   |
| ---------------------- | --------------------- | ------- | ----------------------- |
| `theme/roles.go`       | `src/theme/roles.ts`  | ✅ Done | Theme roles definitions |
| `theme/themes.go`      | `src/theme/themes.ts` | ✅ Done | Theme implementation    |
| `theme/themes_test.go` | `test/themes.test.ts` | ✅ Done | Theme tests             |

## Internal Utilities (New)

| TS File               | Purpose                  | Notes                                        |
| --------------------- | ------------------------ | -------------------------------------------- |
| `src/utils.ts`        | Wagner-Fischer algorithm | Ported from `smetrics`                       |
| `src/utils/kmeans.ts` | K-Means clustering       | Replaces `muesli/clusters` & `muesli/kmeans` |
| `src/go-style.ts`     | PascalCase API           | Go compatibility layer                       |

## Dependencies

- `github.com/lucasb-eyer/go-colorful` -> `@tsports/go-colorful` (✅ Used)
- `github.com/xrash/smetrics` -> `src/utils.ts` (✅ Ported)
- `github.com/muesli/clusters` -> `src/utils/kmeans.ts` (✅ Ported)
- `github.com/muesli/kmeans` -> `src/utils/kmeans.ts` (✅ Ported)

## Completion

The port is complete with 100% coverage of core logic, palettes, and themes. All unit tests have been ported and are passing.
