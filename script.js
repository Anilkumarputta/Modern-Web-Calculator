/**
 * SmartCalc - Modern Web Calculator
 * @author Anil Kumar Putta
 * @description Feature-rich calculator with keyboard support and responsive design
 */

// Calculator Class
class Calculator {
    constructor(previousOperandElement, currentOperandElement) {
        this.previousOperandElement = previousOperandElement;
        this.currentOperandElement = currentOperandElement;
        this.memory = 0;
        this.history = [];
        this.soundEnabled = true;
        this.mode = 'standard'; // standard, scientific, programmer
        this.angleMode = 'DEG'; // DEG or RAD for scientific mode
        this.numberBase = 10; // 10 (DEC), 16 (HEX), 8 (OCT), 2 (BIN) for programmer mode
        this.clear();
    }

    // Set calculator mode
    setMode(mode) {
        this.mode = mode;
        this.clear();
        updateModeIndicator();
        if (mode === 'programmer') {
            document.getElementById('base-display').style.display = 'block';
            this.updateBaseDisplay();
        } else {
            document.getElementById('base-display').style.display = 'none';
        }
    }

    // Toggle angle mode (DEG/RAD)
    toggleAngleMode() {
        this.angleMode = this.angleMode === 'DEG' ? 'RAD' : 'DEG';
        showToast(`Angle mode: ${this.angleMode}`);
        updateModeIndicator();
    }

