### 监听属性 watch
检测Vue实例中的数据变动，可以依据数据变动作出相应动作（就是自己定义函数来干些事儿！）
```js
<body>
    <div id="app">
        千米：<input type="text" v-model="kilometers"> 米： <input type="text" v-model="meters">
    </div>
    <script src="../node_modules/vue/dist/vue.js"></script>
    <script>
        const app = new Vue({
            el: "#app",
            data: {
                kilometers: 0,
                meters: 0
            },
            // 定义监听器 监听属性：meters, kilometers
            // 其中一个值发生变化，另外一个就会调用
            watch: {
                kilometers(val) {
                    this.meters = val * 1000;
                },
                meters(val) {
                    this.kilometers = val / 1000;
                }
            }

        })
    </script>
</body>
```
### 注意点
**时刻注意this指向**
不要使用箭头函数来定义监听器属性，箭头函数绑定的是父级作用域的上下文，上面那个例子中this指向window, 会导致this.meters=undefined,this.kilometers=undefined

### 适合场景
当需要**数据变化时执行异步或者开销较的操作时**，使用监听器最为合适。比如可以开一个web worker去干其他事情看看下面的例子：开了一个worker去计算，watch-fib.html专心数据展示
1. faibnaci.js
```js
// 完成斐波那契额数列的计算
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
```
2. watch-fib.html

```js
<body>
    <div id="app">
        <input type="text" v-model="num">
        <p v-show="result">{{result}}</p>
    </div>
    <script src="../node_modules/vue/dist/vue.js"></script>
    <script>
        const app = new Vue({
            el: "#app",
            data: {
                num: 0,
                result: ''
            },
            methods: {

            },
            watch: {
                num(val) {
                    // 这里可以设置一个中间状态，提示用户页面没有卡主
                    this.result = "请稍等........";
                    if (val > 0) {
                        let worker = new Worker('./fibonaci.js');
                        // 注意this指向
                        worker.onmessage = (event) => this.result = event.data;
                        worker.postMessage(val);
                    } else {
                        this.result = '';
                    }
                }
            }
        })
    </script>
```
### 监听器的形式
- 监听方法名
- 监听一个对象的属性变化
```js
const app = new Vue({
            el: "#app",
            data: {
                person: {
                    age: 0,
                    name: "Bob"
                }
            },
            watch: {
                person: {
                    handler(val, oldVal) {
                        if (val.age >= 10) {
                            this.info = "已成年";
                        } else {
                            this.info = "未成年";
                        }
                    },
                    deep: true
                }
            }
        });
```
- deep 深层次监听
- immediate 监听函数立即执行

### 与计算属性的区别
监听属性用于监听Vue实例的数据变动，并依据该数据变动作出响应，如更新另外一个数据，或者发出异步请求从服务端请求数据，与计算属性区别就是**监听器不需要返回新的数据，不能被当做数据属性使用，当需要数据变化时执行异步或者开销较大的操作时，使用监听器最为合适**。

### github地址

```js```



### 参考
- 《Vue.js从入门到实战》