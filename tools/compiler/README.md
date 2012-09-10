＃compiler

自动监听文件变化，在文件被修改的时候，自动编译文件。可将less编译成css，coffeescript编译成javascript，将js压缩成min版本。

## 配置方式（compile.json）：
### 1、监听多目录，多类型文件
```js
[
    {
      //监听目录
      "path" : "/Users/vicanso/tmp",
      //编译时生成的文件目录（和监听目录同级，在生成文件时将path替换为targetPath），若没有该参数，直接生成在同级目录下
      "targetPath" : "/Users/vicanso/target",
      //文件后缀
      "ext" : ".less",
      //文件发生变化时，延时多少秒编译，如果在这段时间内，文件再次被修改，再次延时（文件变化时，node也有一个时间间隔的事件触发）
      "delay" : 1000
    },
    {
      "path" : "/Users/vicanso/tmp",
      "targetPath" : "/Users/vicanso/target",
      "ext" : ".js",
      "delay" : 1000
    }
]
```
### 2、单目录，单类型
```js
{
  "path" : "/Users/vicanso/tmp",
  "targetPath" : "/Users/vicanso/target",
  "ext" : ".js",
  "delay" : 1000
}
```


## 执行程序的参数：
-j xxxx.json 指定编译的json配置文件
-c all 马上编译一次所有的文件