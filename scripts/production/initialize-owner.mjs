import {readFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {initializeApp,deleteApp} from 'firebase-admin/app';
import {getAuth} from 'firebase-admin/auth';

const projectId='lifebuckets-bd43d';
process.env.GOOGLE_CLOUD_QUOTA_PROJECT=projectId;
if(process.env.FIRESTORE_EMULATOR_HOST||process.env.FIREBASE_AUTH_EMULATOR_HOST)throw Error('Production initialization refuses emulator variables');
const email=process.env.LIFEBUCKETS_OWNER_EMAIL;
const openDay=process.env.LIFEBUCKETS_INITIAL_DAY;
if(!email||!/^\d{4}-\d{2}-\d{2}$/.test(openDay||'')||new Date(openDay+'T12:00:00Z').toISOString().slice(0,10)!==openDay)throw Error('Explicit owner and valid initial day required');
const taxonomy=JSON.parse(await readFile('docs/08-specifications-as-code/taxonomy.json','utf8'));
if(taxonomy.categories.length!==7||taxonomy.categories.flatMap(c=>c.luckets).length!==49)throw Error('Unexpected taxonomy');
if(!process.argv.includes('--apply')){console.log('Dry run: 7 categories, 49 luckets, blank colors; initial day '+openDay);process.exit(0)}
const credential={getAccessToken:async()=>({access_token:execFileSync('gcloud',['auth','print-access-token'],{encoding:'utf8'}).trim(),expires_in:300})};
const app=initializeApp({projectId,credential},'production-provisioning');
try{
 const auth=getAuth(app);
 const base='https://firestore.googleapis.com/v1/projects/'+projectId+'/databases/(default)/documents';
 async function request(path,method='GET',body){
  const {access_token}=await credential.getAccessToken();
  const response=await fetch(base+path,{method,headers:{Authorization:'Bearer '+access_token,'Content-Type':'application/json','x-goog-user-project':projectId},body:body?JSON.stringify(body):undefined});
  if(response.status===404&&method==='GET')return null;
  if(!response.ok)throw Error('Firestore request failed: '+response.status+' '+(await response.text()).slice(0,400));
  return response.json();
 }
 const encode=value=>value===null?{nullValue:null}:typeof value==='number'?{integerValue:String(value)}:{stringValue:value};
 const writes=[];
 const create=(path,data)=>writes.push({update:{name:'projects/'+projectId+'/databases/(default)/documents/'+path,fields:Object.fromEntries(Object.entries(data).map(([k,v])=>[k,encode(v)]))},currentDocument:{exists:false}});

 let user;try{user=await auth.getUserByEmail(email)}catch(e){if(e.code!=='auth/user-not-found')throw e;user=await auth.createUser({email,emailVerified:false})}
 if(user.disabled)throw Error('Owner account is disabled');
 const profile='users/'+user.uid;
 const query={structuredQuery:{from:[{collectionId:'luckets'}],where:{fieldFilter:{field:{fieldPath:'ownerId'},op:'EQUAL',value:{stringValue:user.uid}}}}};
 const existing=await request(':runQuery','POST',query);
 if((await request('/'+profile))||existing.some(r=>r.document))throw Error('Existing owner data found; refusing to overwrite');
 let order=0;
 create(profile,{openDay,schemaVersion:1});
 for(const category of taxonomy.categories){
  const path=category.code+' — '+category.name;
  const record=(code,name,kind,bucket)=>({ownerId:user.uid,itemId:code,category:path,bucket,subBucket:'',subSubBucket:'',name,kind,sortOrder:order++,status:null,actionStatusDay:null,actionDay:openDay,description:'',schemaVersion:1});
  create('luckets/'+user.uid+'-'+category.code,record(category.code,category.name,'category',''));
  for(const row of category.luckets)create('luckets/'+user.uid+'-'+row.code,record(row.code,row.name,'lucket',row.code+' '+row.name));
 }
 await request(':commit','POST',{writes});
 const saved=(await request(':runQuery','POST',query)).filter(r=>r.document);
 if(saved.length!==56||saved.some(r=>!('nullValue' in r.document.fields.status)||!('nullValue' in r.document.fields.actionStatusDay)))throw Error('Initial data verification failed');
 console.log('Production owner initialized: 7 categories, 49 luckets, blank colors; openDay '+openDay+'.');
}finally{await deleteApp(app)}
