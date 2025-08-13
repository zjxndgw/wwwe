import { useState, useEffect } from 'react';
import { fetchData, saveData, adminWallet } from '../utils/data';

export default function Projects(){
  const [projects,setProjects] = useState([]);
  const [wallet,setWallet] = useState('');
  const [amount,setAmount] = useState('');
  const [name,setName] = useState('');
  const [desc,setDesc] = useState('');

  useEffect(()=>{
    fetchData().then(data=>{ setProjects(data.projectsList || []); });
  },[]);

  const handleCreate = async ()=>{
    if(!name) return alert('请输入项目名称');
    const data = await fetchData();
    data.projectsList = data.projectsList || [];
    data.projectsList.push({ id:data.projectsList.length+1, name, desc, creator:'用户' });
    await saveData(data);
    setProjects(data.projectsList);
    setName(''); setDesc('');
  };

  const handleDonate = async ()=>{
    if(!wallet||!amount) return alert('请输入钱包和金额');
    const data = await fetchData();
    data.donationsList = data.donationsList || [];
    data.donationsList.push({ projectId:projects.length, donor:'用户', wallet, amount });
    await saveData(data);
    alert('请将BNB打到管理员钱包 '+adminWallet);
    setWallet(''); setAmount('');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-5">
      <h1 className="text-2xl mb-3">项目列表/发起项目</h1>
      <div className="mb-3">
        <input placeholder="项目名称" value={name} onChange={e=>setName(e.target.value)} className="p-1 rounded text-black mr-2" />
        <input placeholder="项目描述" value={desc} onChange={e=>setDesc(e.target.value)} className="p-1 rounded text-black mr-2" />
        <button onClick={handleCreate} className="bg-purple-600 p-1 rounded">发起项目</button>
      </div>
      <div className="mb-3">
        <input placeholder="你的钱包地址" value={wallet} onChange={e=>setWallet(e.target.value)} className="p-1 rounded text-black mr-2" />
        <input placeholder="捐款BNB" type="number" value={amount} onChange={e=>setAmount(e.target.value)} className="p-1 rounded text-black mr-2" />
        <button onClick={handleDonate} className="bg-blue-600 p-1 rounded">捐款</button>
      </div>
      <h2 className="text-xl mt-3">已有项目</h2>
      {projects.map(p=><div key={p.id} className="bg-gray-800 p-2 rounded mb-1">{p.name} - {p.desc}</div>)}
    </div>
  );
}
