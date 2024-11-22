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

    // '모든 입력' 처리 메서드
    handleInput(value) {
        if (this.inputValidation(this.#input, value)) {
            this.#input += `${value}`;
        };
        console.log('입력받은 값:', this.#input, value);
    }

    // 입력 유효성 검사 메서드
    inputValidation(input, value) {
        const lastInput = this.#input.slice(-1);
        switch (lastInput, value) {
            case '/[]/':
                return true;
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
class Calculator {}

class OperatorStrategy {}

class NumberStrategy {}

class UpdateDisplayState {}

class CalculatorState {}


// 인스턴스 생성
const inputHandler = new InputHandler();