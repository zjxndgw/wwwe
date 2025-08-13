const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const projectName = 'RenrenHuandai';
const outputZip = path.join(__dirname, `${projectName}.zip`);

// 文件内容
const files = {
  'app/utils/data.js': `export const adminCode = 'stove husband six mind roast march calm party dwarf bundle favorite middle';
export const adminWallet = '0xADMINWALLET';
export function generateLoginCode() {
  const words = ["apple","banana","cat","dog","elephant","fish","goat","hat","ice","jungle","kite","lion","moon","nest","orange","penguin","queen","rose","sun","tree","umbrella","violet","wolf","xray","yellow","zebra"];
  return Array.from({length:12},()=>words[Math.floor(Math.random()*words.length)]).join(' ');
}
export async function fetchData(){
  const res = await fetch('/.netlify/functions/getData');
  return res.json();
}
export async function saveData(newData){
  await fetch('/.netlify/functions/setData', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(newData) });
}`,
  'app/routes/index.jsx': `import { useState } from 'react';
import { useNavigate } from '@remix-run/react';
import { adminCode, fetchData } from '../utils/data';
export default function Index(){
  const navigate = useNavigate();
  const [input,setInput] = useState('');
  const handleLogin = async (e) => {
    e.preventDefault();
    if(input === adminCode){ navigate('/admin'); return; }
    const data = await fetchData();
    if(data.usersList.some(u=>u.loginCode===input)){ navigate('/dashboard'); }
    else { alert('登录失败'); }
  };
  return (<div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
    <h1 className="text-3xl mb-4">人人还贷 登录</h1>
    <form onSubmit={handleLogin} className="flex flex-col gap-2 w-80">
      <input type="text" placeholder="输入12个单词登录码" value={input} onChange={e=>setInput(e.target.value)} className="p-2 rounded text-black" />
      <button type="submit" className="bg-blue-600 p-2 rounded">登录</button>
    </form>
  </div>);
}`,
  'app/routes/register.jsx': `import { useState } from 'react';
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
  return (<div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
    <h1 className="text-3xl mb-4">注册用户</h1>
    <button onClick={handleRegister} className="bg-green-600 p-2 rounded">生成12个随机单词登录码</button>
    {code && <p className="mt-2 break-words">登录码: {code}</p>}
  </div>);
}`,
  'app/routes/dashboard.jsx': `import { useEffect, useState } from 'react';
import { fetchData } from '../utils/data';
export default function Dashboard(){
  const [projects,setProjects] = useState([]);
  useEffect(()=>{ fetchData().then(data=>setProjects(data.projectsList || [])); },[]);
  return (<div className="min-h-screen bg-gray-900 text-white p-5">
    <h1 className="text-2xl mb-3">用户面板</h1>
    <a href="/projects" className="bg-purple-600 p-2 rounded">查看/发起项目</a>
    <h2 className="text-xl mt-3">已有项目</h2>
    {projects.map(p=><div key={p.id} className="bg-gray-800 p-2 rounded mb-1">{p.name} - {p.desc}</div>)}
  </div>);
}`,
  'app/routes/projects.jsx': `import { useState, useEffect } from 'react';
import { fetchData, saveData, adminWallet } from '../utils/data';
export default function Projects(){
  const [projects,setProjects] = useState([]);
  const [wallet,setWallet] = useState('');
  const [amount,setAmount] = useState('');
  const [name,setName] = useState('');
  const [desc,setDesc] = useState('');
  useEffect(()=>{ fetchData().then(data=>{ setProjects(data.projectsList || []); }); },[]);
  const handleCreate = async ()=>{
    if(!name) return alert('请输入项目名称');
    const data = await fetchData();
    data.projectsList = data.projectsList || [];
    data.projectsList.push({ id:data.projectsList.length+1, name, desc, creator:'用户' });
    await saveData(data); setProjects(data.projectsList); setName(''); setDesc('');
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
  return (<div className="min-h-screen bg-gray-900 text-white p-5">
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
  </div>);
}`,
  'app/routes/admin.jsx': `import { useEffect, useState } from 'react';
import { fetchData, adminWallet } from '../utils/data';
export default function Admin(){
  const [donations,setDonations] = useState([]);
  useEffect(()=>{ fetchData().then(data=>setDonations(data.donationsList || [])); },[]);
  return (<div className="min-h-screen bg-gray-900 text-white p-5">
    <h1 className="text-2xl mb-3">管理员后台</h1>
    <p>管理员钱包: {adminWallet}</p>
    <h2 className="mt-3">捐款记录</h2>
    {donations.map((d,i)=><div key={i} className="bg-red-800 p-2 rounded mb-1">项目ID:{d.projectId} 用户:{d.donor} 钱包:{d.wallet} 金额:{d.amount}BNB</div>)}
  </div>);
}`,
  'netlify/functions/getData.js': `const fs = require('fs');
const path = require('path');
const DATA_FILE = path.join(__dirname, '../../data.json');
exports.handler = async () => {
  try { const data = JSON.parse(fs.readFileSync(DATA_FILE,'utf-8')); return { statusCode:200, body:JSON.stringify(data) }; }
  catch(err){ return { statusCode:500, body:JSON.stringify({ error: err.message }) }; }
};`,
  'netlify/functions/setData.js': `const fs = require('fs');
const path = require('path');
const DATA_FILE = path.join(__dirname, '../../data.json');
exports.handler = async (event) => {
  try { const newData = JSON.parse(event.body); fs.writeFileSync(DATA_FILE, JSON.stringify(newData,null,2)); return { statusCode:200, body:JSON.stringify({success:true})}; }
  catch(err){ return { statusCode:500, body:JSON.stringify({ error: err.message }) }; }
};`,
  'data.json': `{"usersList":[],"projectsList":[],"donationsList":[]}`,
  'netlify.toml': `[build]
  command = "npm run build"
  publish = "public"
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200`
};

// 创建目录和文件
function createFiles(basePath, filesObj){
  for(const filePath in filesObj){
    const fullPath = path.join(basePath, filePath);
    const dir = path.dirname(fullPath);
    if(!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive:true });
    fs.writeFileSync(fullPath, filesObj[filePath], 'utf-8');
  }
}

// 创建项目目录
const tempDir = path.join(__dirname, projectName);
if(!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
createFiles(tempDir, files);

// 压缩成 zip
const output = fs.createWriteStream(outputZip);
const archive = archiver('zip', { zlib:{level:9} });
output.on('close', ()=>{ console.log(`${outputZip} 创建完成，大小: ${archive.pointer()} bytes`); });
archive.pipe(output);
archive.directory(tempDir, projectName);
archive.finalize();
