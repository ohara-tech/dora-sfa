import { useState, useEffect } from 'react'
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, getIdToken } from "firebase/auth";

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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  const login = () => signInWithPopup(auth, provider);
  const logout = () => auth.signOut();

  return (
    <div style={{ 
      padding: '40px 20px', 
      backgroundColor: '#f0f2f5', 
      minHeight: '100vh', 
      width: '100%',
      fontFamily: 'sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <h1 style={{ color: '#1a73e8', marginBottom: '30px' }}>ドラ・スファ：データ連携版</h1>
      
      {!user ? (
        <div style={{ background: 'white', padding: '30px', borderRadius: '15px', width: '100%', maxWidth: '400px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <p>閲覧にはログインが必要です</p>
          <button onClick={login} style={{ backgroundColor: '#4285f4', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '5px', cursor: 'pointer' }}>
            Googleでログイン
          </button>
        </div>
      ) : (
        <div style={{ width: '100%', maxWidth: '900px' }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '15px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p>ようこそ、<strong>{user.displayName}</strong> さん</p>
            <button onClick={logout} style={{ color: '#d93025', border: 'none', background: 'none', textDecoration: 'underline', cursor: 'pointer' }}>ログアウト</button>
          </div>

          <div style={{ background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h3 style={{ borderBottom: '2px solid #1a73e8', paddingBottom: '10px' }}>案件リスト</h3>
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              <p>現在表示できるデータがありません。</p>
              <p style={{ fontSize: '0.8rem' }}>権限設定を待機中です</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