    // Convert degrees to radians
    toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    // Scientific functions
    sqrt() {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current) || current < 0) {
            this.showError('Invalid input');
            return;
        }
        this.currentOperand = Math.sqrt(current).toString();
        this.shouldResetScreen = true;
        this.addToHistory(`√(${current})`, parseFloat(this.currentOperand));
    }

    square() {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        this.currentOperand = (current * current).toString();
        this.shouldResetScreen = true;
        this.addToHistory(`(${current})²`, parseFloat(this.currentOperand));
    }

    power() {
        if (this.currentOperand === '' || this.currentOperand === '.') return;
        if (this.previousOperand !== '' && !this.shouldResetScreen) {
            this.compute();
        }
        this.operation = '^';
        this.previousOperand = this.currentOperand;
        this.shouldResetScreen = true;
    }

    sin() {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        const value = this.angleMode === 'DEG' ? this.toRadians(current) : current;
        this.currentOperand = Math.sin(value).toString();
        this.shouldResetScreen = true;
        this.addToHistory(`sin(${current})`, parseFloat(this.currentOperand));
    }

    cos() {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        const value = this.angleMode === 'DEG' ? this.toRadians(current) : current;
        this.currentOperand = Math.cos(value).toString();
        this.shouldResetScreen = true;
        this.addToHistory(`cos(${current})`, parseFloat(this.currentOperand));
    }

    tan() {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        const value = this.angleMode === 'DEG' ? this.toRadians(current) : current;
        this.currentOperand = Math.tan(value).toString();
        this.shouldResetScreen = true;
        this.addToHistory(`tan(${current})`, parseFloat(this.currentOperand));
    }

    log() {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current) || current <= 0) {
            this.showError('Invalid input');
            return;
        }
        this.currentOperand = Math.log10(current).toString();
        this.shouldResetScreen = true;
        this.addToHistory(`log(${current})`, parseFloat(this.currentOperand));
    }

    ln() {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current) || current <= 0) {
            this.showError('Invalid input');
            return;
        }
        this.currentOperand = Math.log(current).toString();
        this.shouldResetScreen = true;
        this.addToHistory(`ln(${current})`, parseFloat(this.currentOperand));
    }

    exp() {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        this.currentOperand = Math.exp(current).toString();
        this.shouldResetScreen = true;
        this.addToHistory(`e^${current}`, parseFloat(this.currentOperand));
    }

    factorial() {
        const current = parseInt(this.currentOperand);
        if (isNaN(current) || current < 0 || current > 170) {
            this.showError('Invalid input');
            return;
        }
        let result = 1;
        for (let i = 2; i <= current; i++) {
            result *= i;
        }
        this.currentOperand = result.toString();
        this.shouldResetScreen = true;
        this.addToHistory(`${current}!`, result);
    }

    insertConstant(constant) {
        if (constant === 'π') {
            this.currentOperand = Math.PI.toString();
        } else if (constant === 'e') {
            this.currentOperand = Math.E.toString();
        }
        this.shouldResetScreen = true;
    }

    // Programmer mode functions
    setBase(base) {
        const current = this.getCurrentDecimalValue();
        this.numberBase = base;
        this.currentOperand = this.formatNumberInBase(current, base);
        this.updateBaseDisplay();
        showToast(`Base: ${this.getBaseName(base)}`);
    }

    getCurrentDecimalValue() {
        if (this.mode !== 'programmer') {
            return parseInt(this.currentOperand) || 0;
        }
        // Parse based on current base
        return parseInt(this.currentOperand, this.numberBase) || 0;
    }

    formatNumberInBase(decValue, base) {
        if (isNaN(decValue)) return '0';
        const value = Math.floor(decValue);
        if (value < 0) return '0'; // Programmer mode doesn't handle negative
        return value.toString(base).toUpperCase();
    }

    getBaseName(base) {
        const names = {2: 'BIN', 8: 'OCT', 10: 'DEC', 16: 'HEX'};
        return names[base] || 'DEC';
    }

    updateBaseDisplay() {
        if (this.mode !== 'programmer') return;
        const decValue = this.getCurrentDecimalValue();
        document.getElementById('hex-value').textContent = this.formatNumberInBase(decValue, 16);
        document.getElementById('dec-value').textContent = this.formatNumberInBase(decValue, 10);
        document.getElementById('oct-value').textContent = this.formatNumberInBase(decValue, 8);
        document.getElementById('bin-value').textContent = this.formatNumberInBase(decValue, 2);
    }

    bitwiseOperation(operation) {
        if (this.currentOperand === '' || this.currentOperand === '.') return;
        if (this.previousOperand !== '' && !this.shouldResetScreen) {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.shouldResetScreen = true;
    }

    bitShift(direction) {
        const current = this.getCurrentDecimalValue();
        let result;
        if (direction === 'left') {
            result = current << 1;
            this.addToHistory(`${current} << 1`, result);
        } else {
            result = current >> 1;
            this.addToHistory(`${current} >> 1`, result);
        }
        this.currentOperand = this.formatNumberInBase(result, this.numberBase);
        this.shouldResetScreen = true;
        this.updateBaseDisplay();
    }

    bitNot() {
        const current = this.getCurrentDecimalValue();
        // Use 32-bit NOT
        const result = ~current >>> 0; // Convert to unsigned
        this.currentOperand = this.formatNumberInBase(result, this.numberBase);
        this.shouldResetScreen = true;
        this.updateBaseDisplay();
        this.addToHistory(`NOT ${current}`, result);
    }

    // Clear all values
    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = false;
        this.removeErrorState();
    }

    // Delete last digit
    deleteDigit() {
        if (this.shouldResetScreen) return;
        if (this.currentOperand === '0') return;
        if (this.currentOperand.length === 1) {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.slice(0, -1);
        }
    }

    // Negate current number
    negate() {
        if (this.currentOperand === '0' || this.currentOperand === 'Cannot divide by zero') return;
        if (this.currentOperand.startsWith('-')) {
            this.currentOperand = this.currentOperand.slice(1);
        } else {
            this.currentOperand = '-' + this.currentOperand;
        }
    }

    // Memory operations
    memoryClear() {
        this.memory = 0;
        showToast('Memory cleared');
    }

    memoryRecall() {
        this.currentOperand = this.memory.toString();
        this.shouldResetScreen = true;
        showToast('Memory recalled: ' + this.memory);
    }

    memoryAdd() {
        const current = parseFloat(this.currentOperand);
        if (!isNaN(current)) {
            this.memory += current;
            showToast('Added to memory: ' + this.memory);
        }
    }

    memorySubtract() {
        const current = parseFloat(this.currentOperand);
        if (!isNaN(current)) {
            this.memory -= current;
            showToast('Subtracted from memory: ' + this.memory);
        }
    }

    // Append number to display
    appendNumber(number) {
        // Reset screen if needed (after equals or error)
        if (this.shouldResetScreen) {
            this.currentOperand = '0';
            this.shouldResetScreen = false;
        }

        // In programmer mode, validate hex digits
        if (this.mode === 'programmer') {
            const validDigits = {
                2: ['0', '1'],
                8: ['0', '1', '2', '3', '4', '5', '6', '7'],
                10: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
                16: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F']
            };
            if (!validDigits[this.numberBase].includes(number.toUpperCase())) {
                return; // Invalid digit for current base
            }
            // No decimal points in programmer mode
            if (number === '.') return;
        }

        // Prevent multiple decimal points
        if (number === '.' && this.currentOperand.includes('.')) return;

        // Handle first digit
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand += number;
        }
        
        // Update base display in programmer mode
        if (this.mode === 'programmer') {
            this.updateBaseDisplay();
        }
        
        this.removeErrorState();
    }

    // Choose operation
    chooseOperation(operation) {
        // If current operand is empty or just a decimal point, don't proceed
        if (this.currentOperand === '' || this.currentOperand === '.') return;

        // If there's a previous operand, compute first
        if (this.previousOperand !== '' && !this.shouldResetScreen) {
            this.compute();
        }

        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.shouldResetScreen = true;
    }

    // Perform calculation
    compute() {
        let computation;
        let prev, current;
        
        // For programmer mode, use decimal values
        if (this.mode === 'programmer') {
            prev = parseInt(this.previousOperand, this.numberBase) || 0;
            current = parseInt(this.currentOperand, this.numberBase) || 0;
        } else {
            prev = parseFloat(this.previousOperand);
            current = parseFloat(this.currentOperand);
        }

        // If either value is not a number, return
        if (isNaN(prev) || isNaN(current)) return;

        const expression = `${this.previousOperand} ${this.operation} ${this.currentOperand}`;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                // Handle division by zero
                if (current === 0) {
                    this.showError('Cannot divide by zero');
                    return;
                }
                computation = prev / current;
                break;
            case '%':
                computation = prev / 100;
                break;
            case '^':
                computation = Math.pow(prev, current);
                break;
            // Bitwise operations for programmer mode
            case 'AND':
                computation = prev & current;
                break;
            case 'OR':
                computation = prev | current;
                break;
            case 'XOR':
                computation = prev ^ current;
                break;
            case '<<':
                computation = prev << current;
                break;
            case '>>':
                computation = prev >> current;
                break;
            default:
                return;
        }

        // Round to avoid floating point precision issues (except for programmer mode)
        if (this.mode !== 'programmer') {
            computation = Math.round(computation * 100000000) / 100000000;
        } else {
            computation = Math.floor(computation); // Integer only for programmer mode
        }
        
        // Add to history
        this.addToHistory(expression, computation);
        
        // Format result based on mode
        if (this.mode === 'programmer') {
            this.currentOperand = this.formatNumberInBase(computation, this.numberBase);
            this.updateBaseDisplay();
        } else {
            this.currentOperand = computation.toString();
        }
        
        this.operation = undefined;
        this.previousOperand = '';
        this.shouldResetScreen = true;
        
        // Trigger pulse animation
        this.currentOperandElement.classList.add('pulse');
        setTimeout(() => {
            this.currentOperandElement.classList.remove('pulse');
        }, 500);
    }

    // Add calculation to history
    addToHistory(expression, result) {
        this.history.unshift({ expression, result });
        if (this.history.length > 50) {
            this.history.pop();
        }
        updateHistoryDisplay();
    }

    // Clear history
    clearHistory() {
        this.history = [];
        updateHistoryDisplay();
        showToast('History cleared');
    }

    // Show error message
    showError(message) {
        this.currentOperand = message;
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = true;
        this.currentOperandElement.parentElement.classList.add('error');
    }

    // Remove error state
    removeErrorState() {
        this.currentOperandElement.parentElement.classList.remove('error');
    }

    // Format number for display
    getDisplayNumber(number) {
        if (number === 'Cannot divide by zero' || number === 'Error') {
            return number;
        }
        
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;

        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            // Add commas for thousands
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            });
        }

        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    // Update display
    updateDisplay() {
        // Update current operand
        const displayValue = this.getDisplayNumber(this.currentOperand);
        this.currentOperandElement.textContent = displayValue;

        // Auto-resize text based on length
        if (displayValue.length > 12) {
            this.currentOperandElement.classList.add('smaller');
            this.currentOperandElement.classList.remove('small');
        } else if (displayValue.length > 9) {
            this.currentOperandElement.classList.add('small');
            this.currentOperandElement.classList.remove('smaller');
        } else {
            this.currentOperandElement.classList.remove('small', 'smaller');
        }

        // Update previous operand
        if (this.operation != null) {
            this.previousOperandElement.textContent = 
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandElement.textContent = '';
        }
    }
}

