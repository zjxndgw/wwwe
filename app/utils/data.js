export const adminCode = 'stove husband six mind roast march calm party dwarf bundle favorite middle';
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
  await fetch('/.netlify/functions/setData', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify(newData)
  });
}
