import { useState } from 'react'
// Firebaseから必要な魔法（関数）をインポート
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// 1. 先ほどの画面に表示されている設定値をここに貼り付けます
const firebaseConfig = {
  apiKey: "AIzaSyC...", // あなたの画面の値をコピーしてください
  authDomain: "dora-sfa.firebaseapp.com",
  projectId: "dora-sfa",
  storageBucket: "dora-sfa.firebasestorage.app",
  messagingSenderId: "462643096222",
  appId: "1:462643096222:web:..."
};

// Firebaseの初期化
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

function App() {
  const [user, setUser] = useState<any>(null);

  // Googleログインを実行する関数
  const login = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        setUser(result.user);
        console.log("ログイン成功:", result.user.displayName);
      })
      .catch((error) => console.error("ログインエラー:", error));
  };

  return (
    <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>ドラ・スファ：認証版</h1>
      
      {!user ? (
        <div>
          <p>スプレッドシートのデータを見るにはログインが必要です</p>
          <button onClick={login} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
            Googleでログイン
          </button>
        </div>
      ) : (
        <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <p>ようこそ、{user.displayName} さん！</p>
          <p style={{ color: 'green' }}>✔ 社員認証済み</p>
          <hr />
          <p>※次は、このログイン情報を使ってGASを叩く設定をします</p>
        </div>
      )}
    </div>
  )
}

export default App
