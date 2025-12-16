# 12dPL Language Server

A professional language server for 12dPL with intelligent code completion and real-time validation.

## ✨ Features

### Implemented
- **Syntax Highlighting** - Full 12dPL grammar support
- **Code Completion** - 8000+ library functions + language keywords
- **Real-time Validation** - ANTLR-based code parsing and error detection
- **AST Parsing** - Complete abstract syntax tree generation
- **Function Documentation** - Hover over functions to see signatures and parameters

### Coming Soon
- Document Highlights: highlights all 'equal' symbols in a text document
- Hover: provides detailed hover information for symbols
- Signature Help: provides signature help during function calls
- Goto Definition: navigation to function definitions
- Goto Type Definition: navigation to type definitions
- Find References: find all references to a symbol
- List Document Symbols: lists all symbols in current document
- List Workspace Symbols: lists all project-wide symbols
- Document Formatting: formatting of whole documents, ranges, and on-type
- Rename: project-wide symbol renaming

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Compile
npm run compile

# Watch mode (recommended for development)
npm run watch

# Launch in VS Code (press F5 or Ctrl+F5)
```

## 📁 Project Structure

```
server/src/
├── resources/
│   └── prototypes.xml    # 8000+ 12dPL function definitions
├── prototypes.ts         # Prototype loader & completion provider
├── validator.ts          # Code validation with ANTLR
├── server.ts             # LSP server implementation
└── antlr/               # ANTLR parser files
```

## 📚 Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - Get started in 5 minutes
- **[ENHANCEMENTS.md](ENHANCEMENTS.md)** - Detailed technical documentation
- **[ARCHITECTURE](ENHANCEMENTS.md#architecture)** - How the system works

## 🎯 Key Improvements (v1.1)

✅ **Complete Prototype Library** - Added 8000+ real 12dPL library functions  
✅ **Professional Code Organization** - Separated concerns into focused modules  
✅ **Real Parsing** - ANTLR parser integration for actual code validation  
✅ **Type-Safe** - Full TypeScript with strict mode enabled  
✅ **Extensible** - Easy to add new functions or features  

## 💡 Usage

### Use Auto-Completion
1. Open a `.4dm` file
2. Start typing a function name (e.g., "Sin", "Print")
3. Auto-complete suggestions appear
4. Press `Ctrl+Space` to manually trigger

### Check for Errors
- Syntax errors appear with red squiggles
- View all errors in the Problems panel
- Navigate with F8 (next problem)

## 🔧 Configuration

Edit `langServer.*` settings in VS Code for:
- `maxNumberOfProblems`: Maximum diagnostic messages (default: 1000)
- `trace.server`: Enable server protocol tracing

## 📦 Dependencies

### Core
- `vscode-languageserver` - LSP implementation
- `vscode-languageserver-textdocument` - Text document handling
- `antlr4` - Parser generation

### Data
- `xml2js` - XML parsing for prototypes

## 🧪 Testing

Test files are included in `client/testFixture/`:
- `Test.4dm` - Basic syntax tests
- `Test2.4dm` - Additional test cases

Run tests:
```bash
# Note: Full integration tests require VS Code download
# For now, use manual testing:
npm run compile
# Then press F5 in VS Code to test the extension
```

## 📖 Development

See [ENHANCEMENTS.md](ENHANCEMENTS.md) for:
- Architecture overview
- Prototype loading flow
- Auto-completion implementation
- Contributing guidelines
- Troubleshooting

## 📝 License

MIT - See LICENSE file

## 👤 Author

Ben Olsen (Original)  
Enhanced with professional auto-completion system (2025)