// Initialize calculator
const previousOperandElement = document.querySelector('[data-previous-operand]');
const currentOperandElement = document.querySelector('[data-current-operand]');
const calculator = new Calculator(previousOperandElement, currentOperandElement);

// Sound effects
const clickSound = new Audio('data:audio/wav;base64,UklGRhwAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQA=');

function playSound() {
    if (calculator.soundEnabled) {
        clickSound.currentTime = 0;
        clickSound.play().catch(() => {}); // Ignore errors
    }
}

// Toast notification
function showToast(message) {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.style.cssText = `
            position: fixed;
            bottom: 2rem;
            left: 50%;
            transform: translateX(-50%);
            background: var(--calculator-bg);
            color: var(--display-text);
            padding: 1rem 2rem;
            border-radius: 10px;
            box-shadow: var(--shadow);
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s;
        `;
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.opacity = '1';
    setTimeout(() => {
        toast.style.opacity = '0';
    }, 2000);
}

// Update history display
function updateHistoryDisplay() {
    const historyList = document.getElementById('history-list');
    if (calculator.history.length === 0) {
        historyList.innerHTML = '<p class="history-empty">No calculations yet</p>';
    } else {
        historyList.innerHTML = calculator.history.map((item, index) => `
            <div class="history-item" data-history-index="${index}">
                <div class="expression">${item.expression}</div>
                <div class="result">= ${calculator.getDisplayNumber(item.result.toString())}</div>
            </div>
        `).join('');
        
        // Add click handlers to history items
        document.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', () => {
                const index = parseInt(item.dataset.historyIndex);
                const historyItem = calculator.history[index];
                calculator.currentOperand = historyItem.result.toString();
                calculator.shouldResetScreen = true;
                calculator.updateDisplay();
                playSound();
            });
        });
    }
}

