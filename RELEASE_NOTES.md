# Release Notes

## [1.0.4] - 2025-12-17

### Added
- **Advanced Grammar Support**:
  - **Arrays**: Full support for array declarations (e.g., `Real x[10]`) and array parameters.
  - **Switch Statements**: Support for compound statements (braces) in case blocks.
  - **For Loops**: Support for variable declarations inside loop headers (e.g., `for(Integer i=0; ...)`).
  - **Multiple Declarations**: Support for comma-separated variable declarations (e.g., `Real x, y, z;`).
  - **Pass-by-Reference**: Support for `&` in function parameters.
- **Autocomplete Improvements**:
  - Function snippets now include parameter types in placeholders for better context.
- **Documentation**:
  - Added comprehensive documentation for all 12dPL built-in types (Mathematical, Geometric, Database, Interface, etc.).
  - Hovering over functions now shows detailed signatures.

### Fixed
- **Parser Errors**:
  - Fixed "no viable alternative" errors for function prototypes.
  - Fixed syntax errors for specific constant formats (e.g., `123LL`, `6.`).
  - Fixed issues with mixed declarations and statements in specific contexts.
- **Build System**:
  - Migrated build scripts to use `bun` for faster performance.

### Changed
- Updated `Test.4dm` to include a comprehensive macro example demonstrating all supported features.

