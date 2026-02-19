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
      width: '100vw',           // 画面の幅いっぱいを確保
      fontFamily: 'sans-serif',
      display: 'flex',          // フレックスボックスを使用
      flexDirection: 'column',   // 縦に並べる
      alignItems: 'center',      // ★水平方向を「真ん中」に強制
      boxSizing: 'border-box'   // パディングを計算に含める
    }}>
      {/* タイトル：幅100%で中央寄せ */}
      <h1 style={{ color: '#1a73e8', textAlign: 'center', marginBottom: '30px', width: '100%' }}>
        ドラ・スファ：データ連携版
      </h1>
      
      {!user ? (
        /* ログイン前 */
        <div style={{ background: 'white', padding: '30px', borderRadius: '15px', width: '100%', maxWidth: '400px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <p>閲覧には「@doraever.jp」でのログインが必要です</p>
          <button onClick={login} style={{ backgroundColor: '#4285f4', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '5px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' }}>
            Googleでログイン
          </button>
        </div>
      ) : (
        /* ログイン後：ここが900pxの幅で真ん中に来ます */
        <div style={{ width: '100%', maxWidth: '900px' }}>
          {/* ユーザー情報バー */}
          <div style={{ background: 'white', padding: '15px 25px', borderRadius: '15px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ margin: 0 }}>ようこそ、<strong>{user.displayName}</strong> さん</p>
            <button onClick={logout} style={{ color: '#d93025', cursor: 'pointer', border: 'none', background: 'none', textDecoration: 'underline' }}>ログアウト</button>
          </div>

          {/* 案件リストカード */}
          <div style={{ background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h3 style={{ borderBottom: '2px solid #1a73e8', paddingBottom: '10px', marginBottom: '20px' }}>案件リスト（GAS連携テスト）</h3>
            {loading ? (
              <p style={{ textAlign: 'center' }}>読み込み中...</p>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                <p>現在表示できるデータがありません。</p>
                <p style={{ fontSize: '0.8rem' }}>※GASの権限設定が完了するとここに一覧が表示されます</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
