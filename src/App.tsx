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
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchData(currentUser);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchData = async (currentUser: any) => {
    setLoading(true);
    try {
      const token = await getIdToken(currentUser);
      const url = `/api/gas?idToken=${token}&action=getCustomers`;
      const res = await fetch(url);
      const data = await res.json();
      setCustomers(data);
    } catch (err) {
      console.error("Data error:", err);
    } finally {
      setLoading(false);
    }
  };

  const login = () => signInWithPopup(auth, provider);
  const logout = () => {
    auth.signOut();
    setCustomers([]);
  };

  return (
    <div style={{ 
      padding: '40px 20px', 
      backgroundColor: '#f0f2f5', 
      minHeight: '100vh', 
      fontFamily: 'sans-serif',
      display: 'flex',           // 強制中央寄せ設定1
      flexDirection: 'column',    // 強制中央寄せ設定2
      alignItems: 'center'        // 強制中央寄せ設定3
    }}>
      <h1 style={{ color: '#1a73e8', marginBottom: '30px' }}>ドラ・スファ：データ連携版</h1>
      
      {!user ? (
        <div style={{ background: 'white', padding: '30px', borderRadius: '15px', width: '100%', maxWidth: '400px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <p>閲覧には「@doraever.jp」でのログインが必要です</p>
          <button onClick={login} style={{ backgroundColor: '#4285f4', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '5px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' }}>
            Googleでログイン
          </button>
        </div>
      ) : (
        <div style={{ width: '100%', maxWidth: '900px' }}>
          <div style={{ background: 'white', padding: '15px 25px', borderRadius: '15px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ margin: 0 }}>ようこそ、<strong>{user.displayName}</strong> さん</p>
            <button onClick={logout} style={{ color: '#d93025', cursor: 'pointer', border: 'none', background: 'none', textDecoration: 'underline' }}>ログアウト</button>
          </div>

          <div style={{ background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h3 style={{ borderBottom: '2px solid #1a73e8', paddingBottom: '10px', marginBottom: '20px' }}>案件リスト（GAS連携テスト）</h3>
            {loading ? (
              <p>読み込み中...</p>
            ) : customers && customers.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa' }}>
                    <th style={{ padding: '12px', borderBottom: '2px solid #dee2e6', textAlign: 'left' }}>案件名</th>
                    <th style={{ padding: '12px', borderBottom: '2px solid #dee2e6', textAlign: 'left' }}>担当者</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '12px' }}>{c.name}</td>
                      <td style={{ padding: '12px' }}>{c.assignedStaff}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                <p>現在表示できるデータがありません。</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
