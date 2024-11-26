// 입력 처리를 담당하는 클래스
class InputHandler {
    #buttonInput;
    #keyboardInput;
    #input;
    #result;
    #observers;
    constructor() {
        this.handleButtonInput(); // 버튼 클릭 입력 처리
        this.handleKeyboardInput(); // 키보드 키다운 입력 처리
        this.#input = ''; // 입력값 초기화
        this.#result = ''; // 계산 결과 초기화
        this.#observers = []; // 옵저버 배열 추가
    }
    // 옵저버 등록 메서드
    addObserver(observer) {
        this.#observers.push(observer);
    }
    // 옵저버들에게 알림
    notifyObservers(value) {
        this.#observers.find(observer => observer instanceof Display).updateInput(this.#input);
        this.notifyCalculator(this.#input);
        this.#observers.find(observer => observer instanceof Display).updateResult(this.#result);
    }

    // calculator에 알림
    notifyCalculator(value) {
        // instanceof 는 이항 연산자임, 'a instanceof b 는 a가 b의 인스턴스인지 확인'
        this.#result = this.#observers.find(observer => observer instanceof Calculator).update(value);
    }
    
    // '버튼 클릭 입력' 처리 메서드
    handleButtonInput() {
        const buttonElements = document.querySelectorAll('.btn');
        buttonElements.forEach(button => {
            button.addEventListener('click', () => {
                this.handleInput(button.dataset.key);
            });
        });
    }

    // '키보드 키다운 입력' 처리 메서드
    handleKeyboardInput() {
        const keyboardInput = document.addEventListener('keydown', (event) => {
            const key = event.key;
            const button = document.querySelector(`[data-key="${key}"], [data-key2="${key}"]`);
            if (button) {
                button.click();
            }
        });

    }

    // value 입력 처리 메서드
    handleInput(value) {
        switch (value) {
            case '=':
                this.#input = this.#observers.find(observer => observer instanceof Calculator).calculate(this.#input);
                this.notifyObservers();
                return;
            case 'Clear':
                this.#input = '';
                this.notifyObservers();
                return;
            case 'Backspace':
                this.#input = this.#input.slice(0, -1);
                this.notifyObservers();
                return;
        }
        // 입력 유효성 검사 false 반환 시 처리 중단
        if (this.inputValidation(value) === false) {
            console.log('미완성 수식');
            return;
        } else {
            this.#input += value;
        }
        this.notifyObservers();
    }

    // 입력 유효성 검사 메서드
    inputValidation(value) {
        // 입력값 타입 확인
        const lastInput = this.#input.slice(-1);
        const lastTwoInput = this.#input.charAt(-2);
        const typeOfLastInput = this.isWhatType(lastInput);
        const typeOfLastTwoInput = this.isWhatType(lastTwoInput);

        // 입력값 타입에 따른 유효성 검사
        switch (this.isWhatType(value)) {
            case 'number':
                if (typeOfLastInput === 'rightParentheses') {
                    this.#input += 'x';
                }
                return true;
            case 'plusMinus':
                if (typeOfLastInput === 'plusMinus' || typeOfLastInput === 'mulDiv') {
                    this.#input = this.#input.slice(0, -1);
                }
                return true;
            case 'mulDiv':
                if (typeOfLastInput === 'leftParentheses') {
                    return false;
                } else if (typeOfLastInput === 'plusMinus' || typeOfLastTwoInput === 'leftParentheses') {
                    return false;
                } else if (this.#input === '') {
                    return false;
                } else if (typeOfLastInput === 'mulDiv') {
                    this.#input = this.#input.slice(0, -1);
                }
                return true;
            case 'leftParentheses':
                if (typeOfLastInput === 'number' || typeOfLastInput === 'rightParentheses') {
                    this.#input += 'x';
                }
                return true;
            case 'rightParentheses':
                const openCount = this.#input.match(/\(/g) || [];
                const closeCount = this.#input.match(/\)/g) || [];
                if (openCount.length <= closeCount.length) {
                    return false;
                }
                if (typeOfLastInput === 'plusMinus' || typeOfLastInput === 'mulDiv' || typeOfLastInput === 'leftParentheses') {
                    return false;
                }
                return true;
            case 'equal':
                if (typeOfLastInput === 'plusMinus' || typeOfLastInput === 'mulDiv' || typeOfLastInput === 'leftParentheses') {
                    return false;
                }
                return true;
        }
    }

    isWhatType(value) {
        // 정규표현식
        if (/[0-9]/.test(value)) {
            return 'number';
        }
        switch (value) {
            case '+':
            case '-':
                return 'plusMinus';
            case 'x':
            case '÷':
                return 'mulDiv';
            case '(':
                return 'leftParentheses';
            case ')':
                return 'rightParentheses';
            case '=':
                return 'equal';
        }
    }
}

// 화면 표시를 담당하는 클래스
class Display {
    constructor() {
        this.displayInput = document.querySelector('.display-input');
        this.displayResult = document.querySelector('.display-result');
    }

