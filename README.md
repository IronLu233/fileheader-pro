# Fileheader Pro

[![.github/workflows/main.yml](https://github.com/IronLu233/fileheader-pro/actions/workflows/main.yml/badge.svg)](https://github.com/IronLu233/fileheader-pro/actions/workflows/main.yml)
![Visual Studio Marketplace Rating](https://img.shields.io/visual-studio-marketplace/r/IronLu233.fileheader-pro)
![Visual Studio Marketplace Downloads](https://img.shields.io/visual-studio-marketplace/d/IronLu233.fileheader-pro)

[中文文档](https://juejin.cn/post/7117997347837067301)
## Features

### Full customizable. Write your own template **with javascript logic**

![CustomFileheader](https://user-images.githubusercontent.com/20639676/175778910-6d761e2e-e956-48d6-90ef-fe9193d481cd.gif)

### Auto add file header when create new file. **No need to add file header manually**

![AutoInsert](https://user-images.githubusercontent.com/20639676/175778891-90796099-26e7-42a7-b501-77b5d6b03b50.gif)

### Auto update file header when save file

![AutoUpdate](https://user-images.githubusercontent.com/20639676/175778916-0a2734d2-21a3-4e93-833c-377261912652.gif)

## Preset Template Supported Languages

- [x] Javascript/Typescript
- [x] Python
- [x] CSS, Less, SCSS
- [x] HTML/XML
- [x] Vue
- [x] Java
- [ ] Rust **Comming soon🚀**
- [ ] Golang **Comming soon🚀**

## Usage

### Manually add file header

Open your file and press Ctrl+Shift+P(`Command+Shift+P` on Mac).

Then type `"Fileheader Pro: Add Fileheader"`
a default file header will insert into your file.

### Disable some fields

See [Extension Settings](#extension-settings) section. there is a `FileheaderPro.disableFields` property.

Add your disabled fields in your VSCode setting.

> Disable authorName will disable the author Email too.

![image](https://user-images.githubusercontent.com/20639676/175874396-ff2128d5-88fa-442e-a3bd-4332086bfbfa.png)

![image](https://user-images.githubusercontent.com/20639676/175874279-8677d2b1-e9f5-45d3-9566-66b032dbc6bb.png)

### Customize fileheader with template

Press Ctrl+Shift+P(`Command+Shift+P` on Mac) for open your command palette.

Then type `"Fileheader Pro: Generate Custom Fileheader Template"`
A new [template file](https://github.com/IronLu233/fileheader-pro/blob/main/src/FileheaderLanguageProviders/provider.template.js) will be generated in your `${workspaceRoot}/.vscode/fileheader.template.js`

Then modify the template file and save it.
Your custom file header will take effect.

**Old template can not be recognized now. Do not forget remove old fileheader. And debug your template first before you want to use it in your production**

![image](https://user-images.githubusercontent.com/20639676/175812544-081edbb2-6596-48f1-8b7c-5a9825af8618.png)

## Extension Settings

| Setting                              | Default Value         | Description                                                                                   |
| ------------------------------------ | --------------------- | --------------------------------------------------------------------------------------------- |
| FileheaderPro.currentUserName        |                       | The fixed current user. The default is from your VCS                                          |
| FileheaderPro.currentUserEmail       |                       | The fixed current user email. The default is from your VCS                                    |
| FileheaderPro.companyName            | YourCompanyName       | Company name, please replace to your owns                                                     |
| FileheaderPro.dateFormat             | 'YYYY-MM-DD HH:mm:ss' | The date format, see https://momentjs.com/docs/#/displaying/format                            |
| FileheaderPro.autoInsertOnCreateFile | true                  | Auto insert file header when create new file                                                  |
| FileheaderPro.autoUpdateOnSave       | true                  | Auto update file header when save file                                                        |
| FileheaderPro.disableFields          | ["mtime"]                    | Disable fields in fileheader. For default fileheader template, the contain fields are omitted. **`mtime` may take code merge conflict. Thus I disable it by default** |

## Known Issues

Due to API limit, modify the source code and then manually edit to original in VCS will change the modified time.

If user manually change the birthtime to earlier, Fileheader pro will not update birthtime substring.

`mtime` of template variable may have some issues.
If you find any issue, please report to [GitHub Issue](https://github.com/IronLu233/fileheader-pro/issues)

## TODOS

- [ ] Add support for other languages in [VSCode known identifiers](https://code.visualstudio.com/docs/languages/identifiers#_known-language-identifiers)
- [ ] Add support for other VCS
- [ ] Integration test and unit test
