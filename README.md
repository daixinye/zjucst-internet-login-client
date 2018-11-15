## zjucst-internet-login-client

浙江大学软件学院上网客户端

用于替代直接访问`192.0.0.6`进行登录。

## Download

点此下载：[zjucst-internet-login-client-1.0.1.dmg](https://github.com/daixinye/zjucst-internet-login-client/releases/download/1.0.1/zjucst-internet-login-client-1.0.1.dmg)

也可以在 Release 里找到最新的版本。

目前只支持 Mac。

打开后若显示无法打开，请在 设置->安全性和隐私 中选择 仍要打开。

## Usage

运行后可在菜单栏里找到图标，点击进行操作。

![菜单栏](http://img.daixinye.com/20181115164846.png)

### 输入账号和密码

刚开始会要求输入账号和密码，这里是直接用了 Notification 的 Reply 类型。用户和密码用`@`作为分隔符，用户名在前，密码在后，点击发送即可。

![输入账号和密码](http://img.daixinye.com/20181115164538.png)

### 上线

上线前请保证：

- 账号和密码正确，
- 成功地连到了`CST_WLAN`或寝室有线网（即保证`192.168.0.6`能正常访问）

若账号在别处登录，那么「上线」时，将先尝试「强制下线」，然后每隔 10 秒尝试「上线」，直到登录成功或超出最大尝试次数（12 次）。

### 下线

正常登录后可点击「下线」退出登录。

### 强制下线

账号在别处登录，但没有正常下线时可手动强制下线。强制下线后，需要等待 1 分钟后才能正常登录。

### 清除账号信息

需要使用别的账号时可先清除当前账号的信息。

## Bugs

直接提 issue 就好 🙃

## Contribution

代码还是比较简单和随意的，如有兴趣可以直接提 PR 🙃