    updateInput(input) {
        this.displayInput.textContent = input;
    }

    updateResult(result) {
        this.displayResult.textContent = result;
    }
}

// 계산을 담당하는 클래스
class Calculator {
    #formula;
    constructor() {
        this.#formula = '';
    }

    // inputHandler에서 호출되는 메서드
    update(value) {
        if (this.validateInput(value) === true) {
            return this.calculate(value);
        } else {
            return '';
        }
    }

    // 식 유효성 검사 메서드
    validateInput(value) {
        const lastInput = value.slice(-1);
        switch (lastInput) {
            case '+':
            case '-':
            case 'x':
            case '÷':
            case '(':
                return false;
            default:
                return true;
        }
    }

    // 계산 총괄 메서드
    // 1. 계산순서: 괄호 -> 곱셈 나눗셈 -> 덧셈 뺄셈
    calculate(value) {
        value = this.calculateParentheses(value);
        console.log('parentheses:', value);
        value = this.calculateMulDiv(value);
        console.log('mulDiv:', value);
        value = this.calculatePlusMinus(value);
        console.log('plusMinus:', value);
        console.log('--------------');
        return value;
    }

    // 곱셈 나눗셈 계산 메서드
    calculateMulDiv(value) {
        while (value.match(/[0-9]+[-][0-9]+/)) {
            const formulaA = value.match(/[0-9]+[-][0-9]+/);
            value = value.replace(formulaA[0], formulaA[0].replace('-', '+-'));
        }
        while (value.match(/[-]?[0-9]+[x\÷][-]?[0-9]+/)) {
            // 첫번째 곱셈 나눗셈 찾기
            const formula = value.match(/[-]?[0-9]+[x\÷][-]?[0-9]+/);
            // formula 곱셈 나눗셈 계산 후 result에 결과 반환
            const [num1, operator, num2] = formula[0].split(/([x\÷])/);
            let result;
            switch (operator) {
            case 'x':
                result = Number(num1) * Number(num2);
                break;
            case '÷':
                result = Number(num1) / Number(num2);
                break;
            }
            // value에서 formula 찾아서 result로 변경
            value = value.replace(formula[0], String(result));
        }
        return value;
    }
    
    // 덧셈 뺄셈 계산 메서드
    calculatePlusMinus(value) {
        while (value.match(/[0-9]+[-][0-9]+/)) {
            const formula = value.match(/[0-9]+[-][0-9]+/);
            value = formula[0].replace('-', '+-');
        }
        while (value.match(/[-]?[0-9]+[+][-]?[0-9]+/)) {
            // 첫번째 덧셈 뺄셈 찾기
            const formula = value.match(/[-]?[0-9]+[+][-]?[0-9]+/);
            // formula 덧셈 뺄셈 계산 후 result에 결과 반환
            const [num1, operator, num2] = formula[0].split(/(\+)/);
            let result; 
            switch (operator) {
            case '+':
                result = Number(num1) + Number(num2);
                break;
            case '-':
                result = Number(num1) - Number(num2);
                break;
            }
            // value에서 formula 찾아서 result로 변경
            value = value.replace(formula[0], String(result));
        }
        return value;
    }

    // 괄호 계산 메서드
    calculateParentheses(value) {
        value = this.addParentheses(value);
        if (/\(\)/.test(value)) {
            value = value.replace(/\(\)/g, '');
        }
        while (value.includes('(')) {
            const minParentheses = this.findParentheses(value);
            const innerValue = minParentheses.slice(1, -1);
            const mulDivResult = this.calculateMulDiv(innerValue);
            const plusMinusResult = this.calculatePlusMinus(mulDivResult);
            value = value.replace(minParentheses, plusMinusResult);
        }
        return value;
    }
    
    // 괄호 추가 메서드
    addParentheses(value) {
        const openCount = value.match(/\(/g) || [];
        const closeCount = value.match(/\)/g) || [];
        // 열린 괄호가 더 많은 경우 차이만큼 닫힌 괄호 추가
        if (openCount.length > closeCount.length) {
            const difference = openCount.length - closeCount.length;
            for (let i = 0; i < difference; i++) {
                value += ')';
            }
        }
        return value;
    }
    
    // 안쪽 괄호 찾기 메서드
    findParentheses(value) {
        const parentheses = value.match(/\([^)]+\)/);
        return parentheses[0];
    }
}

class OperatorStrategy { }

class NumberStrategy { }

class UpdateDisplayState { }

class CalculatorState { }


// 인스턴스 생성
const inputHandler = new InputHandler();
const display = new Display();
const calculator = new Calculator();
inputHandler.addObserver(display);
inputHandler.addObserver(calculator);