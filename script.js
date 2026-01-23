// Calculator Class
class Calculator {
    constructor(previousOperandElement, currentOperandElement) {
        this.previousOperandElement = previousOperandElement;
        this.currentOperandElement = currentOperandElement;
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
        
        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
        this.shouldResetScreen = true;
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

// Number buttons
const numberButtons = document.querySelectorAll('[data-number]');
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.textContent);
        calculator.updateDisplay();
        addPressAnimation(button);
    });
});

// Operation buttons
const operationButtons = document.querySelectorAll('[data-operation]');
operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.textContent);
        calculator.updateDisplay();
        addPressAnimation(button);
    });
});

// Equals button
const equalsButton = document.querySelector('[data-equals]');
equalsButton.addEventListener('click', () => {
    calculator.compute();
    calculator.updateDisplay();
    addPressAnimation(equalsButton);
});

// Clear button
const clearButton = document.querySelector('[data-clear]');
clearButton.addEventListener('click', () => {
    calculator.clear();
    calculator.updateDisplay();
    addPressAnimation(clearButton);
});

// Delete button
const deleteButton = document.querySelector('[data-delete]');
deleteButton.addEventListener('click', () => {
    calculator.deleteDigit();
    calculator.updateDisplay();
    addPressAnimation(deleteButton);
});

// Add press animation to button
function addPressAnimation(button) {
    button.classList.add('pressed');
    setTimeout(() => {
        button.classList.remove('pressed');
    }, 200);
}

// Keyboard support
document.addEventListener('keydown', (e) => {
    // Prevent default for certain keys
    if (['Enter', 'Escape'].includes(e.key)) {
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
