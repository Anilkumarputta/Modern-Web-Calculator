// Calculator Class
class Calculator {
    constructor(previousOperandElement, currentOperandElement) {
        this.previousOperandElement = previousOperandElement;
        this.currentOperandElement = currentOperandElement;
        this.memory = 0;
        this.history = [];
        this.soundEnabled = true;
        this.clear();
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

        // Prevent multiple decimal points
        if (number === '.' && this.currentOperand.includes('.')) return;

        // Handle first digit
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand += number;
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
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);

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
            default:
                return;
        }

        // Round to avoid floating point precision issues
        computation = Math.round(computation * 100000000) / 100000000;
        
        // Add to history
        this.addToHistory(expression, computation);
        
        this.currentOperand = computation.toString();
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

// Number buttons
const numberButtons = document.querySelectorAll('[data-number]');
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.textContent);
        calculator.updateDisplay();
        addPressAnimation(button);
        playSound();
    });
});

// Operation buttons
const operationButtons = document.querySelectorAll('[data-operation]');
operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.textContent);
        calculator.updateDisplay();
        addPressAnimation(button);
        playSound();
    });
});

// Equals button
const equalsButton = document.querySelector('[data-equals]');
equalsButton.addEventListener('click', () => {
    calculator.compute();
    calculator.updateDisplay();
    addPressAnimation(equalsButton);
    playSound();
});

// Clear button
const clearButton = document.querySelector('[data-clear]');
clearButton.addEventListener('click', () => {
    calculator.clear();
    calculator.updateDisplay();
    addPressAnimation(clearButton);
    playSound();
});

// Delete button
const deleteButton = document.querySelector('[data-delete]');
deleteButton.addEventListener('click', () => {
    calculator.deleteDigit();
    calculator.updateDisplay();
    addPressAnimation(deleteButton);
    playSound();
});

// Negate button
const negateButton = document.querySelector('[data-negate]');
negateButton.addEventListener('click', () => {
    calculator.negate();
    calculator.updateDisplay();
    addPressAnimation(negateButton);
    playSound();
});

// Memory buttons
const memoryButtons = document.querySelectorAll('[data-memory]');
memoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        const action = button.dataset.memory;
        switch (action) {
            case 'clear':
                calculator.memoryClear();
                break;
            case 'recall':
                calculator.memoryRecall();
                break;
            case 'add':
                calculator.memoryAdd();
                break;
            case 'subtract':
                calculator.memorySubtract();
                break;
        }
        calculator.updateDisplay();
        addPressAnimation(button);
        playSound();
    });
});

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

    // Numbers 0-9
    if (e.key >= '0' && e.key <= '9') {
        calculator.appendNumber(e.key);
        calculator.updateDisplay();
        highlightButton(`[data-number]`, e.key);
    }

    // Decimal point
    if (e.key === '.') {
        calculator.appendNumber('.');
        calculator.updateDisplay();
        highlightButton(`[data-number]`, '.');
    }

    // Operations
    if (e.key === '+') {
        calculator.chooseOperation('+');
        calculator.updateDisplay();
        highlightButton(`[data-operation]`, '+');
    }

    if (e.key === '-') {
        calculator.chooseOperation('-');
        calculator.updateDisplay();
        highlightButton(`[data-operation]`, '-');
    }

    if (e.key === '*') {
        calculator.chooseOperation('×');
        calculator.updateDisplay();
        highlightButton(`[data-operation]`, '×');
    }

    if (e.key === '/') {
        calculator.chooseOperation('÷');
        calculator.updateDisplay();
        highlightButton(`[data-operation]`, '÷');
    }

    if (e.key === '%') {
        calculator.chooseOperation('%');
        calculator.updateDisplay();
        highlightButton(`[data-operation]`, '%');
    }

    // Equals
    if (e.key === 'Enter' || e.key === '=') {
        calculator.compute();
        calculator.updateDisplay();
        highlightButton('[data-equals]');
    }

    // Clear
    if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
        calculator.clear();
        calculator.updateDisplay();
        highlightButton('[data-clear]');
    }

    // Delete/Backspace
    if (e.key === 'Backspace') {
        calculator.deleteDigit();
        calculator.updateDisplay();
        highlightButton('[data-delete]');
    }
});

// Highlight button when keyboard is pressed
function highlightButton(selector, textContent = null) {
    let button;
    if (textContent) {
        const buttons = document.querySelectorAll(selector);
        buttons.forEach(btn => {
            if (btn.textContent === textContent) {
                button = btn;
            }
        });
    } else {
        button = document.querySelector(selector);
    }

    if (button) {
        addPressAnimation(button);
    }
}

// Initialize display
calculator.updateDisplay();
