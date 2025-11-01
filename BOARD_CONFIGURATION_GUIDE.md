# 🎮 Monopoly Board Configuration Guide

## ✅ Your Board is Now FULLY EDITABLE!

All board properties, names, prices, and values are controlled by a single file:
`src/assets/monopoly.json`

---

## 📝 How to Edit Your Board

### 1. **Change Property Names**

Find the property in `monopoly.json` and change the `name` field:

```json
{
    "name": "Mediterranean Avenue",  ← CHANGE THIS
    "id": "mediterraneanave",
    "posistion": 1,
    "price": 60,
    ...
}
```

**Example:** Change "Mediterranean Avenue" to "Cool Street"

```json
{
    "name": "Cool Street",
    "id": "mediterraneanave",
    "posistion": 1,
    "price": 60,
    ...
}
```

---

### 2. **Change Prices**

Modify the `price` field:

```json
{
    "name": "Boardwalk",
    "id": "boardwalk",
    "posistion": 39,
    "price": 400,  ← CHANGE THIS to 500, 1000, whatever!
    ...
}
```

---

### 3. **Change Rent Values**

Edit the `rent` and `multpliedrent` fields:

```json
{
    "name": "Boardwalk",
    "rent": 50,  ← Base rent
    "multpliedrent": [200, 600, 1400, 1700, 2000],  ← Rent with 1,2,3,4 houses and hotel
    ...
}
```

**What each number means:**
- `rent`: Rent with no houses
- `multpliedrent[0]`: Rent with 1 house
- `multpliedrent[1]`: Rent with 2 houses
- `multpliedrent[2]`: Rent with 3 houses
- `multpliedrent[3]`: Rent with 4 houses
- `multpliedrent[4]`: Rent with hotel

---

### 4. **Change House/Hotel Costs**

```json
{
    "name": "Park Place",
    "housecost": 200,  ← Cost to build a house
    ...
}
```

---

### 5. **Change Property Colors**

The `group` field controls the color:

```json
{
    "name": "Mediterranean Avenue",
    "group": "Purple",  ← CHANGE THIS
    ...
}
```

**Available Colors:**
- `"Purple"` - Dark Purple
- `"lightgreen"` - Light Blue
- `"Violet"` - Pink/Magenta
- `"Orange"` - Orange
- `"Red"` - Red
- `"Yellow"` - Yellow
- `"darkgreen"` - Dark Green
- `"darkblue"` - Dark Blue

**Want to add custom colors?** Edit `src/css-grid-board.css` and add:

```css
.your-custom-color {
    background: #FF00FF; /* Your color here */
}
```

Then use `"group": "your-custom-color"` in `monopoly.json`

---

### 6. **Add New Properties**

Copy an existing property and modify it:

```json
{
    "name": "My New Property",
    "id": "mynewproperty",
    "posistion": 40,  ← Must be unique and between 0-39
    "price": 350,
    "rent": 35,
    "multpliedrent": [175, 500, 1100, 1300, 1500],
    "housecost": 200,
    "group": "darkblue",
    "ownedby": -1,
    "buildings": 0,
    "mortgaged": false
}
```

**Note:** You'll also need to update the `tiles` array at the bottom of `monopoly.json` to include your new property in the board order.

---

### 7. **Remove Properties**

Simply delete the property object from the `properties` array AND remove its entry from the `tiles` array.

---

### 8. **Change Railroad Names & Prices**

```json
{
    "name": "Reading Railroad",  ← CHANGE NAME
    "id": "readingrailroad",
    "posistion": 5,
    "price": 200,  ← CHANGE PRICE
    "group": "Railroad",
    ...
}
```

---

### 9. **Change Utility Names & Prices**

```json
{
    "name": "Electric Company",  ← CHANGE NAME
    "id": "electriccompany",
    "posistion": 12,
    "price": 150,  ← CHANGE PRICE
    "group": "Utilities",
    ...
}
```

---

### 10. **Change Tax Amounts**

Tax spaces are in the `tiles` array. To change tax amounts, you'll need to modify the game logic in `src/components/ingame/game.tsx` where taxes are calculated.

---

## 🎨 Customizing Board Appearance

### Change Board Size

Edit `src/css-grid-board.css` and modify:

```css
.css-grid-board {
    max-width: min(95vh, calc(100vw - 660px));  ← Adjust these values
    max-height: min(95vh, calc(100vw - 660px));
}
```

### Change Board Colors

Edit `src/css-grid-board.css`:

```css
.css-grid-board {
    background: #080808;  ← Board border color
    border: 2px solid #080808;
}

.css-grid-board .center {
    background: #fafaf8;  ← Center area background
}

.css-grid-board .space {
    background: #fafaf8;  ← Space background
}
```

### Change Fonts

Edit `src/css-grid-board.css`:

```css
@import url("https://fonts.googleapis.com/css?family=YourFont:300,400,500");

.css-grid-board .space .container {
    font-family: "YourFont", sans-serif;  ← Change font
}

.css-grid-board .title {
    font-family: "YourFont", sans-serif;  ← Change title font
}
```

---

## 🔧 Advanced Customization

### Chance & Community Chest Cards

Edit the `chance` and `communitychest` arrays in `monopoly.json`:

```json
"chance": [
    {
        "title": "Advance to Go (Collect $200)",  ← CHANGE CARD TEXT
        "action": "move",
        "tileid": "go"
    },
    ...
]
```

### Board Layout Order

The `tiles` array defines the order of spaces going around the board (0-39):

```json
"tiles": [
    { "id": "go" },              // Position 0
    { "id": "mediterraneanave" }, // Position 1
    { "id": "communitychest" },  // Position 2
    ...
]
```

Change the order or IDs to reorganize your board!

---

## 💾 Saving Your Changes

1. **Edit** `src/assets/monopoly.json`
2. **Save** the file
3. **Refresh** your browser - changes appear instantly!

---

## ⚠️ Important Notes

- Always keep the `posistion` field unique (0-39)
- Don't change property `id` unless you update ALL references
- Keep the JSON format valid (commas, brackets, quotes)
- The board reads from `monopoly.json` - your changes are safe!

---

## 🎉 Your Board is Fully Customizable!

- ✅ Change any property name
- ✅ Change any price
- ✅ Change any rent value
- ✅ Change house/hotel costs
- ✅ Change colors
- ✅ Add new properties
- ✅ Remove properties
- ✅ Customize appearance
- ✅ Edit card text

**Everything is in `monopoly.json`** - easy to find, easy to edit!

---

## 📞 Need Help?

If something breaks:
1. Check your JSON syntax (commas, brackets, quotes)
2. Make sure all `posistion` values are unique
3. Ensure all properties referenced in `tiles` exist in `properties`
4. Refresh your browser

**Pro Tip:** Use an online JSON validator to check your `monopoly.json` file before saving!

