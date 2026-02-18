import { useState, useEffect } from 'react'
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";

// 1. Firebaseの設定（画像17枚目の内容を反映しています）
const firebaseConfig = {
  apiKey: "AIzaSyCQrP3Lvkvm8vcZpqjSjtLLHW1ge2luNDc",
  authDomain: "dora-sfa.firebaseapp.com",
  projectId: "dora-sfa",
  storageBucket: "dora-sfa.firebasestorage.app",
  messagingSenderId: "462643096222",
  appId: "1:462643096222:web:272a5a72d839c21c2a98f1",
  measurementId: "G-9BVQ2MW5HQ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

function App() {
  const [user, setUser] = useState<any>(null);

  // ログイン状態を監視
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // 例：案件データを取得する場合の fetch
const url = `${GAS_URL}?idToken=${token}&action=getCustomers`;
fetch(url)
  .then(res => res.json())
  .then(data => setCustomers(data));

  const login = () => {
    signInWithPopup(auth, provider).catch(err => console.error(err));
  };

  const logout = () => auth.signOut();

  return (
    <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#f0f2f5', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#1a73e8' }}>ドラ・スファ：認証版</h1>
      
      {!user ? (
        <div style={{ background: 'white', padding: '30px', borderRadius: '15px', maxWidth: '400px', margin: '0 auto', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <p>閲覧には「@doraever.jp」でのログインが必要です</p>
          <button onClick={login} style={{ backgroundColor: '#4285f4', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '5px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' }}>
            Googleでログイン
          </button>
        </div>
      ) : (
        <div style={{ background: 'white', padding: '30px', borderRadius: '15px', maxWidth: '500px', margin: '0 auto', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <p style={{ fontSize: '1.2rem' }}>ようこそ、<strong>{user.displayName}</strong> さん！</p>
          <p style={{ color: '#28a745', fontWeight: 'bold' }}>● 社員認証済み</p>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>{user.email}</p>
          <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #eee' }} />
          <p>※次は、この情報をGASへ送る設定をします</p>
          <button onClick={logout} style={{ background: 'none', border: 'none', color: '#d93025', cursor: 'pointer', textDecoration: 'underline' }}>
            ログアウト
          </button>
        </div>
      )}
    </div>
  )
}

export default App
