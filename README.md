# Eve

記錄學業與筆記的個人站。用 [Hexo](https://hexo.io/) 和 [Tranquilpeak](https://github.com/LouisBarranqueiro/hexo-theme-tranquilpeak)。首頁是依日期排的短卡片，側邊欄是首頁、分類、關於。內文用繁體中文，目前沒有英文切換。

文章檔幾乎是空的，只留標題和分類。正文還沒寫。

## 本地預覽

需要 Node.js 18 以上。這個站在 Node 22 上產生過。

```bash
npm install
npm run preview
```

瀏覽器打開 <http://localhost:4000>。

只產生靜態檔、不開伺服器：

```bash
npm run build
```

成品在 `public/`。這個目錄不進 git。改完網址之前，不要把 `public/` 發布出去。

## 寫一篇新文章

```bash
npx hexo new post "文章標題"
```

會在 `source/_posts/` 新增一篇。打開之後填標題、日期、一個分類，再自己寫正文：

```yaml
---
title: 文章標題
date: 2026-11-11 09:00:00
categories:
  - Notes
---
```

- 一篇只放一個分類：`Notes`、`Research` 或 `About`。
- 若要在首頁卡片顯示一句摘要，把那一句放在 `<!-- more -->` 前面。
- 日期寫在 `date`。文章頁最上方也會顯示日期。
- 還不想出現在首頁的文章，用 `npx hexo new draft "標題"`，檔案會在 `source/_drafts/`。預覽草稿：`npx hexo server --draft`。

側邊欄的「分類」會把文章依 Notes、Research、About 分開。側邊欄的「關於」連到 `/about/`。

## 部署到 GitHub Pages

這個倉庫還沒有發布。要發布時：

1. 準備一個 GitHub 倉庫。個人站的倉庫名是 `你的帳號.github.io`，網址是 `https://你的帳號.github.io/`。專案站的網址是 `https://你的帳號.github.io/倉庫名/`。
2. 改 `_config.yml`：
   - 個人站：`url` 設成 `https://你的帳號.github.io`，`root` 設成 `/`。
   - 專案站：`url` 設成 `https://你的帳號.github.io/倉庫名`，`root` 設成 `/倉庫名/`。
   - `deploy.repo` 設成那個倉庫的 git 位址。`deploy.branch` 預設是 `gh-pages`：原始碼留在 `main`，產生的網頁推到 `gh-pages`。
3. 在 GitHub 倉庫的 Settings → Pages，來源選 `gh-pages` 分支的根目錄。
4. 執行：

```bash
npm run build
npm run deploy
```

`hexo-deployer-git` 只推送 `public/` 裡的成品。

## 還是空的

三篇文章只有標題和分類。學校、城市、正在學的、課程、研究都還沒寫，也不該先寫上去。

## 主題

Tranquilpeak 最後一個正式版本是 4.2.0。它的建置還靠已停止維護的 `node-sass`，在 Node 22 上裝不起來，所以這裡改用 Dart Sass（`sass@1.77.8`）編譯，並把編好的 CSS 和 JS 放在 `themes/tranquilpeak/source/assets/`。寫文章不必重編主題。

若改了 `themes/tranquilpeak/source/_css` 或 `source/_js`：

```bash
cd themes/tranquilpeak
npm install
npm run prod
```

主題授權是 GPL-3.0，見 `themes/tranquilpeak/LICENSE`。