// Theme toggle
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    themeToggle.textContent = document.body.classList.contains('light-theme') ? '☀️' : '🌙';
    playSound();
    showToast(document.body.classList.contains('light-theme') ? 'Light theme' : 'Dark theme');
});

// History toggle
const historyToggle = document.getElementById('history-toggle');
const historySidebar = document.getElementById('history-sidebar');
historyToggle.addEventListener('click', () => {
    historySidebar.classList.toggle('active');
    playSound();
});

// Sound toggle
const soundToggle = document.getElementById('sound-toggle');
soundToggle.addEventListener('click', () => {
    calculator.soundEnabled = !calculator.soundEnabled;
    soundToggle.textContent = calculator.soundEnabled ? '🔊' : '🔇';
    playSound();
    showToast(calculator.soundEnabled ? 'Sound on' : 'Sound off');
});

// Clear history
const clearHistoryBtn = document.getElementById('clear-history');
clearHistoryBtn.addEventListener('click', () => {
    calculator.clearHistory();
    playSound();
});

// Copy result
const copyBtn = document.getElementById('copy-result');
copyBtn.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(calculator.currentOperand);
        copyBtn.classList.add('copied');
        showToast('Copied to clipboard!');
        setTimeout(() => copyBtn.classList.remove('copied'), 600);
    } catch (err) {
        showToast('Failed to copy');
    }
    playSound();
});

