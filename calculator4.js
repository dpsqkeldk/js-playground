// 입력 처리를 담당하는 클래스
class InputHandler {
    #buttonInput;
    #keyboardInput;
    #input;

    constructor() {
        this.handleButtonInput();
        this.handleKeyboardInput();
        this.#input = '';
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
        if (value === 'Clear') {
            this.#input = '';
            console.log('Clear');
            return;
        } else if (value === 'Backspace') {
            this.#input = this.#input.slice(0, -1);
            console.log('input입력값:', this.#input);
            return;
        }
        // 입력 유효성 검사
        if (this.inputValidation(value)) {
            // 입력 추가
            this.#input += value;
            console.log('input입력값:', this.#input);
        } else {
            console.log('미완성 수식');
        };
    }

    // 입력 유효성 검사 메서드
    inputValidation(value) {
        // 입력값 타입 확인
        const lastInput = this.#input.slice(-1);
        const typeOfLastInput = this.isWhatType(lastInput);

        // 입력값 타입에 따른 유효성 검사
        switch (this.isWhatType(value)) {
            case 'number':
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
        this.display = document.querySelector('.display');
    }
}

// 계산 로직을 담당하는 클래스
class Calculator { }

class OperatorStrategy { }

class NumberStrategy { }

class UpdateDisplayState { }

class CalculatorState { }


// 인스턴스 생성
const inputHandler = new InputHandler();