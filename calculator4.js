// 입력 처리를 담당하는 클래스
class InputHandler {
    #buttonInput;
    #keyboardInput;
    #input;
    #observers;
    constructor() {
        this.handleButtonInput(); // 버튼 클릭 입력 처리
        this.handleKeyboardInput(); // 키보드 키다운 입력 처리
        this.#input = ''; // 입력값 초기화
        this.#observers = []; // 옵저버 배열 추가
    }
    // 옵저버 등록 메서드
    addObserver(observer) {
        this.#observers.push(observer);
    }
    // 옵저버들에게 알림
    notifyObservers() {
        this.#observers.forEach(observer => observer.update(this.#input));
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
                // this.calculate(); 미완성 메서드
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
        const typeOfLastInput = this.isWhatType(lastInput);

        // 입력값 타입에 따른 유효성 검사
        switch (this.isWhatType(value)) {
            case 'number':
                if (typeOfLastInput === 'rightParentheses') {
                    this.#input += '*';
                }
                return true;
            case 'operator':
                if (typeOfLastInput === 'operator') {
                    this.#input = this.#input.slice(0, -1);
                } else if (typeOfLastInput === 'leftParentheses') {
                    return false;
                } else if (this.#input === '') {
                    return false;
                }
                return true;
            case 'leftParentheses':
                if (typeOfLastInput === 'number' || typeOfLastInput === 'rightParentheses') {
                    this.#input += '*';
                }
                return true;
            case 'rightParentheses':
                const openCount = this.#input.match(/\(/g) || [];
                const closeCount = this.#input.match(/\)/g) || [];
                if (openCount.length <= closeCount.length) {
                    return false;
                }
                if (typeOfLastInput === 'operator' || typeOfLastInput === 'leftParentheses') {
                    return false;
                }
                return true;
            case 'equal':
                if (typeOfLastInput === 'operator' || typeOfLastInput === 'leftParentheses') {
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
            case '*':
            case '/':
                return 'operator';
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

    update(value) {
        this.displayInput.textContent = value;
    }
}

// 계산을 담당하는 클래스
class Calculator {
    #formula;
    constructor() {
        this.#formula = '';
    }

    // 전략 설정 메서드
    setStrategy(value) {
        if (this.validateInput(value)) {
            // 계산 가능상태
        } else {
            // 계산 불가상태
        }
    }

    // 식 유효성 검사 메서드
    validateInput(value) {
        // 마지막 입력값 확인
        const lastInput = this.#formula.slice(-1);
        switch (lastInput) {
            case '+':
            case '-':
            case 'x':
            case '÷':
            case '(':
                return false;
        }
        return true;
    }

    // 계산 총괄 메서드
    // 계산순서: 괄호 -> 곱셈 나눗셈 -> 덧셈 뺄셈
    calculate(value) {
        while (value.includes('(')) {
            // 가장 안쪽 괄호 찾기
            const parentheses = this.findParentheses(value);
            // 괄호 안 식 추출
            const innerExpression = parentheses.slice(1, -1);
            // 곱셈 나눗셈 계산
            const mulDivResult = this.calculateMulDiv(innerExpression);
            // 덧셈 뺄셈 계산
            const finalResult = this.calculatePlusMinus(mulDivResult);
            // 괄호 안 식 계산 결과로 변경
            value = value.replace(parentheses, finalResult);
        }
    }

    // 사칙연산 계산 메서드
    calculateMulDiv(value) {
        while (value.includes('x') || value.includes('÷')) {
            // 첫번째 곱셈 나눗셈 찾기
            const formula = value.match(/[0-9]+[x\÷][0-9]+/);
            // formula 곱셈 나눗셈 계산 후 result에 결과 반환
            const [num1, operator, num2] = formula.split(/([x\÷])/);
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
            value = value.replace(formula, result);
        }
        return value;
    }
    
    // 덧셈 뺄셈 계산 메서드
    calculatePlusMinus(value) {
        const arrFormula = value.split(/([+\-])/);
        while (arrFormula.length > 1) {
            switch (arrFormula[1]) {
                case '+':
                    arrFormula[0] = Number(arrFormula[0]) + Number(arrFormula[2]);
                    arrFormula.splice(1, 2);
                    break;
                case '-':
                    arrFormula[0] = Number(arrFormula[0]) - Number(arrFormula[2]);
                    arrFormula.splice(1, 2);
                    break;
            }
        }
        return arrFormula[0];
    }

    // 안쪽 괄호 찾기 메서드
    findParentheses(value) {
        this.addParentheses(value);
            //가장 안쪽 괄호 찾기
            const complete = this.addParentheses(value);
            const parentheses = complete.match(/\([^\(\)]+\)/);
            console.log(parentheses);
        return parentheses;
    }

    // 괄호 추가 메서드
    addParentheses(value) {
        const openCount = value.match(/\(/g) || [];
        const closeCount = value.match(/\)/g) || [];
        // 열린 괄호가 더 많은 경우
        // 차이만큼 닫힌 괄호 추가
        if (openCount.length > closeCount.length) {
            const difference = openCount.length - closeCount.length;
            for (let i = 0; i < difference; i++) {
                value += ')';
            }
        }
        return value;
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