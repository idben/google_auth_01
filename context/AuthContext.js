import React, {createContext, useEffect, useState} from 'react';
import { useRouter } from 'next/router';

export const AuthContext = createContext(null);

export const AuthProvider =({children})=>{
  const [gapiInited, setGapiInited] = useState(false);
  const [gisInited, setGisInited] = useState(false);
  const [tokenClient, setTokenClient] = useState(null);
  const storageKey = 'googleOauth2UserInfo';
  const [user, setUser] = useState(undefined);
  const [token, setToken] = useState(undefined);
  const [redirectPath, setRedirectPath] = useState(undefined);
  const router = useRouter();

  const loginRoute = "/login";
  const protectedRoutes = ["/page1", "/page2"]

  const gapiLoad = () => {
    gapi.load('client', async () => {
      await gapi.client.init({});
      setGapiInited(true);
    });
  };

  const gisInit = () => {
    const client = google.accounts.oauth2.initTokenClient({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      scope: 'profile email'
    });
    setTokenClient(client);
    setGisInited(true);
  };

  useEffect(() => {
    if (typeof gapi !== 'undefined') {
      gapiLoad(); // 確保 `gapiLoad` 在 `gapi` 可用時才執行
      gisInit();
    }
    if(localStorage.getItem(storageKey)){
      fetchUserInfo(localStorage.getItem(storageKey));
    }
  }, []);

  const fetchUserInfo = async (token, pathToRedirect) => {
    fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    }).then(response => {
        if (response.status === 401) {
          return {status: 401}
        }
        return response.json();
    }).then(result => {
      console.log(result);
      if(result.status == 401){
        checkProtects()
        return
      }
      localStorage.setItem(storageKey, token);
      setUser(result);
      if (pathToRedirect) {
        router.push(pathToRedirect);
        setRedirectPath(null);  // 清空重定向路徑
      }else{
        router.push("/");
      }
    }).catch(error => {
      console.error("發生錯誤:", error);
    });
  };

  const handleLogin = () => {
    const pathToRedirect = redirectPath;
    tokenClient.callback = (resp) => {
      if (resp.error) {
        console.error("OAuth Error", resp);
        return;
      }
      localStorage.setItem(storageKey, resp.access_token);
      fetchUserInfo(resp.access_token, pathToRedirect);
    }
    if (gapiInited && gisInited) {
      tokenClient.requestAccessToken({ prompt: 'consent' });
    }
  };

  const handleLogout = () => {
    console.log("handleLogout");
    google.accounts.oauth2.revoke(localStorage.getItem(storageKey), () => {
      localStorage.removeItem(storageKey);
      setUser(null);
    });
  };

  const checkProtects = () => {
    if (!user && protectedRoutes.includes(router.pathname)) {
      console.log("setRedirectPath", redirectPath);
      setRedirectPath(router.pathname);
      router.push(loginRoute);
    }
  }
  
  useEffect(()=>{
    checkProtects();
  }, [router.isReady, router.pathname, user]);

  return(
    <AuthContext.Provider value={{
      user,
      handleLogin, handleLogout
    }}>
      {children}
    </AuthContext.Provider>
  )
}