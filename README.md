# 🧮 SmartCalc

A beautiful, modern calculator built with HTML, CSS, and vanilla JavaScript. Features a clean dark theme, smooth animations, keyboard support, and responsive design that works seamlessly on both desktop and mobile devices.

![Calculator Demo](https://img.shields.io/badge/Status-Live-success)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## ✨ Features

### Core Functionality
- ✅ **Basic Arithmetic Operations**: Addition, subtraction, multiplication, and division
- ✅ **Percentage Calculation**: Quick percentage operations
- ✅ **Decimal Support**: Full decimal number support with precision handling
- ✅ **Chain Calculations**: Perform multiple operations in sequence
- ✅ **Clear & Delete**: Reset calculations or delete last digit
- ✅ **Error Handling**: Graceful handling of division by zero and invalid operations

### User Experience
- 🎨 **Modern Dark Theme**: Beautiful gradient background with glassmorphism effects
- ⌨️ **Full Keyboard Support**: Use your keyboard for faster calculations
- 📱 **Fully Responsive**: Optimized for desktop, tablet, and mobile devices
- ✨ **Smooth Animations**: Button press effects and transitions
- 🔢 **Auto-Resizing Display**: Text scales automatically for long numbers
- 👁️ **Previous Operation Display**: See your calculation history at a glance

### Technical Features
- 🚀 **Vanilla JavaScript**: No frameworks or dependencies
- 💻 **Clean Code**: Well-commented, maintainable ES6+ syntax
- 🎯 **Object-Oriented Design**: Calculator class with clear separation of concerns
- 🌐 **Cross-Browser Compatible**: Works on Chrome, Firefox, Safari, and Edge
- ♿ **Semantic HTML**: Accessible and SEO-friendly markup

## 🎯 Demo

https://anilkumarputta.github.io/SmartCalc/


### Screenshots
The calculator features a clean, modern interface with:
- Large, readable display with previous operation history
- Color-coded buttons (numbers, operators, special functions)
- Smooth hover effects and button animations
- Responsive layout that adapts to any screen size

## 🚀 Installation & Usage

### Quick Start
1. Clone the repository:
   ```bash
   git clone https://github.com/Anilkumarputta/smartcalc.git
   ```

2. Navigate to the project directory:
   ```bash
   cd smartcalc
   ```

3. Open `index.html` in your web browser:
   ```bash
   # On macOS
   open index.html
   
   # On Linux
   xdg-open index.html
   
   # On Windows
   start index.html
   ```

   Or simply double-click the `index.html` file.

### Using a Local Server (Optional)
For development purposes, you can use a local server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server

# Using VS Code
# Install "Live Server" extension and click "Go Live"
```

Then open `http://localhost:8000` in your browser.

## ⌨️ Keyboard Shortcuts

| Key | Function |
|-----|----------|
| `0-9` | Number input |
| `.` | Decimal point |
| `+` | Addition |
| `-` | Subtraction |
| `*` | Multiplication |
| `/` | Division |
| `%` | Percentage |
| `Enter` or `=` | Calculate result |
| `Backspace` | Delete last digit |
| `Escape` or `C` | Clear all |

## 🎨 Design Highlights

### Color Scheme
- **Background**: Dark gradient (#1a1a2e to #16213e)
- **Calculator Body**: Deep blue (#0f3460)
- **Display**: Darker blue (#0a2239) with white text
- **Number Buttons**: Dark gray (#2d2d44)
- **Operator Buttons**: Vibrant orange (#ff6b35)
- **Clear Button**: Red accent (#e74c3c)
- **Delete Button**: Yellow accent (#f39c12)
- **Equals Button**: Green accent (#2ecc71)

### Typography
- **Display**: Roboto Mono (monospace for numbers)
- **Buttons**: Roboto (clean, modern sans-serif)
- **Google Fonts**: Imported for consistent rendering

### Layout
- **Grid System**: CSS Grid for perfect button alignment
- **Responsive Breakpoints**: Optimized for mobile (≤500px) and small mobile (≤350px)
- **Touch-Friendly**: Minimum 60px button height for easy tapping

## 🛠️ Technologies

- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with Grid, Flexbox, and animations
- **JavaScript (ES6+)**: Object-oriented calculator logic
- **Google Fonts**: Roboto and Roboto Mono font families

## 🧪 Testing

The calculator has been tested for:
- ✅ Basic arithmetic: `5 + 3 = 8`
- ✅ Decimals: `5.5 + 2.3 = 7.8`
- ✅ Division by zero: `5 / 0 = Error`
- ✅ Chain operations: `5 + 3 - 2 = 6`
- ✅ Negative numbers: `5 - 8 = -3`
- ✅ Percentage: `100 × 50% = 0.5`
- ✅ Clear function: Resets everything
- ✅ Delete function: Removes last digit
- ✅ Multiple decimals prevented: `5.5.5 → 5.55`
- ✅ Keyboard input works correctly
- ✅ Responsive on all device sizes
- ✅ Button animations work smoothly
- ✅ No JavaScript errors in console

## 📁 Project Structure

```
simple-calculator/
├── index.html          # Main HTML file (entry point)
├── style.css           # All styling and responsive design
├── script.js           # Calculator logic and event handlers
└── README.md           # Project documentation
```

## 🌟 Code Quality

- **Clean Code**: Well-organized, readable, and maintainable
- **Comments**: Comprehensive inline documentation
- **Naming Conventions**: Consistent camelCase for JavaScript
- **Modular Functions**: Separate concerns and single responsibility
- **Error Handling**: Graceful degradation and user feedback
- **No Dependencies**: Pure vanilla JavaScript, no external libraries

## 🤝 Contributing

Contributions are welcome! If you'd like to improve the calculator:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see below for details:

```
MIT License

Copyright (c) 2026 Anil Kumar Putta

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 👨‍💻 Author

**Anil Kumar Putta**
- GitHub: [@Anilkumarputta](www.linkedin.com/in/anil-putta)

## 🙏 Acknowledgments

- Design inspiration from iOS Calculator and Google Material Design
- Google Fonts for beautiful typography
- The web development community for best practices and patterns

---

<div align="center">
  Made with ❤️ by Anil Kumar Putta
  <br>
  ⭐ Star this repository if you found it helpful!
</div>
