import { useEffect, useState } from 'react';
import { fetchData, adminWallet } from '../utils/data';

export default function Admin(){
  const [donations,setDonations] = useState([]);

  useEffect(()=>{
    fetchData().then(data=>setDonations(data.donationsList || []));
  },[]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-5">
      <h1 className="text-2xl mb-3">管理员后台</h1>
      <p>管理员钱包: {adminWallet}</p>
      <h2 className="mt-3">捐款记录</h2>
      {donations.map((d,i)=><div key={i} className="bg-red-800 p-2 rounded mb-1">项目ID:{d.projectId} 用户:{d.donor} 钱包:{d.wallet} 金额:{d.amount}BNB</div>)}
    </div>
  );
}
