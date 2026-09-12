import {initializeApp,deleteApp,type FirebaseApp} from 'firebase/app';
import {initializeAuth,inMemoryPersistence,browserLocalPersistence,connectAuthEmulator,signInWithEmailAndPassword,signInWithPopup,GoogleAuthProvider,browserPopupRedirectResolver,onAuthStateChanged,signOut,type Auth} from 'firebase/auth';
import {getFirestore,initializeFirestore,persistentLocalCache,persistentMultipleTabManager,memoryLocalCache,getDocsFromCache,getPersistentCacheIndexManager,connectFirestoreEmulator,clearIndexedDbPersistence,terminate,onSnapshot,doc,collection,query,where,type Firestore} from 'firebase/firestore';
import {makeView,type View} from './model';
import {config} from './config';
export const hosted=config.hosted;
export const signInMethod=config.signIn;
import {LocalColors,clearLocalColors,type ColorEdit} from './local-colors';

export interface State {
 phase:'signed-out'|'loading'|'ready'|'error'|'cleanup';
 view?:View;uid?:string;message?:string;cached?:boolean;trusted:boolean;pending?:number;localError?:string;
}
const TRUST='lifebuckets.trusted',CLEANUP='lifebuckets.cleanup',EPOCH='lifebuckets.epoch';
let state:State={phase:'signed-out',trusted:false};
const listeners=new Set<()=>void>();
export const subscribe=(fn:()=>void)=>{listeners.add(fn);return()=>{listeners.delete(fn)}};
export const snapshot=()=>state;
function emit(next:State){state=next;listeners.forEach(fn=>fn())}
interface Runtime {app:FirebaseApp;auth:Auth;db:Firestore;stops:(()=>void)[];trusted:boolean;epoch:string|null;colors?:LocalColors;refresh?:()=>void}
let runtime:Runtime|undefined,generation=0,bootPromise:Promise<void>|undefined,disposePromise:Promise<Firestore|undefined>|undefined;
function stopReads(){++generation;runtime?.stops.splice(0).forEach(fn=>fn())}
function blocked(){return localStorage.getItem(CLEANUP)!==null}
async function exclusive<T>(fn:()=>Promise<T>):Promise<T>{
 if(!navigator.locks)throw Error('Persistence coordination is unavailable. Use a supported browser.');
 return navigator.locks.request('lifebuckets-session',fn);
}
async function createRuntime(trusted:boolean){
 if(!config.hosted&&!['127.0.0.1','localhost'].includes(location.hostname))throw Error('This build requires a local review host.');
 if(trusted){try{await probeStorage()}catch{throw Error('Persistence is unavailable. Uncheck remember data and sign in for this session.')}}
 const app=initializeApp(config.firebase,'lifebuckets');
 const auth=initializeAuth(app,{persistence:trusted?browserLocalPersistence:inMemoryPersistence});
 if(!config.hosted)connectAuthEmulator(auth,'http://127.0.0.1:9099',{disableWarnings:true});
 const db=initializeFirestore(app,{localCache:trusted?persistentLocalCache({tabManager:persistentMultipleTabManager()}):memoryLocalCache()});if(!config.hosted)connectFirestoreEmulator(db,'127.0.0.1',8080);
 const r:Runtime={app,auth,db,stops:[],trusted,epoch:localStorage.getItem(EPOCH)};
 runtime=r;
 if(trusted){
  try{await getDocsFromCache(query(collection(db,'luckets'),where('ownerId','==','__cache_probe__')));if(!getPersistentCacheIndexManager(db))throw Error('Persistent cache unavailable')}
  catch{await dispose();throw Error('Persistence is unavailable. Uncheck remember data and sign in for this session.')}
 }
 await auth.authStateReady();
 if(blocked()){await dispose();return}
 r.stops.push(onAuthStateChanged(auth,user=>{
  if(runtime!==r)return;
  // Keep the auth listener, replace only the owner listeners.
  r.stops.splice(1).forEach(fn=>fn());const token=++generation;
  r.colors=undefined;r.refresh=undefined;
  if(!user){emit({phase:'signed-out',trusted:r.trusted});return}
  if(blocked()||r.epoch!==localStorage.getItem(EPOCH)){void dispose();return}
  r.colors=new LocalColors(user.uid,r.trusted?localStorage:undefined);
  emit({phase:'loading',uid:user.uid,trusted:r.trusted});
  let profile:Record<string,unknown>|undefined,records:{id:string;data:Record<string,unknown>}[]=[];
  let profileSeen=false,rowsSeen=false,profileCached=true,rowsCached=true,timedOut=false,readFailed=false;
  const timeout=window.setTimeout(()=>{timedOut=true;update()},2500);
  r.stops.push(()=>clearTimeout(timeout));
  const current=()=>runtime===r&&generation===token&&!blocked()&&r.epoch===localStorage.getItem(EPOCH);
  const fail=(e:unknown)=>{readFailed=true;if(current())emit({phase:'error',uid:user.uid,trusted:r.trusted,message:e instanceof Error?e.message:'Unable to load your map.'})};
  const update=()=>{
   if(!current()||readFailed||!profileSeen||!rowsSeen)return;
   if(!profile&&profileCached){
    emit({phase:navigator.onLine&&!timedOut?'loading':'error',uid:user.uid,trusted:r.trusted,message:navigator.onLine&&!timedOut?'Waiting for account data…':'Account data is not available offline. Reconnect to load it.'});return;
   }
   // An empty cached query cannot establish that an owner has no rows on the server.
   if(records.length===0&&rowsCached){emit({phase:navigator.onLine&&!timedOut?'loading':'error',uid:user.uid,trusted:r.trusted,message:navigator.onLine&&!timedOut?'Waiting for your hierarchy…':'Hierarchy data is not available offline. Reconnect to load it.'});return}
   try{
    const base=makeView(user.uid,profile,records);
    let view=base,pending=0,localError:string|undefined;
    try{view=r.colors!.project(base);pending=r.colors!.pending().length}
    catch{localError='Local changes could not be read. Editing is unavailable; stored changes have not been cleared.'}
    emit({phase:'ready',uid:user.uid,trusted:r.trusted,cached:profileCached||rowsCached,view,pending,localError});
   }catch(e){fail(e)}
  };
  r.refresh=update;
  r.stops.push(r.colors.subscribe(update));
  r.stops.push(onSnapshot(doc(db,'users',user.uid),{includeMetadataChanges:true},s=>{profile=s.data();profileSeen=true;profileCached=s.metadata.fromCache;update()},fail));
  r.stops.push(onSnapshot(query(collection(db,'luckets'),where('ownerId','==',user.uid)),{includeMetadataChanges:true},s=>{records=s.docs.map(d=>({id:d.id,data:d.data()}));rowsSeen=true;rowsCached=s.metadata.fromCache;update()},fail));
  const online=()=>update();window.addEventListener('offline',online);window.addEventListener('online',online);
  r.stops.push(()=>{window.removeEventListener('offline',online);window.removeEventListener('online',online)});
 }));
}
async function dispose():Promise<Firestore|undefined>{
 if(disposePromise)return disposePromise;
 const r=runtime;stopReads();runtime=undefined;
 if(!r)return;
 disposePromise=(async()=>{try{await signOut(r.auth);await terminate(r.db);await deleteApp(r.app);return r.db}finally{disposePromise=undefined}})();
 return disposePromise;
}
async function cleanup(){
 emit({phase:'cleanup',trusted:false,message:'Clearing personal data from this device…'});
 const old=await dispose();
 // Reopening after an interrupted cleanup must clear the same named database.
 let db=old,app:FirebaseApp|undefined;
 if(!db){app=initializeApp(config.firebase,'lifebuckets');db=getFirestore(app);await terminate(db)}
 try{
  let failure:unknown;
  for(let attempt=0;attempt<2;attempt++){
   try{await withTimeout(clearIndexedDbPersistence(db),2000);failure=undefined;break}
   catch(e){failure=e;await new Promise(r=>setTimeout(r,250))}
  }
  if(failure)throw failure;
  clearLocalColors(localStorage);
  localStorage.removeItem(TRUST);localStorage.removeItem(CLEANUP);
  emit({phase:'signed-out',trusted:false});
 }catch{
  emit({phase:'cleanup',trusted:false,message:'Cleanup is blocked. Close other LifeBuckets tabs and retry; account switching stays locked.'});
  throw Error('Cleanup blocked');
 }finally{if(app)await deleteApp(app)}
}
export async function login(email:string,password:string,trusted:boolean){
 await exclusive(async()=>{
  if(blocked())throw Error('Persistence cleanup is pending. Retry cleanup first.');
  if(runtime){await dispose()}
  if(trusted)localStorage.setItem(TRUST,'yes');else localStorage.removeItem(TRUST);
  try{
   await createRuntime(trusted);
   if(!runtime)throw Error('Session unavailable');
   if(config.signIn==='google')await signInWithPopup(runtime.auth,new GoogleAuthProvider(),browserPopupRedirectResolver);
   else await signInWithEmailAndPassword(runtime.auth,email,password);
  }catch(e){await dispose();localStorage.removeItem(TRUST);emit({phase:'signed-out',trusted:false});throw e}
 });
}
// Call immediately before an Assistant request; never persist or expose the token in UI.
export async function getChatToken():Promise<string>{
 const r=runtime,user=r?.auth.currentUser,epoch=generation;
 if(!r||!user||state.uid!==user.uid||blocked()||state.phase!=='ready')throw Error('Sign in to use Assistant.');
 const token=await user.getIdToken();
 if(runtime!==r||generation!==epoch||r.auth.currentUser!==user||state.uid!==user.uid||blocked()||r.epoch!==localStorage.getItem(EPOCH))
  throw Error('Your session changed. Sign in again.');
 return token;
}
export async function setLocalColor(input:ColorEdit):Promise<void>{
 const r=runtime,uid=state.uid,token=generation;
 await exclusive(async()=>{
  if(!r||runtime!==r||generation!==token||!uid||state.uid!==uid||state.phase!=='ready'||
   !state.view||state.localError||blocked()||r.epoch!==localStorage.getItem(EPOCH)||!r.colors)
   throw Error('Your session changed or local storage is unavailable. Reopen the map to try again.');
  try{r.colors.edit(input,state.view)}catch{
   throw Error('Could not save this color locally. Your previous saved choice is unchanged. Please try again.');
  }
  r.refresh?.();
 });
}
export async function logout(){
 // Persistent epoch invalidates suspended tabs even after the cleanup marker is removed.
 localStorage.setItem(CLEANUP,'pending');localStorage.setItem(EPOCH,crypto.randomUUID());
 emit({phase:'cleanup',trusted:false,message:'Clearing personal data from this device…'});
 await exclusive(cleanup);
}
export function boot():Promise<void>{
 if(bootPromise)return bootPromise;
 bootPromise=(async()=>{
  const invalidate=()=>{
   if(blocked()||(runtime&&runtime.epoch!==localStorage.getItem(EPOCH))){
    emit({phase:blocked()?'cleanup':'signed-out',trusted:false,message:blocked()?'Device cleanup is in progress. Close other tabs if it cannot finish.':undefined});
    void dispose().catch(()=>emit({phase:'cleanup',trusted:false,message:'Close this tab to finish device cleanup.'}));
   }
  };
  window.addEventListener('storage',e=>{if(e.key===CLEANUP||e.key===EPOCH){invalidate();if(!blocked()&&!runtime)emit({phase:'signed-out',trusted:false})}});
  window.addEventListener('focus',invalidate);
  document.addEventListener('visibilitychange',invalidate);
  await exclusive(async()=>{
   if(blocked()){await cleanup();return}
   if(localStorage.getItem(TRUST)==='yes'){
    try{await createRuntime(true)}catch(e){emit({phase:'error',trusted:false,message:e instanceof Error?e.message:'Persistent data is unavailable.'})}
   }
  });
 })();
 return bootPromise;
}

function withTimeout<T>(work:Promise<T>,milliseconds:number):Promise<T>{
 return new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('Storage operation timed out')),milliseconds);work.then(value=>{clearTimeout(timer);resolve(value)},error=>{clearTimeout(timer);reject(error)})});
}
async function probeStorage(){
 const storage=window.indexedDB;
 if(!storage)throw Error('IndexedDB unavailable');
 const name='lifebuckets-storage-probe-'+crypto.randomUUID();
 await withTimeout(new Promise<void>((resolve,reject)=>{
  const request=storage.open(name,1);
  request.onerror=()=>reject(request.error);
  request.onblocked=()=>reject(Error('Storage blocked'));
  request.onsuccess=()=>{request.result.close();const remove=storage.deleteDatabase(name);remove.onsuccess=()=>resolve();remove.onerror=()=>reject(remove.error)};
 }),2000);
}
