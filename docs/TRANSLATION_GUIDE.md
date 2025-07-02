# Translation Guide

## Quick Start Workflow

### 1. Setup
```bash
git clone <repository>
npm install
npm run locale:template <LANGUAGE_CODE>
```

### 2. Translate
```bash
cd ./src/lang/locale/<LANGUAGE_CODE>/
# Edit flat.json - translate values, keep keys unchanged
```

### 3. Generate & Submit
```bash
npm run locale:nest <LANGUAGE_CODE>
npm run locale:check-locale <locale>  # optional: validate your work
git add . && git commit -m "lang: Add <LANGUAGE_CODE> translation"
# Create pull request with both flat.json and generated index.ts
```

## Language Codes
- Visit [ISO 639-1 Language Codes](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)
- Use two-letter codes: `de`, `fr`, `es`, `ru` or regions variants (like `zh-cn`)

## Translation Rules

### ✅ DO:
- **Preserve structure**: Keep arrays and objects intact
- `["item1", "item2"]` → `["элемент1", "элемент2"]`
- **Keep variables**: Variables in `{{brackets}}` must stay exactly as-is
- `"Hello {{name}}"` → `"Привет {{name}}"`
- **Maintain formatting**: Keep `\n` line breaks and spacing
- **Natural translation**: Translate meaning, not word-by-word

### ❌ DON'T:
- Change JSON keys (`"settings.pages.debug"` stays as-is)
- Translate `{{variables}}` inside brackets
- Reorder array elements
- Break JSON syntax (quotes, commas, brackets)

## Examples

### Simple String
```json
"commands.togglePanels.notice.shown": "Control panels shown"
```
✅ Becomes:
```json
"commands.togglePanels.notice.shown": "Панели управления показаны"
```

### With Variables
```json
"settings.debug.storage.desc": "Storage: {{storage}}, Entries: {{entries}}"
```
✅ Becomes:
```json
"settings.debug.storage.desc": "Хранилище: {{storage}}, Записи: {{entries}}"
```

### Array of Strings
```json
"help.steps": [
 "Step 1: Enable feature",
 "Step 2: Configure settings",  
 "Step 3: Save changes"
]
```
✅ Becomes:
```json
"help.steps": [
 "Шаг 1: Включить функцию",
 "Шаг 2: Настроить параметры",
 "Шаг 3: Сохранить изменения"
]
```

## Tips
- **UI context matters**: Consider where text appears
- **Length constraints**: Some UI elements have space limits - adapt accordingly
- **Consistent tone**: Match formality level of original text
- **Check existing translations**: Look at other locale folders for reference
- **Validate JSON**: Use online JSON validators if unsure about syntax

## Available Commands
- `npm run locale:template <CODE>` - Create new locale template
- `npm run locale:nest <CODE>` - Generate TypeScript from flat.json
- `npm run locale:check-locale` - Validate your translation

## Need Help?
- Check other language folders for examples
- Open GitHub issue for questions before starting large translations
- Test your JSON syntax before submitting