// Button Layout Definitions
const buttonLayouts = {
    standard: [
        {text: 'C', class: 'btn-clear', action: 'clear'},
        {text: 'DEL', class: 'btn-delete', action: 'delete'},
        {text: 'MC', class: 'btn-memory', action: 'memory', subaction: 'clear'},
        {text: 'MR', class: 'btn-memory', action: 'memory', subaction: 'recall'},
        {text: 'M+', class: 'btn-memory', action: 'memory', subaction: 'add'},
        {text: 'M-', class: 'btn-memory', action: 'memory', subaction: 'subtract'},
        {text: '%', class: 'btn-operator', action: 'operation'},
        {text: '÷', class: 'btn-operator', action: 'operation'},
        {text: '7', class: 'btn-number', action: 'number'},
        {text: '8', class: 'btn-number', action: 'number'},
        {text: '9', class: 'btn-number', action: 'number'},
        {text: '×', class: 'btn-operator', action: 'operation'},
        {text: '4', class: 'btn-number', action: 'number'},
        {text: '5', class: 'btn-number', action: 'number'},
        {text: '6', class: 'btn-number', action: 'number'},
        {text: '-', class: 'btn-operator', action: 'operation'},
        {text: '1', class: 'btn-number', action: 'number'},
        {text: '2', class: 'btn-number', action: 'number'},
        {text: '3', class: 'btn-number', action: 'number'},
        {text: '+', class: 'btn-operator', action: 'operation'},
        {text: '+/-', class: 'btn-special', action: 'negate'},
        {text: '0', class: 'btn-number', action: 'number'},
        {text: '.', class: 'btn-number', action: 'number'},
        {text: '=', class: 'btn-equals', action: 'equals'}
    ],
    scientific: [
        {text: 'C', class: 'btn-clear', action: 'clear'},
        {text: 'DEL', class: 'btn-delete', action: 'delete'},
        {text: calculator.angleMode || 'DEG', class: 'btn-scientific', action: 'angleMode', id: 'angle-mode-btn'},
        {text: 'π', class: 'btn-scientific', action: 'constant'},
        {text: 'e', class: 'btn-scientific', action: 'constant'},
        {text: 'x²', class: 'btn-scientific', action: 'square'},
        {text: 'xⁿ', class: 'btn-scientific', action: 'power'},
        {text: '√', class: 'btn-scientific', action: 'sqrt'},
        {text: 'sin', class: 'btn-scientific', action: 'sin'},
        {text: 'cos', class: 'btn-scientific', action: 'cos'},
        {text: 'tan', class: 'btn-scientific', action: 'tan'},
        {text: '÷', class: 'btn-operator', action: 'operation'},
        {text: 'log', class: 'btn-scientific', action: 'log'},
        {text: 'ln', class: 'btn-scientific', action: 'ln'},
        {text: 'eˣ', class: 'btn-scientific', action: 'exp'},
        {text: '×', class: 'btn-operator', action: 'operation'},
        {text: '7', class: 'btn-number', action: 'number'},
        {text: '8', class: 'btn-number', action: 'number'},
        {text: '9', class: 'btn-number', action: 'number'},
        {text: '-', class: 'btn-operator', action: 'operation'},
        {text: '4', class: 'btn-number', action: 'number'},
        {text: '5', class: 'btn-number', action: 'number'},
        {text: '6', class: 'btn-number', action: 'number'},
        {text: '+', class: 'btn-operator', action: 'operation'},
        {text: '1', class: 'btn-number', action: 'number'},
        {text: '2', class: 'btn-number', action: 'number'},
        {text: '3', class: 'btn-number', action: 'number'},
        {text: 'n!', class: 'btn-scientific', action: 'factorial'},
        {text: '+/-', class: 'btn-special', action: 'negate'},
        {text: '0', class: 'btn-number', action: 'number'},
        {text: '.', class: 'btn-number', action: 'number'},
        {text: '=', class: 'btn-equals', action: 'equals'}
    ],
    programmer: [
        {text: 'CLR', class: 'btn-clear', action: 'clear'},
        {text: 'DEL', class: 'btn-delete', action: 'delete'},
        {text: 'HEX', class: 'btn-programmer', action: 'base', value: 16},
        {text: 'DEC', class: 'btn-programmer', action: 'base', value: 10},
        {text: 'OCT', class: 'btn-programmer', action: 'base', value: 8},
        {text: 'BIN', class: 'btn-programmer', action: 'base', value: 2},
        {text: 'AND', class: 'btn-bitwise', action: 'bitwise'},
        {text: 'OR', class: 'btn-bitwise', action: 'bitwise'},
        {text: 'XOR', class: 'btn-bitwise', action: 'bitwise'},
        {text: 'NOT', class: 'btn-bitwise', action: 'bitNot'},
        {text: '<<', class: 'btn-bitwise', action: 'shiftLeft'},
        {text: '>>', class: 'btn-bitwise', action: 'shiftRight'},
        {text: 'A', class: 'btn-number', action: 'number'},
        {text: 'B', class: 'btn-number', action: 'number'},
        {text: 'C', class: 'btn-number', action: 'number'},
        {text: 'D', class: 'btn-number', action: 'number'},
        {text: 'E', class: 'btn-number', action: 'number'},
        {text: 'F', class: 'btn-number', action: 'number'},
        {text: '7', class: 'btn-number', action: 'number'},
        {text: '8', class: 'btn-number', action: 'number'},
        {text: '9', class: 'btn-number', action: 'number'},
        {text: '÷', class: 'btn-operator', action: 'operation'},
        {text: '4', class: 'btn-number', action: 'number'},
        {text: '5', class: 'btn-number', action: 'number'},
        {text: '6', class: 'btn-number', action: 'number'},
        {text: '×', class: 'btn-operator', action: 'operation'},
        {text: '1', class: 'btn-number', action: 'number'},
        {text: '2', class: 'btn-number', action: 'number'},
        {text: '3', class: 'btn-number', action: 'number'},
        {text: '-', class: 'btn-operator', action: 'operation'},
        {text: '0', class: 'btn-number', action: 'number'},
        {text: '=', class: 'btn-equals', action: 'equals'},
        {text: '+', class: 'btn-operator', action: 'operation', colspan: 2}
    ]
};

