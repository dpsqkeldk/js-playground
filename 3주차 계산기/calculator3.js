// 문자열 계산 클래스 #부모클래스
// display의 입력식을 매 시간 계산하고 실시간으로 display 입력식 위에 출력함.
class StringCalculator {
    constructor() {
        this.current = document.querySelector('.current');
        this.array = [this.current.innerText];
        this.numbers = [];
        this.operators = [];
    }

    // 메인 메서드
    main() {
        // if (this.array.includes("(") || this.array.includes(")")) {
        //     this.parenthesesCalculate();
        // } //괄호 계산 메서드 실행함수 미완성
        console.log("메인함수 실행");
        this.splitString();
        // 메인함수 디버깅
        console.log("메인", this.numbers);
        console.log("메인", this.operators);
        this.calculatePercent();
        this.convertString();
        this.findOperator();
        let result = this.postCalculate();
        return result; 
    }

    // 문자열 분리 메서드
    splitString() {
        this.numbers = this.current.innerText.split(/[\+\-\×\÷]/);
        this.operators = this.current.innerText.split(/[0-9, %]/);
        while (this.operators.includes("")) {
            let index = this.operators.indexOf("");
            this.operators.splice(index, 1);
        }
        console.log("current 문자열 > Num/op 분리");
        console.log(this.numbers);
        console.log(this.operators);
    }

    // 퍼센트 계산 메서드
    calculatePercent() {
        if (this.current.innerText.includes("%")) {
            const indexes = this.numbers.reduce((acc, cur ,index) => {
                if (cur.includes('%')) {
                    acc.push(index);
                }
                return acc;
            }, []);
            console.log(indexes);
            while (indexes.length > 0) {
                this.numbers[indexes[0]] = this.numbers[indexes[0]].slice(0, -1);
                this.numbers[indexes[0]] /= 100;
                indexes.splice(0, 1);
            }
        }
    }

    // 문자열 Number 변환 메서드
    convertString() {
        this.numbers = this.numbers.map(num => Number(num));
        console.log("문자열>넘버변환");
    }

    // 곱셈, 나눗셈 찾기 메서드
    findOperator() {
        while (this.operators.includes("×") || this.operators.includes("÷")) {
            if (this.operators.includes("×")) {
                this.preCalculate("×", this.operators.indexOf("×"));
            } else if (this.operators.includes("÷")) {
                this.preCalculate("÷", this.operators.indexOf("÷"));
            }
        }
        console.log("곱셈or나눗셈찾기");
    }

    // 곱셈, 나눗셈 계산 메서드
    preCalculate(operator, index) {
        switch (operator) {
            case "×": this.numbers[index] *= this.numbers[index + 1];
                this.numbers.splice(index + 1, 1);
                this.operators.splice(index, 1);
                console.log("곱셈계산");
                break;
            case "÷": this.numbers[index] /= this.numbers[index + 1];
                this.numbers.splice(index + 1, 1);
                this.operators.splice(index, 1);
                console.log("나눗셈계산");
                break;
        }
    }

    // 덧셈, 뺄셈 계산 메서드
    postCalculate() {
        console.log("덧셈or뺄셈계산");
        while (this.operators.length > 0) {
            switch (this.operators[0]) {
                case "+": this.numbers[0] += this.numbers[1];
                    this.numbers.splice(1, 1);
                    this.operators.splice(0, 1);
                    console.log("덧셈계산");
                    break;
                case "-": this.numbers[0] -= this.numbers[1];
                    this.numbers.splice(1, 1);
                    this.operators.splice(0, 1);
                    console.log("뺄셈계산");
                    break;
            }
        }
        console.log("최종 계산 결과:", this.numbers[0]);
        console.log("최종 계산 후 숫자 배열:", this.numbers);
        console.log("최종 계산 후 연산자 배열:", this.operators);
        return this.numbers[0];
    }

    // 괄호 계산 메서드 미완성
    parenthesesCalculate() {
        let countA = this.array.filter(pa => pa === "(").length
        let countB = this.array.filter(pa => pa === ")").length
        if (countA === countB) {
            let indexA = this.array.indexOf("(");
            let indexB = this.array.lastIndexOf(")");
            
        }
    }
}


