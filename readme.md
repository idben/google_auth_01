# 純 JavaScript 的 Google 驗證
## 純 JavaScript 的使用
1. 要從[Google Console](https://console.cloud.google.com/) 去註冊專案
2. 在專案中選擇要使用哪些功能，這樣才能取得權限，像是使用者資訊、地圖或 Youtube 等
3. 設定開發網址與正式網址(如果有的話)，然後取得 client_id
4. 然後在 `main.js` 中的 `function gisInit` 填入 client_id
5. 其他請參閱 js 檔中的 `console.log` 說明
6. 我的 client_id 放在 `evn.js` 中用變數 `YOUR_CLIENT_ID_HERE` 存放，並 ignore 這個檔，所以執行時可能會遇到找不到這個檔的問題，請自己解決。

## react 專案版的使用
1. 在 `_app.jsx` 中載入兩支 google 驗證的 api js，兩支載入後的初始化程式寫在 `AuthContext.js` 中
2. 所有登入登出相關的程式與使用者的變數等方法記錄，都寫在 `AuthContext.js` 中
3. `AuthContext.js` 再提供 Provider，在 `_app.jsx` 裡包入原頁面的元素
4. 請建立 `.env.local` 檔，把 google client_id 記錄進去
  ```
  NEXT_PUBLIC_GOOGLE_CLIENT_ID="記在這裡"
  ```

## 參考資料
1. [Google Identity](https://developers.google.com/identity/oauth2/web/guides/overview?hl=zh-tw)