// Generate buttons based on mode
function generateButtons(mode) {
    const container = document.getElementById('button-container');
    container.innerHTML = '';
    
    const layout = buttonLayouts[mode];
    layout.forEach(btnDef => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `btn ${btnDef.class}`;
        button.textContent = btnDef.text;
        if (btnDef.id) button.id = btnDef.id;
        if (btnDef.colspan) button.style.gridColumn = `span ${btnDef.colspan}`;
        
        // Add event listener based on action
        button.addEventListener('click', () => {
            handleButtonClick(btnDef);
            addPressAnimation(button);
            playSound();
        });
        
        container.appendChild(button);
    });
}

// Handle button clicks
function handleButtonClick(btnDef) {
    switch (btnDef.action) {
        case 'number':
            calculator.appendNumber(btnDef.text);
            break;
        case 'operation':
            calculator.chooseOperation(btnDef.text);
            break;
        case 'equals':
            calculator.compute();
            break;
        case 'clear':
            calculator.clear();
            break;
        case 'delete':
            calculator.deleteDigit();
            break;
        case 'negate':
            calculator.negate();
            break;
        case 'memory':
            if (btnDef.subaction === 'clear') calculator.memoryClear();
            else if (btnDef.subaction === 'recall') calculator.memoryRecall();
            else if (btnDef.subaction === 'add') calculator.memoryAdd();
            else if (btnDef.subaction === 'subtract') calculator.memorySubtract();
            break;
        case 'sqrt':
            calculator.sqrt();
            break;
        case 'square':
            calculator.square();
            break;
        case 'power':
            calculator.power();
            break;
        case 'sin':
            calculator.sin();
            break;
        case 'cos':
            calculator.cos();
            break;
        case 'tan':
            calculator.tan();
            break;
        case 'log':
            calculator.log();
            break;
        case 'ln':
            calculator.ln();
            break;
        case 'exp':
            calculator.exp();
            break;
        case 'factorial':
            calculator.factorial();
            break;
        case 'constant':
            calculator.insertConstant(btnDef.text);
            break;
        case 'angleMode':
            calculator.toggleAngleMode();
            generateButtons(calculator.mode); // Regenerate to update button text
            break;
        case 'base':
            calculator.setBase(btnDef.value);
            break;
        case 'bitwise':
            calculator.bitwiseOperation(btnDef.text);
            break;
        case 'bitNot':
            calculator.bitNot();
            break;
        case 'shiftLeft':
            calculator.bitShift('left');
            break;
        case 'shiftRight':
            calculator.bitShift('right');
            break;
    }
    calculator.updateDisplay();
}

