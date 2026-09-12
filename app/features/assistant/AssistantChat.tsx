import {useEffect,useRef,useState} from 'react';
import {ChatKit,useChatKit} from '@openai/chatkit-react';
type Client=typeof import('../../data/client');
const SCRIPT='https://cdn.platform.openai.com/deployments/chatkit/chatkit.js';
let scriptReady:Promise<void>|undefined;
function loadChatKit(){
 if(customElements.get('openai-chatkit'))return Promise.resolve();
 if(!scriptReady)scriptReady=new Promise<void>((resolve,reject)=>{
  const script=document.createElement('script');script.src=SCRIPT;script.async=true;
  const timer=window.setTimeout(()=>fail(),20000);
  function fail(){clearTimeout(timer);script.remove();scriptReady=undefined;reject(Error('Chat could not load. Check your connection and retry.'))}
  script.onerror=fail;
  customElements.whenDefined('openai-chatkit').then(()=>{clearTimeout(timer);resolve()});
  document.head.append(script);
 });
 return scriptReady;
}

function Conversation({client,online,provider,onNew}:{client:Client;online:boolean;provider:string;onNew:()=>void}){
 const lifetime=useRef<AbortController|null>(null);
 const [error,setError]=useState(''),[busy,setBusy]=useState(false),[ready,setReady]=useState(false);
 useEffect(()=>{lifetime.current=new AbortController();return()=>{lifetime.current?.abort()}},[]);
 const {control}=useChatKit({
  api:{url:'/api/chatkit',domainKey:import.meta.env.VITE_CHATKIT_DOMAIN_KEY||'domain_pk_localhost_dev',
   fetch:async(input,init)=>{
    const url=new URL(input instanceof Request?input.url:String(input),window.location.origin);
    if(url.origin!==window.location.origin||url.pathname!=='/api/chatkit')throw Error('Unexpected chat endpoint');
    if(!navigator.onLine)throw Error('Reconnect to send a message.');
    if(!lifetime.current||lifetime.current.signal.aborted)throw Error('Conversation closed');
    try{
     const token=await client.getChatToken();
     const headers=new Headers(init?.headers||(input instanceof Request?input.headers:undefined));
     headers.set('Authorization','Bearer '+token);
     const signals=[lifetime.current.signal];if(init?.signal)signals.push(init.signal);
     setError('');
     const response=await fetch(input,{...init,headers,cache:'no-store',redirect:'error',signal:AbortSignal.any(signals)});
     if(!response.ok){
      const messages:Record<number,string>={400:'Please send only text, up to 2000 characters.',401:'Your session expired. Return to your life map and sign in.',403:'This conversation is unavailable. Start a new chat.',404:'This conversation expired. Start a new chat.',429:'Please wait before sending another message.'};
      setError(messages[response.status]||'Assistant is unavailable. Check the server and try again.');
     }
     return response;
    }catch(e){if(!lifetime.current.signal.aborted)setError('Unable to send. Check your connection and sign-in, then try again.');throw e}
   }},
  locale:'en',frameTitle:'LifeBuckets Assistant',initialThread:null,
  theme:{colorScheme:'light',radius:'round',color:{accent:{primary:'#27313f',level:2}}},
  header:{enabled:false},history:{enabled:false},
  startScreen:{greeting:'A little space to talk.',prompts:[{label:'Say hello',prompt:'Hi! Please introduce yourself briefly.',icon:'sparkle'}]},
  composer:{placeholder:'Message Assistant…',attachments:{enabled:false},dictation:{enabled:false}},
  threadItemActions:{feedback:false,retry:false},
  disclaimer:{text:'Chats are temporary. Refreshing starts a new conversation.',highContrast:true},
  onReady:()=>setReady(true),onResponseStart:()=>setBusy(true),onResponseEnd:()=>setBusy(false),
  onError:()=>{setBusy(false);setError(previous=>previous||'Chat could not finish. Please try again or start a new chat.')},
 });
 return <>
  <div className="assistant-title"><div><h1>Assistant</h1><p>{provider==='simulated'?'Local test · simulated replies':'A conversation with GPT'}</p></div><button onClick={onNew} className="assistant-new">＋ New chat</button></div>
  {!online&&<p className="assistant-alert" role="status">You’re offline. Reconnect to send a message. Your draft stays here.</p>}
  {error&&<p className="assistant-alert" role="alert">{error}</p>}
  {!ready&&<p role="status">Loading chat…</p>}
  <div className="assistant-chat" inert={!online}><ChatKit control={control} className="assistant-widget"/></div>
  <span className="assistant-status" role="status">{busy?'Assistant is replying…':''}</span>
 </>;
}

export default function AssistantChat({client}:{client:Client}){
 const [online,setOnline]=useState(navigator.onLine),[loaded,setLoaded]=useState(false),[error,setError]=useState(''),[attempt,setAttempt]=useState(0),[conversation,setConversation]=useState(0),[provider,setProvider]=useState('');
 useEffect(()=>{const update=()=>setOnline(navigator.onLine);window.addEventListener('online',update);window.addEventListener('offline',update);return()=>{window.removeEventListener('online',update);window.removeEventListener('offline',update)}},[]);
 useEffect(()=>{
  const abort=new AbortController();let active=true;setError('');setLoaded(false);
  if(!['localhost','127.0.0.1'].includes(location.hostname)&&!import.meta.env.VITE_CHATKIT_DOMAIN_KEY){setError('Assistant is not configured on this site yet.');return}
  Promise.all([loadChatKit(),fetch('/api/chatkit/health',{cache:'no-store',signal:abort.signal}).then(async r=>{if(!r.ok)throw Error('Assistant server is unavailable.');const result=await r.json();if(!['simulated','openai'].includes(result.provider))throw Error('Assistant server is unavailable.');return result.provider as string})]).then(([,mode])=>{if(active){setProvider(mode);setLoaded(true)}}).catch(()=>{if(active)setError('Assistant could not load. Check your connection and that the local chat server is running.')});
  return()=>{active=false;abort.abort()};
 },[attempt]);
 if(error)return <section className="assistant-unavailable"><h1>Assistant</h1><p role="alert">{error}</p><button className="assistant-new" onClick={()=>setAttempt(n=>n+1)}>Retry</button></section>;
 return loaded?<Conversation key={conversation} client={client} online={online} provider={provider} onNew={()=>setConversation(n=>n+1)}/>:<p role="status">Opening chat…</p>;
}
