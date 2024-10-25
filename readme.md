# 純 JavaScript 的 Google 驗證
## 使用
1. 要從[Google Console](https://console.cloud.google.com/) 去註冊專案
2. 在專案中選擇要使用哪些功能，這樣才能取得權限，像是使用者資訊、地圖或 Youtube 等
3. 設定開發網址與正式網址(如果有的話)，然後取得 client_id
4. 然後在 `main.js` 中的 `function gisInit` 填入 client_id
5. 其他請參閱 js 檔中的 `console.log` 說明
6. 我的 client_id 放在 `evn.js` 中用變數 `YOUR_CLIENT_ID_HERE` 存放，並 ignore 這個檔，所以執行時可能會遇到找不到這個檔的問題，請自己解決。
## 參考資料
1. [Google Identity](https://developers.google.com/identity/oauth2/web/guides/overview?hl=zh-tw)