// Mode switcher
const modeBtns = document.querySelectorAll('[data-mode]');
modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const mode = btn.dataset.mode;
        calculator.setMode(mode);
        generateButtons(mode);
        
        // Update active state
        modeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        playSound();
    });
});

// Update mode indicator
function updateModeIndicator() {
    const indicator = document.getElementById('mode-indicator');
    let text = `${calculator.mode.charAt(0).toUpperCase() + calculator.mode.slice(1)} Mode`;
    if (calculator.mode === 'scientific') {
        text += ` (${calculator.angleMode})`;
    } else if (calculator.mode === 'programmer') {
        text += ` (${calculator.getBaseName(calculator.numberBase)})`;
    }
    indicator.textContent = text;
}

// Initialize with standard mode
generateButtons('standard');
updateModeIndicator();

// Add press animation to button
function addPressAnimation(button) {
    button.classList.add('pressed');
    button.classList.add('ripple');
    setTimeout(() => {
        button.classList.remove('pressed');
        button.classList.remove('ripple');
    }, 200);
}

// Keyboard support
document.addEventListener('keydown', (e) => {
    // Prevent default for calculator keys
    if (['Enter', 'Escape', '/', '*', '+', '-', '%'].includes(e.key)) {
        e.preventDefault();
    }

    // Numbers 0-9 and hex digits A-F
    if ((e.key >= '0' && e.key <= '9') || (calculator.mode === 'programmer' && e.key.match(/[A-Fa-f]/))) {
        calculator.appendNumber(e.key.toUpperCase());
        calculator.updateDisplay();
    }

    // Decimal point (not in programmer mode)
    if (e.key === '.' && calculator.mode !== 'programmer') {
        calculator.appendNumber('.');
        calculator.updateDisplay();
    }

    // Operations
    if (e.key === '+') {
        calculator.chooseOperation('+');
        calculator.updateDisplay();
    }

    if (e.key === '-') {
        calculator.chooseOperation('-');
        calculator.updateDisplay();
    }

    if (e.key === '*') {
        calculator.chooseOperation('×');
        calculator.updateDisplay();
    }

    if (e.key === '/') {
        calculator.chooseOperation('÷');
        calculator.updateDisplay();
    }

    if (e.key === '%') {
        calculator.chooseOperation('%');
        calculator.updateDisplay();
    }

    // Equals
    if (e.key === 'Enter' || e.key === '=') {
        calculator.compute();
        calculator.updateDisplay();
    }

    // Clear
    if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
        calculator.clear();
        calculator.updateDisplay();
    }

    // Delete/Backspace
    if (e.key === 'Backspace') {
        calculator.deleteDigit();
        calculator.updateDisplay();
    }
    
    playSound();
});

// Initialize display
calculator.updateDisplay();
