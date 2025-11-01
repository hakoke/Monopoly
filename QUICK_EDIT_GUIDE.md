# 🚀 Quick Edit Guide - Change Your Monopoly Board in 30 Seconds!

## ✅ **YES! Your Board is Fully Editable**

All board properties (names, prices, rents, colors) are in **ONE FILE**:

```
src/assets/monopoly.json
```

---

## 🎯 Common Edits (Copy & Paste Ready!)

### Change a Property Name
Find the property and change `"name"`:

```json
{
    "name": "Boardwalk",  ← Change to "My Epic Property"
    "id": "boardwalk",
    "posistion": 39,
    "price": 400
}
```

### Change a Price
Change the `"price"` value:

```json
{
    "name": "Boardwalk",
    "price": 400  ← Change to 1000, 50, whatever!
}
```

### Change Rent
Change `"rent"` (base) and `"multpliedrent"` (with houses/hotels):

```json
{
    "rent": 50,  ← Base rent
    "multpliedrent": [200, 600, 1400, 1700, 2000]  ← 1,2,3,4 houses, hotel
}
```

### Change a Color
Change the `"group"`:

```json
{
    "group": "Red"  ← Options: Purple, lightgreen, Violet, Orange, Red, Yellow, darkgreen, darkblue
}
```

### Change House Cost
```json
{
    "housecost": 200  ← Cost to build each house
}
```

---

## 💾 Save & See Changes

1. **Edit** `src/assets/monopoly.json`
2. **Save** the file (Ctrl+S / Cmd+S)
3. **Refresh** browser - Changes appear instantly!

---

## 🎨 Available Colors

- `"Purple"` - Dark Purple
- `"lightgreen"` - Light Blue  
- `"Violet"` - Pink/Magenta
- `"Orange"` - Orange
- `"Red"` - Red
- `"Yellow"` - Yellow
- `"darkgreen"` - Dark Green
- `"darkblue"` - Dark Blue

---

## ⚠️ Important

- Keep JSON format valid (commas, brackets, quotes)
- Don't change `"id"` or `"posistion"` unless you know what you're doing
- Use a JSON validator if something breaks

---

## 📚 For More Details

See **BOARD_CONFIGURATION_GUIDE.md** for:
- Adding/removing properties
- Changing colors
- Custom board layout
- Advanced customization

---

**That's it! Edit `monopoly.json` and your board updates instantly! 🎉**

