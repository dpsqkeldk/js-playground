var readinput = document.getElementById('input1');
btn1.onclick = function() {
    console.log(readinput.value);
};

var btn2 = document.createElement('button');
btn2.innerHTML = '메뉴추가';
test2.appendChild(btn2);

btn2.onclick = function() {
    console.log(readinput.value);
    var menu = document.createElement('li');
    menu.innerHTML = readinput.value;
    test.appendChild(menu);
};