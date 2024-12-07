class NumberPuzzle {
    constructor() {
        this.initialSetting = document.getElementById('end').innerHTML;
        this.input = '';
        this.btn = [];
        this.word = ['JavaScript', 'HTML', 'MediaQuery', 'NodeJs', 'React', 'Element', 'Document'] //7개
        this.usedWord = [];
        this.checkCount = 0;
        this.isGameEnded = false;
        this.time = {
            gameStart: false,
            startTime: null,
            endTime: null,
            timeElapsed: null,
            timer: false,
            timerInterval: null
        }
        this.ranking = {};
        this.addEventListener();
    }

    addEventListener() {
        document.getElementById('check').addEventListener('click', () => {
            this.handleCheckClick();
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
        document.getElementById('reStartBtn').addEventListener('click', () => {
            this.clickReStart();
        })
    }
    
    // 게임시작 클릭 시
    handleCheckClick() {
        this.input = this.getWord();
        document.getElementById('word').innerHTML = this.input;
        this.btn = this.input.split('');
        this.btn = this.mixArr(this.btn);
        this.addButton();
        this.btnUpdate();
        if (this.time.gameStart === false) {
            this.time.gameStart = true;
            this.time.startTime = Date.now();
        }
    }

    // 타이머
    timerSet() {
        this.timerInterval = this.time.startTime - Date.now;
    }

    getWord() {
        let value = Math.floor(Math.random() * 7);
        if (!this.usedWord.includes(value)){
            return this.word[value];
        } else {
            return this.getWord();
        }
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

    // 버튼 순서가 정답인지 체크
    checkMatchStatus() {
        if (this.btn.join('') == this.input) {
            document.getElementById('matchStatus').innerText = '일치합니다.'
            this.checkCount++;
            document.getElementById('checkAnswer').innerHTML += '○';
            this.usedWord.push(this.word.indexOf(this.input));
            console.log(this.usedWord);
            this.handleCheckClick();
        } else {
            document.getElementById('matchStatus').innerText = '일치하지 않습니다.'
        }
        if (this.checkCount === 3 && !this.isGameEnded) {
            this.isGameEnded = true;
            this.gameEnding();
        }
    }

    gameEnding() {
        this.time.endTime = Date.now();
        this.time.timeElapsed = this.time.endTime - this.time.startTime;
        document.getElementById('end').innerText = 'Thank you for playing!'
        document.getElementById('reStartBtn').innerHTML = '<button id=reStart>다시하기</button>'
        document.getElementById('gameTime').innerText = `걸린 시간: ${this.time.timeElapsed}ms`
        this.rankPlayer();
        document.getElementById('ranking').innerHTML = this.rankingDisplay();
    }
    
    rankPlayer() {
        let playerName = prompt('이름을 입력해주세요.')
        this.ranking[`${playerName}`] = this.time.timeElapsed;
    }

    rankingDisplay() {
        let display = '랭킹<br>'
        let copy = JSON.parse(JSON.stringify(this.ranking));
        let ranking = [];
        for (let i = 0; i < 10; i++) {
            const min = Math.min(...Object.values(copy));
            const [key] = Object.entries(copy).find(([key, value]) => value === min);
            delete copy[key];
            display += `${i + 1}등: ${min}ms (${key})<br>`
            if (Object.keys(copy).length === 0) {
                break;
            }
        }
        return display;
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

    clickReStart() {
        this.clearSetting();
        document.getElementById('end').innerHTML = this.initialSetting;
        document.getElementById('reStartBtn').innerHTML = '';
        document.getElementById('gameTime').innerHTML = '';
        this.addEventListener();
    }

    clearSetting() {
        this.input = '';
        this.btn = [];
        this.usedWord = [];
        this.checkCount = 0;
        this.isGameEnded = false;
        this.time = {
            gameStart: false,
            startTime: null,
            endTime: null,
            timeElapsed: null
        }
    }
}

const puzzle = new NumberPuzzle();