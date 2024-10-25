let tokenClient, gapiInited, gisInited, userInfo, userToken;
let storageKey = "googleOauth2UserInfo";

const checkBeforeStart = () => {
  if (gapiInited && gisInited){
    // google 驗證的套件都已載入，可以開始驗證使用者或畫出畫面
    console.log("開始檢查使用者資訊");
    checkUser();
  }
}

const gapiInit = () => {
  gapi.client
    .init({})
    .then(() => {
      gapiInited = true;
      checkBeforeStart();
    });
}

const gapiLoad = () => gapi.load('client', gapiInit);

const gisInit = () => {
  // 要從 https://console.cloud.google.com/ 去註冊專案，指定要使用 Google 的內容，設定
  // 開發網址與正式網址(如果有的話)，然後取得 client_id
  // scope 就是要使用的內容
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: YOUR_CLIENT_ID_HERE,
    scope: 'profile email'
  });
  gisInited = true;
  checkBeforeStart();
}

const checkUser = () => {
  console.log("檢查 localStorage 內");
  userToken = localStorage.getItem(storageKey);
  if(!userToken){
    console.log("localStorage 沒有存有使用者資訊");
    setLoginPage();
    return;
  }
  console.log("localStorage 有使用者資訊");
  getUserInfo();
}

const setLoginPage = async () => {
  console.log("顯示登入頁面");
  const pageData = await loadLoginPage().catch(error => {
    console.log(error);
  });
  document.querySelector(".container").innerHTML = pageData?pageData:"無法載入登入頁面";
  document.querySelector(".googleBtn")?.addEventListener("click", e => {
    googleOauth2Start();
  })
}

const setConetntPage = async () => {
  console.log("顯示登入後才能看到的頁面");
  const pageData = await loadContentPage().catch(error => {
    console.log(error);
  });
  document.querySelector(".container").innerHTML = pageData?pageData:"無法載入登入頁面";
  document.querySelector("img").src = userInfo.picture;
  document.querySelector(".userName").innerHTML = userInfo.name;
  document.querySelector(".email").innerHTML = userInfo.email;
  document.querySelector(".googleBtn").addEventListener("click", e => {
    logout();
  })
}

const loadLoginPage = () => {
  console.log("載入登入畫面");
  return new Promise((resolve, reject) => {
    fetch("../loginPage.html")
    .then(res=>{
      if(res.status>=200 && res.status < 300){
        return res.text()
      }
      throw new Error("無法載入登入頁面")
    })
    .then(result => {
      resolve(result)
    }).catch(error => reject(error))
  });
}

const loadContentPage = () => {
  console.log("載入登入後才能看到的畫面");
  return new Promise((resolve, reject) => {
    fetch("../contentPage.html")
    .then(res=>{
      if(res.status>=200 && res.status < 300){
        return res.text()
      }
      throw new Error("無法載入登入頁面")
    })
    .then(result => {
      resolve(result)
    }).catch(error => reject(error))
  });
}

const setUserInfo = (data) => {
  console.log("設定使用者資訊");
  userInfo = data;
  setConetntPage()
}

const googleOauth2Start = () => {
  console.log("開始從 google 取得使用者資訊");
  tokenClient.callback = (resp) => {
    if (resp.error !== undefined) {
      throw(resp);
    }
    // const token = gapi.client.getToken(); // 從回應取得 token
    // expirationTime = new Date().getTime() + resp.expires_in * 1000;
    userToken = resp.access_token;
    // 再把 token 帶入 header 中去使用者資訊的 API 要資料
    // 如果要去要別的資料，要找到相對的 API 網址與需要送出什麼內容
    getUserInfo();
  }
  if (gapi.client.getToken() === null) {
    tokenClient.requestAccessToken({prompt: 'consent'});
  } else {
    tokenClient.requestAccessToken({prompt: ''});
  }
}

const getUserInfo = () => {
  console.log("fetch API 資料");
  fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: {
      'Authorization': 'Bearer ' + userToken
    }
  }).then(response => {
    if(!response.ok){
      throw new Error(`使用者 token 已過期 ${response.status}`)
    }else{
      return response.json();
    }
  }).then(userInfo => {
      console.log("寫入 localStorage");
      localStorage.setItem(storageKey, userToken);
      setUserInfo(userInfo)
  }).catch(error => {
    console.log(error);
    if (error.message.includes("401")) {
      setLoginPage();
    }
  })
}

const logout = () => {
  console.log("使用者登出");
  let cred = gapi.client.getToken();
  if (cred !== null) {
    google.accounts.oauth2.revoke(cred.access_token, () => {console.log('Revoked: ' + cred.access_token)});
    gapi.client.setToken('');
  }
  console.log("清空 localStorage 與全域使用者資訊");
  localStorage.removeItem(storageKey);
  userInfo = undefined;
  setLoginPage();
}