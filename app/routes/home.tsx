import {useEffect,useState,useSyncExternalStore} from 'react';
import OfflineShell from '../shell/OfflineShell';
import LifeMap from '../features/life-map/LifeMap';
import type {State} from '../data/client';
type Client=typeof import('../data/client');
const initial:State={phase:'loading',trusted:false};
function Connected({client}:{client:Client}) {
 const state=useSyncExternalStore(client.subscribe,client.snapshot,()=>initial);
 const [error,setError]=useState(''),[busy,setBusy]=useState(false);
 const [online,setOnline]=useState(true);
 useEffect(()=>{const update=()=>setOnline(navigator.onLine);update();window.addEventListener('online',update);window.addEventListener('offline',update);return()=>{window.removeEventListener('online',update);window.removeEventListener('offline',update)}},[]);
 async function signOut(){if((state.pending||state.localError)&&!window.confirm('Sign out and discard local color changes? They have not been sent to the server.'))return;setError('');try{await client.logout()}catch{setError('Device cleanup could not finish. Close other LifeBuckets tabs, then retry.')}}
 async function submit(event:React.FormEvent<HTMLFormElement>){
  event.preventDefault();setBusy(true);setError('');
  const values=new FormData(event.currentTarget);
  try{await client.login(String(values.get('email')),String(values.get('password')),values.get('trusted')==='on')}
  catch(e){setError(e instanceof Error&&e.message.startsWith('Persistence')?e.message:'Sign-in failed. Check your details and the local services, then try again.')}
  finally{setBusy(false)}
 }
 return <main className="app-frame">
  {state.phase==='signed-out'?<section className="signin">
   <span className="eyebrow">A little space for your whole life</span><h1>LifeBuckets</h1>
   <p>Sign in to revisit your map, at your own pace.</p>
   <form onSubmit={submit}><label>Email<input required name="email" type="email" autoComplete="username"/></label>
   <label>Password<input required name="password" type="password" autoComplete="current-password"/></label>
   <label className="trust"><input type="checkbox" name="trusted"/>Remember data on this trusted device</label>
   <button className="primary" disabled={busy}>{busy?'Signing in…':'Sign in'}</button></form>
   <p className="fine">Local review · synthetic accounts only</p>
  </section>:state.phase==='ready'&&state.view?<LifeMap key={state.uid} view={state.view} onSignOut={signOut} onEdit={client.setLocalColor} editingDisabled={!!state.localError}/>:
  <section className="state-panel"><h1>LifeBuckets</h1><p role="status">{state.message||(state.phase==='loading'?'Loading your life map…':'Unable to load your map.')}</p>{state.phase==='error'&&<button className="plain-button" onClick={signOut}>Sign out and retry</button>}{state.phase==='cleanup'&&<button className="plain-button" onClick={signOut}>Retry device cleanup</button>}</section>}
  <OfflineShell/>
  {state.localError&&<p role="alert" className="notice error">{state.localError}</p>}
  {error&&<p className="notice error" role="alert">{error}</p>}
  {state.uid&&state.phase==='ready'&&<footer className="connection-note" aria-live="polite">
    <span>{online?(state.cached?'Cached data · waiting for server':'Server data received'):'Offline · previously loaded data'}</span>
    <span>{state.trusted?'Remembered on this trusted device':'Session only · offline restart unavailable'}</span>
    <span>{state.pending?`${state.pending} local color change${state.pending===1?'':'s'} · not sent to server`:'Color changes save locally · server sync is not connected'}</span>
    {!state.trusted&&<span>Local changes last only for this session</span>}
    {state.view?.fixture&&<span>Sample data · color meanings are not assigned</span>}
  </footer>}
 </main>;
}
export default function Home(){
 const [client,setClient]=useState<Client|null>(null),[error,setError]=useState('');
 useEffect(()=>{let active=true;import('../data/client').then(async c=>{await c.boot();if(active)setClient(c)}).catch(()=>setError('Unable to initialize the local application. Reload to retry.'));return()=>{active=false}},[]);
 return client?<Connected client={client}/>:<main className="app-frame"><p role="status">{error||'Opening LifeBuckets…'}</p></main>;
}
