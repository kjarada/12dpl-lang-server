# Quick Start Guide - 12dPL Language Server

## What's New

✨ **Auto-Completion with 8000+ Library Functions**

The language server now provides intelligent auto-completion for all 12dPL library functions including:
- Mathematical functions (Sin, Cos, Tan, etc.)
- String operations
- File I/O
- Control flow
- And much more...

## Getting Started

### 1. Build the Project

```bash
# Install dependencies
npm install

# Compile
npm run compile

# Or use watch mode for development
npm run watch
```

### 2. Test in VS Code

1. Press **F5** to launch the extension in a test window
2. Open a `.4dm` file (e.g., `client/testFixture/Test.4dm`)
3. Start typing code

### 3. Use Auto-Completion

**Examples:**

```
Type: Sin(
Auto-complete shows: Sin, Sinh, SingleClick, etc.

Type: Print(
Auto-complete shows: Print, Printf, PrintString, etc.

Type: Math.
Trigger character '.' shows related functions
```

## Features

### Code Completion
- **8000+ Functions** from 12dPL library
- **Keywords**: if, else, while, for, return, int, double, void
- **Trigger Characters**: `.` and `#` for context-sensitive suggestions
- **Hover Documentation**: Full parameter and return type info

### Code Validation
- **Real-time parsing** with ANTLR
- **Syntax error detection** with exact line/column
- **Error messages** shown in VS Code Problems panel

### Professional Code Organization
```
server/src/
├── resources/
│   └── prototypes.xml     ← 8000+ function definitions
├── prototypes.ts          ← Prototype loader & parser
├── validator.ts           ← ANTLR-based validation
└── server.ts              ← LSP server & completions
```

## Common Workflows

### Write a Function with Auto-Completion

```4dpl
void main() {
    // Type 'Sin' and press Ctrl+Space
    real angle = Si[AUTO-COMPLETE]
    real result = Sin(angle);
    
    // Type 'Print' for output
    Pri[AUTO-COMPLETE]
    Print("Hello, 12dPL!");
}
```

### Check Syntax Errors

- Errors appear automatically in VS Code
- Hover over error squiggle for details
- Navigate with F8 (next problem)

### See Function Documentation

1. Type a function name
2. Select from completions
3. Hover over the completion item
4. Full documentation appears with:
   - Function name
   - Return type
   - Parameters with types

## Project Structure

```
12dpl-lang-server/
├── client/                    # VS Code Extension
│   ├── src/
│   │   └── extension.ts      # Extension entry point
│   └── testFixture/          # Test files (.4dm)
│
├── server/                    # Language Server
│   ├── src/
│   │   ├── resources/
│   │   │   └── prototypes.xml # ← ALL LIBRARY FUNCTIONS
│   │   ├── prototypes.ts      # Loads & parses prototypes
│   │   ├── validator.ts       # Validates code
│   │   └── server.ts          # Main LSP server
│   └── out/                   # Compiled output
│
├── syntax/                    # Syntax Highlighting
│   └── 12dpl.tmLanguage.json
│
└── ENHANCEMENTS.md           # Full documentation
```

## Key Files

| File | Purpose |
|------|---------|
| `server/src/resources/prototypes.xml` | Contains all 8000+ function definitions |
| `server/src/prototypes.ts` | Loads XML and provides completion items |
| `server/src/validator.ts` | Validates code using ANTLR parser |
| `server/src/server.ts` | Implements LSP protocol and completions |

## Troubleshooting

### Issue: Completions not showing

**Solution:**
1. Ensure file has `.4dm` or `.h` extension
2. Press `Ctrl+Space` to manually trigger
3. Check Language Server Output (F1 → search "output")

### Issue: Prototypes not loaded

**Solution:**
1. Verify `server/src/resources/prototypes.xml` exists
2. Run `npm run compile` to rebuild
3. Check build output for errors

### Issue: Build fails

**Solution:**
```bash
# Clean rebuild
rm -r server/out
npm run compile

# Or install missing dependencies
cd server
npm install
```

## Next Steps

1. **Extend Prototypes**: Add custom functions to `prototypes.xml`
2. **Add More Features**: Implement hover, go-to-definition, etc.
3. **Improve Validation**: Enhance error messages and recovery
4. **Performance**: Add caching and incremental parsing

## Support

For detailed documentation, see `ENHANCEMENTS.md`

Questions? Check the code comments:
- `server/src/prototypes.ts` - Detailed comments on prototype loading
- `server/src/server.ts` - LSP protocol implementation
- `server/src/validator.ts` - ANTLR integration

Happy coding! 🚀
