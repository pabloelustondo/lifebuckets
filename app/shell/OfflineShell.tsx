import {useEffect,useState} from 'react';
export default function OfflineShell(){
 const [message,setMessage]=useState('');
 useEffect(()=>{
  if(!('serviceWorker' in navigator)){setMessage('Offline app reopening is unavailable in this browser.');return}
  let alive=true;
  const hadController=!!navigator.serviceWorker.controller;
  navigator.serviceWorker.register('/sw.js').then(reg=>{
   const check=()=>{if(alive&&hadController&&reg.waiting)setMessage('An app update is ready. Close all LifeBuckets tabs and reopen to use it.')};
   check();reg.addEventListener('updatefound',()=>reg.installing?.addEventListener('statechange',check));
  }).catch(()=>{if(alive)setMessage('The app shell could not be saved. Offline reopening may be unavailable.')});
  return()=>{alive=false};
 },[]);
 return message?<p className="connection-note" role="status">{message}</p>:null;
}