// 계산기 클래스 #자식클래스
class Calculator extends StringCalculator {
    // 생성자 메서드
    constructor() {
        super();
        this.addEventListeners();
        this.current = document.querySelector('.current');
        this.previous = document.querySelector('.previous');
        this.thereIsOperator = 0; // 연산자 개수
        this.recentIsNumber = 0; // 최근에 숫자버튼 클릭 여부 (previous 갱신)
        this.recentIsPercent = false;
    }

    // 이벤트 리스너 설정 메서드
    addEventListeners() {
        document.querySelectorAll('.number').forEach(button => {
            button.addEventListener('click', () => {
                this.ClickNumber(button.textContent);
            });
        });
        document.querySelectorAll('.operator').forEach(button => {
            button.addEventListener('click', () => {
                this.ClickOperator(button.textContent);
            });
        });
        document.querySelector('.clear').addEventListener('click', () => {
            this.clear();
        });
        document.querySelector('.parentheses').addEventListener('click', () => {
            this.ClickParentheses();
        });
        document.querySelector('.backspace').addEventListener('click', () => this.Backspace());
        document.querySelector('.equal').addEventListener('click', () => this.equal());
        document.querySelector('.percent').addEventListener('click', () => this.ClickPercent());
    }

    // 숫자버튼 클릭 시 실행되는 메서드
    ClickNumber(number) {
        if (this.recentIsPercent) {
            console.log("숫자 이후 퍼센트 입력 방지");
            return;
        }
        console.log("숫자 입력", number);
        if (this.current.innerText == "0") {
            this.current.innerText = "";
        } //이로 인해 첫 입력 시 0 삭제 || 0입력 시 0 유지
        this.current.innerText += number;
        this.recentIsNumber++;
        this.thereIsOperator = 0;
        this.UpdatePrevious();

        // 디버깅
        console.log(this.recentIsNumber);
        console.log(this.thereIsOperator);
    }

    // 연산자버튼 클릭 시 실행되는 메서드
    ClickOperator(operator) {
        console.log("연산자 입력", operator);
        if (this.recentIsNumber > 0) {
            this.current.innerText += operator;
            this.thereIsOperator++;
            this.recentIsNumber = 0;
            this.recentIsPercent = false;
            this.UpdatePrevious();
        } else if (this.thereIsOperator > 0) {
            console.log("연산자 이후 연산자 방지")
        } else if (this.thereIsOperator === 0) {
            console.log("연산자 첫입력 방지")
        }
        // 디버깅
        console.log(this.recentIsNumber);
        console.log(this.thereIsOperator);
    }

    // 입력식 계산값을 실시간으로 갱신하는 메서드 // 숫자버튼 클릭시마다 호출됨
    UpdatePrevious() {
        if (this.recentIsNumber > 0) {
            this.previous.innerText = this.main();
        } else if (this.thereIsOperator === 1) {
            this.previous.innerText = "계산중...";
        }
    }

    // 백스페이스 버튼 클릭 시 실행되는 메서드
    Backspace() {
        this.current.innerText = this.current.innerText.slice(0, -1);
        let lastValue = this.current.innerText.slice(-1);
        if (lastValue == "+" || lastValue == "-" || lastValue == "×" || lastValue == "÷") {
            this.recentIsNumber = 0;
            this.thereIsOperator = 1;
        } else {
            this.recentIsNumber = 1;
        }
        if (lastValue == "%") {
            this.recentIsPercent = true;
        } else {
            this.recentIsPercent = false;
        }
        this.UpdatePrevious();
        if (this.current.innerText.length == 0) {
            this.clear();
        }
    }
    // 등호 버튼 클릭 시 실행되는 메서드
    equal() {
        this.current.innerText = this.main();
    }

    // 퍼센트 버튼 클릭 시 실행되는 메서드
    ClickPercent() {
        if (!this.recentIsPercent && this.recentIsNumber > 0) {
            this.current.innerText += "%";
            this.recentIsPercent = true;
            this.UpdatePrevious();
        } else {
            console.log("퍼센트 연속 입력&연산자 이후 입력 방지");
        }
    }

    // 괄호 버튼 클릭 시 실행되는 메서드
    ClickParentheses() {
        this.previous.innerText = "괄호 입력 미구현";
    }




    // 입력식을 초기화하는 메서드
    clear() {
        this.current.innerText = "0";
        this.thereIsOperator = 0;
        this.recentIsNumber = 0;
        this.recentIsPercent = false;
        this.previous.innerText = "값을 입력하세요."
    }
}
// 계산기 인스턴스 생성
const calc = new Calculator();