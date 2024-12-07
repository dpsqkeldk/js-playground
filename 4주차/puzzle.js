class NumberPuzzle {
    constructor() {
        this.input = '';
        this.btn = [];
        this.word = ['JavaScript', 'HTML', 'MediaQuery', 'NodeJs', 'React', 'Element', 'Document'] //7개

        this.addEventListener();
    }

    addEventListener() {
        document.getElementById('check').addEventListener('click', () => {
            this.input = this.getWord();
            document.getElementById('word').innerHTML = this.input;
            this.btn = this.input.split('');
            this.btn = this.mixArr(this.btn);
            this.addButton();
            this.btnUpdate();
        })

        document.getElementById('turn').addEventListener('click', () => {
            this.btn = this.btnTurn(this.btn);
            this.btnUpdate();
        })
        document.getElementById('rightPush').addEventListener('click', () => {
            this.btn = this.btnRightPush(this.btn);
            this.btnUpdate();
        })
        document.getElementById('leftPush').addEventListener('click', () => {
            this.btn = this.btnLeftPush(this.btn);
            this.btnUpdate();
        })
    }

    getWord() {
        let value = Math.floor(Math.random() * 7);
        return this.word[value];
    }

    mixArr(arr) {
        let newArr = arr.slice();
        let repeat = Math.floor(Math.random() * 2 + 3); // 3-4회 mix
        for (let i = 0; i < repeat; i++) {
            let num = Math.floor(Math.random() * 2); // 0-2 숫자 뽑기
            switch(num) {
                case 0:
                    newArr = this.btnTurn(arr);
                    break;
                case 1:
                    for (let i = 0; i < Math.floor(Math.random()*5 + 1); i++) {
                        newArr = this.btnLeftPush(arr);
                        newArr = this.btnLeftPush(newArr);
                    }
                    break;
                case 2:
                    for (let i = 0; i < Math.floor(Math.random()*5 + 1); i++) {
                        newArr = this.btnRightPush(arr);
                        newArr = this.btnRightPush(newArr);
                    }
                    break;
            }
        }
        if (newArr.join() == arr.join()) {
            console.log('중복발생');
            this.mixArr(arr);
        }
        return newArr;
    }

    addButton() {
        let len = this.btn.length;
        let btn = ''
        for (let i = 0; i < len; i++) {
            btn += `<button id='btn${i}'></button>`
        }
        document.getElementById('btn').innerHTML = btn;
    }
    
    btnUpdate() {
        let len = this.btn.length;
        for (let i = 0; i < len; i++) {
            document.getElementById(`btn${i}`).innerText = this.btn[i];
        }
        this.checkMatchStatus();
    }

    checkMatchStatus() {
        if (this.btn.join('') == this.input) {
            document.getElementById('matchStatus').innerText = '일치합니다.'
        } else {
            document.getElementById('matchStatus').innerText = '일치하지 않습니다.'
        }
    }

    btnTurn(arr) {
        let newArr = [];
        let len = arr.length;
        for (let i = 0; i < len; i++) {
            newArr[len - i - 1] = arr[i];
        }
        return newArr;
    }

    btnRightPush(arr) {
        let newArr = [];
        let len = arr.length;
        newArr[0] = arr[len - 1]
        for (let i = 0; i < len - 1; i++) {
            newArr[i + 1] = arr[i];
        }
        return newArr;
    }

    btnLeftPush(arr) {
        let newArr = [];
        let len = arr.length;
        newArr[len - 1] = arr[0];
        for (let i = 1; i < len; i++) {
            newArr[i - 1] = arr[i];
        }
        return newArr;
    }
}

const puzzle = new NumberPuzzle();