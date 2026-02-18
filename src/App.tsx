import { useState, useEffect } from 'react'
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, getIdToken } from "firebase/auth";

// 1. Firebaseの設定
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

// ★ 自分のGASのウェブアプリURLをここに貼り付けてください
const GAS_URL = "https://script.google.com/macros/s/AKfycbzneIkwpYaUIfZZvaOmwTXFWOBCFJr7He-AYMlBN3_XbbKMH8RFChQMt8WYDlMlAnXm/exec";

function App() {
  const [user, setUser] = useState<any>(null);
  const [customers, setCustomers] = useState<any[]>([]); // 案件データの入れ物
  const [loading, setLoading] = useState(false);

  // ログイン状態を監視
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // ログインしたら自動でデータを取得しにいく
        fetchData(currentUser);
      }
    });
    return () => unsubscribe();
  }, []);

  // GASからデータを取得する関数
  const fetchData = async (currentUser: any) => {
    setLoading(true);
    try {
      // 証明書（トークン）を取得
      const token = await getIdToken(currentUser);
      // action=getCustomers を指定して呼び出す
      const url = `${GAS_URL}?idToken=${token}&action=getCustomers`;
      
      const res = await fetch(url);
      const data = await res.json();
      setCustomers(data);
    } catch (err) {
      console.error("データ取得エラー:", err);
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
    <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#f0f2f5', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#1a73e8' }}>ドラ・スファ：データ連携版</h1>
      
      {!user ? (
        <div style={{ background: 'white', padding: '30px', borderRadius: '15px', maxWidth: '400px', margin: '0 auto', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <p>閲覧には「@doraever.jp」でのログインが必要です</p>
          <button onClick={login} style={{ backgroundColor: '#4285f4', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '5px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' }}>
            Googleでログイン
          </button>
        </div>
      ) : (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '15px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <p>ようこそ、<strong>{user.displayName}</strong> さん</p>
            <button onClick={logout} style={{ color: '#d93025', cursor: 'pointer', border: 'none', background: 'none', textDecoration: 'underline' }}>ログアウト</button>
          </div>

          <div style={{ background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h3>案件リスト（GAS連携テスト）</h3>
            {loading ? (
              <p>読み込み中...</p>
            ) : customers.length > 0 ? (
              <ul style={{ textAlign: 'left' }}>
                {/* 最初の3件だけ表示してみるテスト */}
                {customers.slice(0, 3).map((cust: any, index: number) => (
                  <li key={index} style={{ marginBottom: '10px' }}>
                    <strong>{cust.name}</strong> - 担当: {cust.assignedStaff}
                  </li>
                ))}
              </ul>
            ) : (
              <p>データが見つかりませんでした。</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
