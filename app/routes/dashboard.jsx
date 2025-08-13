import { useEffect, useState } from 'react';
import { fetchData } from '../utils/data';

export default function Dashboard(){
  const [projects,setProjects] = useState([]);
  useEffect(()=>{
    fetchData().then(data=>setProjects(data.projectsList || []));
  },[]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-5">
      <h1 className="text-2xl mb-3">用户面板</h1>
      <a href="/projects" className="bg-purple-600 p-2 rounded">查看/发起项目</a>
      <h2 className="text-xl mt-3">已有项目</h2>
      {projects.map(p=><div key={p.id} className="bg-gray-800 p-2 rounded mb-1">{p.name} - {p.desc}</div>)}
    </div>
  );
}
