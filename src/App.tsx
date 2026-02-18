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

function App() {
  const [user, setUser] = useState<any>(null);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // ログイン状態を監視
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchData(currentUser);
      }
    });
    return () => unsubscribe();
  }, []);

  // GASからデータを取得する関数
  const fetchData = async (currentUser: any) => {
    setLoading(true);
    try {
      const token = await getIdToken(currentUser);
      // VercelのRewrites（vercel.json）設定を利用した中継URL
      const url = `/api/gas?idToken=${token}&action=getCustomers`;
      
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
    // 全体を包むコンテナ：textAlignを一旦centerにしてタイトル等を中央寄せしやすくする
    <div style={{ 
      padding: '40px 20px', 
      backgroundColor: '#f0f2f5', 
      minHeight: '100vh', 
      fontFamily: 'sans-serif',
      display: 'block' 
    }}>
      {/* タイトル */}
      <h1 style={{ color: '#1a73e8', textAlign: 'center', marginBottom: '30px' }}>ドラ・スファ：データ連携版</h1>
      
      {!user ? (
        /* --- ログイン前画面 --- */
        <div style={{ 
          background: 'white', 
          padding: '30px', 
          borderRadius: '15px', 
          maxWidth: '400px', 
          margin: '0 auto', 
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)', 
          textAlign: 'center' 
        }}>
          <p>閲覧には「@doraever.jp」でのログインが必要です</p>
          <button onClick={login} style={{ backgroundColor: '#4285f4', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '5px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' }}>
            Googleでログイン
          </button>
        </div>
      ) : (
        /* --- ログイン後画面：ここが中央に来るように修正 --- */
        <div style={{ 
          maxWidth: '900px',    // 画面中央に表示されるコンテンツの最大幅
          margin: '0 auto',     // ★重要：左右の余白を自動にして中央配置にする
          textAlign: 'left'      // 中のテキストは基本左揃えに戻す
        }}>
          
          {/* ユーザー情報バー：左右に分散配置 */}
          <div style={{ 
            background: 'white', 
            padding: '15px 25px', 
            borderRadius: '15px', 
            marginBottom: '20px', 
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}>
            <p style={{ margin: 0 }}>ようこそ、<strong>{user.displayName}</strong> さん</p>
            <button onClick={logout} style={{ color: '#d93025', cursor: 'pointer', border: 'none', background: 'none', textDecoration: 'underline', fontWeight: 'bold' }}>ログアウト</button>
          </div>

          {/* メインの案件リストカード */}
          <div style={{ 
            background: 'white', 
            padding: '30px', 
            borderRadius: '15px', 
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
          }}>
            <h3 style={{ borderBottom: '2px solid #1a73e8', paddingBottom: '10px', marginBottom: '20px', color: '#333' }}>案件リスト（GAS連携テスト）</h3>
            
            {loading ? (
              <p style={{ textAlign: 'center', padding: '20px' }}>データを読み込んでいます...</p>
            ) : customers && customers.length > 0 ? (
              /* --- データがある時のテーブル表示 --- */
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa' }}>
                    <th style={{ padding: '12px', borderBottom: '2px solid #dee2e6' }}>案件名</th>
                    <th style={{ padding: '12px', borderBottom: '2px solid #dee2e6' }}>担当者</th>
                    <th style={{ padding: '12px', borderBottom: '2px solid #dee2e6' }}>確度</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((cust: any, index: number) => (
                    <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '12px' }}>{cust.name || '---'}</td>
                      <td style={{ padding: '12px' }}>{cust.assignedStaff || '---'}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ backgroundColor: '#e8f0fe', color: '#1a73e8', padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem' }}>
                          {cust.probability || '検討中'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              /* --- データがない時（権限待ちなど）の表示 --- */
              <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                <p>現在表示できるデータがありません。</p>
                <p style={{ fontSize: '0.8rem', color: '#999' }}>※GAS側の権限設定が完了するとここに一覧が表示されます</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
