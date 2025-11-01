# Monopoly Board Editing Guide

Your new board reads all properties from `src/assets/monopoly.json`, making it **100% customizable**!

## 🎨 How to Edit Properties

### Editing an Existing Property

Open `src/assets/monopoly.json` and find the property you want to edit in the `properties` array:

```json
{
    "name": "Mediterranean Avenue",
    "id": "mediterraneanave",
    "posistion": 1,
    "price": 60,
    "rent": 2,
    "multpliedrent": [10, 30, 90, 160, 250],
    "housecost": 50,
    "group": "Purple",
    ...
}
```

**Editable Fields:**
- `name` - The property name (shows on the board)
- `price` - Purchase price (shows on the board)
- `rent` - Base rent
- `multpliedrent` - Rent with 1-5 houses
- `housecost` - Cost to build a house/hotel
- `group` - Color group (see available colors below)

### Available Color Groups

The board supports these color groups:
- `Purple` → Dark purple (#5e3577)
- `lightgreen` → Light blue (#d2eaf5)
- `Violet` → Magenta/Purple (#b02f7c)
- `Orange` → Orange (#fa811d)
- `Red` → Red (#f50c2b)
- `Yellow` → Yellow (#ffed20)
- `darkgreen` → Green (#41994e)
- `darkblue` → Dark blue (#5a6dba)

### Adding a New Property

To add a property, you need to:

1. **Add it to the `properties` array:**
```json
{
    "name": "Custom Avenue",
    "id": "customave",
    "posistion": 38,
    "price": 500,
    "rent": 50,
    "multpliedrent": [100, 300, 900, 1600, 2500],
    "housecost": 200,
    "group": "darkblue",
    "ownedby": -1,
    "buildings": 0,
    "mortgaged": false
}
```

2. **Update the board component** (`src/components/ingame/GitHubBoard.tsx`):
   - Find the position where you want to insert it
   - Add a render call: `{renderProperty(38)}`

### Removing a Property

1. Remove the property from the `properties` array in `monopoly.json`
2. Remove or replace the corresponding render call in `GitHubBoard.tsx`

## 🏠 Special Spaces

### Railroads
Properties with `"group": "Railroad"` automatically render with a train icon.

### Utilities
- Electric Company: `"group": "Utilities"` + `id` contains "electric"
- Water Works: `"group": "Utilities"` + `id` contains "water"

### Corners & Special Spaces
These are hardcoded in `GitHubBoard.tsx`:
- Position 0: GO
- Position 10: Jail
- Position 20: Free Parking
- Position 30: Go to Jail
- Chance and Community Chest are placed manually in the render

## 🎨 Customizing Colors

Want to change a color group? Edit `src/github-board.css`:

```css
.dark-purple {
    background: #5e3577;  /* Change this hex color */
}
```

## 📝 Example: Changing Mediterranean Avenue to "Custom Street"

1. Open `src/assets/monopoly.json`
2. Find the Mediterranean Avenue object
3. Change:
```json
{
    "name": "Custom Street",    // Changed name
    "price": 100,              // Changed from 60
    "group": "Orange",         // Changed from Purple
    ...
}
```
4. Save the file
5. Refresh your game - the board updates automatically!

## ⚡ Quick Tips

- **Position numbers** start at 0 (GO) and go up to 39 (Boardwalk), moving counter-clockwise
- **All prices** are in dollars (no need for the $ symbol in JSON)
- **IDs must be unique** - use lowercase, no spaces
- **Changes are live** - just save the JSON and refresh!

## 🔧 Advanced Customization

Want to change the board layout completely? Edit:
- **Board structure**: `src/components/ingame/GitHubBoard.tsx`
- **Board styling**: `src/github-board.css`
- **Font/colors**: Both files above

Your game logic (dice, movement, trading, etc.) stays 100% the same - only the visual board changed!

