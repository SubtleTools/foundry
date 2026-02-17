# Changelog

All notable changes to this project will be documented in this file.

## [1.3.0-tsport] - 2026-02-17

### Added

- **Standalone conversion function exports**: All Go public conversion functions are now
  exported at the top level with PascalCase names matching Go exactly:
  - `XyzToOkLab`, `OkLabToXyz`, `XyzToOkLch`, `OkLchToXyz`
  - `OkLabToOkLch`, `OkLchToOkLab`
  - `XyzToLinearRgb`, `LinearRgbToXyz`
  - `XyzToLab`, `LabToXyz`, `XyzToLabWhiteRef`, `LabToXyzWhiteRef`
  - `XyzToLuv`, `LuvToXyz`, `XyzToLuvWhiteRef`, `LuvToXyzWhiteRef`
  - `XyzToXyy`, `XyyToXyz`, `XyzToXyyWhiteRef`
  - `LabToHcl`, `HclToLab`, `LuvToLuvLCh`, `LuvLChToLuv`
- **HSLuv conversion function exports**: `luvLChToHSLuv`, `hsLuvToLuvLCh`,
  `luvLChToHPLuv`, `hpLuvToLuvLCh` now exported from main index
- **go-style.ts conversion exports**: All standalone conversion functions now
  available from the Go-style API module with PascalCase names
- **New conversion functions**: `xyzToOkLch` and `okLchToXyz` (composite
  conversions through OkLab, matching Go v1.3.0)
- Ported Go's `TestSortSimple` test case for deterministic sort verification
- Comprehensive v1.3.0 feature test suite covering all new exports

### Notes

- All features from Go go-colorful v1.3.0 are now fully ported:
  - OkLab and OkLch color space support (added in v1.3.0)
  - BlendOkLab and BlendOkLch blending (added in v1.3.0)
  - DistanceLinearRgb and DistanceRiemersma distance metrics
  - BlendLinearRgb linear RGB blending
  - Color sorting via minimum spanning tree (Sorted function)
  - Custom random source support (WithRand variants)
  - YAML marshal/unmarshal on HexColor
  - HSV/HCL blend fix for achromatic colors
- 176 tests passing, 0 failures

## [1.0.7-tsport] - 2024-08-26

### Added

- Complete TypeScript port of go-colorful library v1.2.0
- Comprehensive color space conversion functions (RGB, HSV, HSL, Lab, Luv, HCL, OkLab, OkLch, HSLuv, HPLuv)
- Color distance calculation algorithms (CIE76, CIE94, CIEDE2000, etc.)
- Color blending operations across multiple color spaces
- Color palette generation (warm, happy, soft palettes)
- Go-style API compatibility layer for easy migration
- Extensive test suite with 77% coverage of core functionality
- Full TypeScript type definitions
- Comprehensive documentation with examples

### Technical Details

- 153/157 tests passing (3 automated compatibility tests excluded due to expected Go-to-TypeScript RNG differences)
- ESM module format with proper tree-shaking support
- Node.js 18+ compatibility
- Zero runtime dependencies
- Minified bundle size: 27.55 KB

### Note

This version includes minor expected differences in random palette generation compared to the original Go implementation due to differences in random number generation between Go and TypeScript/JavaScript. Core color conversion functionality maintains full compatibility with the Go version.
