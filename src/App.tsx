import { useState, useEffect } from 'react'
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCQrP3Lvkvm8vcZpqjSjtLLHW1ge2luNDc",
  authDomain: "dora-sfa.firebaseapp.com",
  projectId: "dora-sfa",
  storageBucket: "dora-sfa.firebasestorage.app",
  messagingSenderId: "462643096222",
  appId: "1:462643096222:web:272a5a72d839c21c2a98f1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

function App() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  const login = () => signInWithPopup(auth, provider);
  const logout = () => auth.signOut();

  return (
    <div style={{ 
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: '100vh',
      width: '100vw',
      backgroundColor: '#f0f2f5',
      padding: '40px 20px',
      boxSizing: 'border-box',
      fontFamily: 'sans-serif'
    }}>
      <h1 style={{ color: '#1a73e8', marginBottom: '30px' }}>ドラ・スファ：データ連携版</h1>
      
      {!user ? (
        <div style={{ background: 'white', padding: '30px', borderRadius: '15px', width: '100%', maxWidth: '400px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <p style={{ marginBottom: '20px' }}>閲覧にはログインが必要です</p>
          <button onClick={login} style={{ backgroundColor: '#4285f4', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
            Googleでログイン
          </button>
        </div>
      ) : (
        <div style={{ width: '100%', maxWidth: '800px' }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '15px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p>ようこそ、<strong>{user.displayName}</strong> さん</p>
            <button onClick={logout} style={{ color: '#d93025', border: 'none', background: 'none', textDecoration: 'underline', cursor: 'pointer' }}>ログアウト</button>
          </div>
          <div style={{ background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', textAlign: 'center' }}>
            <h3 style={{ borderBottom: '2px solid #1a73e8', paddingBottom: '10px', marginBottom: '20px', textAlign: 'left' }}>案件リスト</h3>
            <p style={{ color: '#666', padding: '40px 0' }}>現在、表示設定を更新中です。しばらくお待ちください。</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
