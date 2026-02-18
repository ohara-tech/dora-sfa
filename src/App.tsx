import { useState, useEffect } from 'react'

function App() {
  const [data, setData] = useState({ message: "読み込み中...", timestamp: "" });
  // ↓ ここに自分のGASのウェブアプリURLを貼り付けてください
  const GAS_URL = "https://script.google.com/macros/s/AKfycbwUKl8EkidZyI2ljJ6gL3hvXOiqI0wnOh2-sMunLHRcEDwiDacCCdwdxk0rj8WN03uM/exec";

  useEffect(() => {
    fetch(GAS_URL)
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => setData({ message: "エラーが発生しました", timestamp: err.toString() }));
  }, []);

  return (
    <div style={{ 
      padding: '40px', 
      textAlign: 'center', 
      fontFamily: 'sans-serif', 
      backgroundColor: '#f0f2f5', 
      minHeight: '100vh' 
    }}>
      <h1 style={{ color: '#1a73e8' }}>ドラ・スファ：ハイブリッド版</h1>
      <div style={{ 
        background: 'white', 
        padding: '30px', 
        borderRadius: '15px', 
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        maxWidth: '500px',
        margin: '0 auto'
      }}>
        <h2 style={{ fontSize: '1.2rem', color: '#5f6368' }}>GASからのリアルタイムデータ</h2>
        <hr style={{ border: '0', borderTop: '1px solid #eee', margin: '20px 0' }} />
        <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{data.message}</p>
        <p style={{ color: '#888' }}>取得時刻: {data.timestamp}</p>
      </div>
      <p style={{ marginTop: '30px', color: '#666' }}>
        ※フロントエンド：Vercel / バックエンド：GAS
      </p>
    </div>
  )
}

export default App
