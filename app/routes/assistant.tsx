import {useEffect,useState,useSyncExternalStore} from 'react';
import {Link} from 'react-router';
import type {State} from '../data/client';
import AssistantChat from '../features/assistant/AssistantChat';
import '../features/assistant/assistant.css';
type Client=typeof import('../data/client');
const initial:State={phase:'loading',trusted:false};
function Connected({client}:{client:Client}){
 const state=useSyncExternalStore(client.subscribe,client.snapshot,()=>initial);
 return state.phase==='ready'&&state.uid?<AssistantChat key={state.uid} client={client}/>:<section className="assistant-unavailable"><p role="status">{state.phase==='loading'?'Opening your session…':'Sign in on your life map to use Assistant.'}</p><Link to="/">Go to life map</Link></section>;
}
export default function Assistant(){
 const [client,setClient]=useState<Client|null>(null),[error,setError]=useState('');
 useEffect(()=>{let active=true;import('../data/client').then(async c=>{await c.boot();if(active)setClient(c)}).catch(()=>setError('Unable to open your session. Return to your life map and sign in.'));return()=>{active=false}},[]);
 return <main className="assistant-page">
  <header className="assistant-brand"><Link to="/">LifeBuckets</Link><span className="assistant-avatar" aria-label="Account">P</span></header>
  <nav className="assistant-back"><Link to="/">← Life map</Link></nav>
  {client?<Connected client={client}/>:<p role="status">{error||'Opening Assistant…'}</p>}
 </main>;
}
