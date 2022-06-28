# Fileheader Pro

Fileheader 是一款开箱即用，可以完全自定义的 VSCode 扩展

[English](./README.md) | 简体中文 |

## 功能

### 完全可定制的. 使用 **javascript** 编写你的模版

![CustomFileheader](https://user-images.githubusercontent.com/20639676/175778910-6d761e2e-e956-48d6-90ef-fe9193d481cd.gif)

### 创建新文件时自动添加文件头。**无需手动添加**

![AutoInsert](https://user-images.githubusercontent.com/20639676/175778891-90796099-26e7-42a7-b501-77b5d6b03b50.gif)

### 保存的时候自动更新文件头

![AutoUpdate](https://user-images.githubusercontent.com/20639676/175778916-0a2734d2-21a3-4e93-833c-377261912652.gif)

## 预置模板支持的语言

- [x] Javascript/Typescript
- [x] Python
- [ ] Java **即将到来 🚀**
- [ ] Rust **即将到来 🚀**
- [ ] Golang **即将到来 🚀**

## 使用

### 手动添加文件头

打开文件并且按下 Ctrl+Shift+P(`Command+Shift+P` on Mac).

然后输入`"Fileheader Pro: Add Fileheader"`，一个默认的文件头就会插入到你的文件中

### 禁用某些字段

查看 [设置](#extension-settings) 部分. 有一个 `FileheaderPro.disableFields` 属性.

在 VSCode 设置中添加禁用字段

> 禁用 authorName，则会禁用作者的电子邮件

![image](https://user-images.githubusercontent.com/20639676/175874396-ff2128d5-88fa-442e-a3bd-4332086bfbfa.png)

![image](https://user-images.githubusercontent.com/20639676/175874279-8677d2b1-e9f5-45d3-9566-66b032dbc6bb.png)

### 使用自定义模板文件头

按 Ctrl+Shift+P(`Command+Shift+P` on Mac) 打开你的命令面板

然后输入 `"Fileheader Pro: Generate Custom Fileheader Template"`, 一个新的 [模版文件](https://github.com/IronLu233/fileheader-pro/blob/main/src/FileheaderLanguageProviders/provider.template.js) 就会生成在你的 `${workspaceRoot}/.vscode/fileheader.template.js`目录下面

然后修改模板文件并保存。您的自定义文件头就会生效。

**旧模板现在无法识别。不要忘记删除旧的文件头。如果你想在生产环境中使用模板，在这之前请先调试模板**

![image](https://user-images.githubusercontent.com/20639676/175812544-081edbb2-6596-48f1-8b7c-5a9825af8618.png)

## 扩展设置

| 选项 | 默认值 | 描述 |
| --- | --- | --- |
| FileheaderPro.currentUserName |  | 设置当前用户，默认是你的 vscode |
| FileheaderPro.currentUserEmail |  | 设置当前邮箱，默认是你的 vscode |
| FileheaderPro.companyName | 公司名字 | 你的公司名称，请替换为你自己的 |
| FileheaderPro.dateFormat | 'YYYY-MM-DD HH:mm:ss' | 日期格式, 详情查看 https://momentjs.com/docs/#/displaying/format |
| FileheaderPro.autoInsertOnCreateFile | true | 创建新文件时自动插入文件头 |
| FileheaderPro.autoUpdateOnSave | true | 保存文件时自动更新文件头 |
| FileheaderPro.disableFields | [] | 在文件头中禁用字段。对于默认的文件头模板，包含的字段被省略 |

## 已知问题

由于 API 的限制，修改源码，然后手动编辑到原来的 VCS 中，会改变修改的时间。

如果用户手动更改创建时间到更早，Fileheader pro 将不会更新时间字符串。

模板变量的 `mtime` 可能有一些问题。如果您发现任何问题， 请在[GitHub Issue](https://github.com/IronLu233/fileheader-pro/issues)提出

## TODOS

- [ ] 添加对其它语言的支持
- [ ] 添加对其它编辑器的支持
- [ ] 集成测试 & 单元测试

## Release Notes

### 0.0.1
