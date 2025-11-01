# Quick Board Customization Examples

## Example 1: Change to Dark Theme

**Edit:** `src/css-grid-board.css`

```css
/* Change these colors at the top of the file */
.monopoly-grid-board {
  background: #1a1a1a;  /* Dark board border */
  border: 2px solid #000;
}

.monopoly-grid-board .center {
  background: #2a2a2a;  /* Dark center */
}

.monopoly-grid-board .space {
  background: #333;  /* Dark spaces */
  color: #fff;  /* White text */
}

.monopoly-grid-board .title {
  color: #f50c2b;  /* Red title */
}
```

## Example 2: Add a Custom Property

**Edit:** `src/components/MonopolyBoard.tsx`

Find the Mediterranean Avenue property and change it:

```tsx
<div className="space property">
  <div className="container">
    <div className="color-bar dark-purple"></div>
    <div className="name">YOUR CUSTOM NAME</div>
    <div className="price">Price $XXX</div>
  </div>
</div>
```

## Example 3: Change Property Colors

**Edit:** `src/css-grid-board.css`

```css
/* Make Mediterranean & Baltic blue instead of purple */
.dark-purple {
  background: #0066cc;  /* Now blue! */
}

/* Make Park Place & Boardwalk gold */
.dark-blue {
  background: #ffd700;  /* Now gold! */
}
```

## Example 4: Add Hover Effects

**Edit:** `src/css-grid-board.css`

Add at the end of the file:

```css
/* Highlight properties on hover */
.monopoly-grid-board .property:hover {
  transform: scale(1.05);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  cursor: pointer;
  z-index: 10;
  transition: all 0.2s ease;
}

/* Highlight corners on hover */
.monopoly-grid-board .corner:hover {
  transform: scale(1.02);
  box-shadow: 0 0 15px rgba(245, 12, 43, 0.5);
  transition: all 0.2s ease;
}
```

## Example 5: Change Board Title

**Edit:** `src/components/MonopolyBoard.tsx`

Find the title in the center:

```tsx
<h1 className="title">YOUR GAME NAME</h1>
```

## Example 6: Make Center Logo Area Custom

**Edit:** `src/components/MonopolyBoard.tsx`

Replace the center section:

```tsx
<div className="center">
  <img src="/your-logo.png" alt="Logo" style={{
    gridColumn: '1 / 9',
    gridRow: '1 / 8',
    width: '80%',
    height: '80%',
    objectFit: 'contain'
  }} />
</div>
```

## Example 7: Rounded Corners Board

**Edit:** `src/css-grid-board.css`

```css
.monopoly-grid-board {
  border-radius: 20px;  /* Add this */
  overflow: hidden;     /* Add this */
}
```

## Example 8: Animated Title

**Edit:** `src/css-grid-board.css`

```css
.monopoly-grid-board .title {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}
```

## Example 9: Change All Property Prices

**Edit:** `src/components/MonopolyBoard.tsx`

Use find & replace:
- Find: `Price $`
- Replace: `Cost: $` or `Price: ` or whatever you want

## Example 10: Add Property Images

**Edit:** `src/components/MonopolyBoard.tsx`

Add an image to a property:

```tsx
<div className="space property">
  <div className="container">
    <div className="color-bar dark-blue"></div>
    <img src="/boardwalk-image.png" style={{ 
      width: '100%', 
      height: '50px',
      objectFit: 'cover' 
    }} />
    <div className="name">Boardwalk</div>
    <div className="price">Price $400</div>
  </div>
</div>
```

## Testing Your Changes

1. Save the file
2. Vite will auto-reload the page
3. See your changes instantly!

## Pro Tips

- Keep a backup of `src/css-grid-board.css` before major changes
- Test one change at a time
- Use browser DevTools to inspect and test CSS live
- The board is responsive - test at different screen sizes
- All changes are immediate with Vite's hot reload

Enjoy your fully customizable Monopoly board! 🎨

