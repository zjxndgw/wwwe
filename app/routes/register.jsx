import { useState } from 'react';
import { generateLoginCode, fetchData, saveData } from '../utils/data';

export default function Register(){
  const [code,setCode] = useState('');

  const handleRegister = async () => {
    const newCode = generateLoginCode();
    const data = await fetchData();
    data.usersList = data.usersList || [];
    data.usersList.push({ loginCode:newCode, isAdmin:false, wallet:'' });
    await saveData(data);
    setCode(newCode);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-3xl mb-4">注册用户</h1>
      <button onClick={handleRegister} className="bg-green-600 p-2 rounded">生成12个随机单词登录码</button>
      {code && <p className="mt-2 break-words">登录码: {code}</p>}
    </div>
  );
}
