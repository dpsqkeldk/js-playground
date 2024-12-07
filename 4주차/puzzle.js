class NumberPuzzle {
    constructor() {
        this.input = '';
        this.btn = [];

        this.addEventListener();
    }

    addEventListener() {
        document.getElementById('check').addEventListener('click', () => {
            this.input = document.getElementById('input').value;
            this.btn = this.input.split('');
            this.btnUpdate();
        })

        document.getElementById('turn').addEventListener('click', () => {
            this.btnTurn();
        })
        document.getElementById('rightPush').addEventListener('click', () => {
            this.btnRightPush();
        })
        document.getElementById('leftPush').addEventListener('click', () => {
            this.btnLeftPush();
        })
    }

    btnUpdate() {
        for (let i = 0; i < this.btn.length; i++) {
            document.getElementById(`btn${i + 1}`).innerText = this.btn[i];
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

    btnTurn() {
        let arr = [];
        let len = this.btn.length;
        for (let i = 0; i < len; i++) {
            arr[len - i - 1] = this.btn[i];
        }
        this.btn = arr;
        this.btnUpdate();
    }

    btnRightPush() {
        let arr = [];
        let len = this.btn.length;
        arr[0] = this.btn[len - 1]
        for (let i = 0; i < len - 1; i++) {
            arr[i + 1] = this.btn[i];
        }
        this.btn = arr;
        this.btnUpdate();
    }

    btnLeftPush() {
        let arr = [];
        let len = this.btn.length;
        arr[len - 1] = this.btn[0];
        for (let i = 1; i < len; i++) {
            arr[i - 1] = this.btn[i];
        }
        this.btn = arr;
        this.btnUpdate();
    }
}

const puzzle = new NumberPuzzle();