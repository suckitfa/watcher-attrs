function fib(n) {
    if (n == 1 || n == 2) return n;
    return arguments.callee(n - 1) + arguments.callee(n - 2);
}
onmessage = function(event) {
    // 将数据转为10进制整数
    var num = parseInt(event.data, 10);
    console.log(num);
    postMessage(fib(num));
}