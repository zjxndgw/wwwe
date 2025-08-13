import { useState } from 'react';
import { useNavigate } from '@remix-run/react';
import { adminCode, fetchData } from '../utils/data';

export default function Index(){
  const navigate = useNavigate();
  const [input,setInput] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if(input === adminCode){
      navigate('/admin');
      return;
    }
    const data = await fetchData();
    if(data.usersList.some(u=>u.loginCode===input)){
      navigate('/dashboard');
    } else {
      alert('登录失败');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-3xl mb-4">人人还贷 登录</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-2 w-80">
        <input type="text" placeholder="输入12个单词登录码" value={input} onChange={e=>setInput(e.target.value)} className="p-2 rounded text-black" />
        <button type="submit" className="bg-blue-600 p-2 rounded">登录</button>
      </form>
    </div>
  );
}
