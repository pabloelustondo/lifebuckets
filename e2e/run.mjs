import {spawn} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import {createServer} from 'node:net';
const mode=process.argv[2]||'browser';
if(!['browser','rules','review'].includes(mode))throw Error('Unknown gate mode');
const config=JSON.parse(await readFile('firebase.json','utf8'));
for(const [service,port] of [['auth',9099],['firestore',8080]])if(config.emulators[service]?.host!=='127.0.0.1'||config.emulators[service]?.port!==port)throw Error('Exact local emulator configuration required');
if(process.env.GCLOUD_PROJECT && process.env.GCLOUD_PROJECT!=='demo-lifebuckets')throw Error('Live project refused');
const env={...process.env,GCLOUD_PROJECT:'demo-lifebuckets',CI:'true',FIREBASE_CLI_DISABLE_UPDATE_CHECK:'true',PLAYWRIGHT_BROWSERS_PATH:'.cache/browsers'};
delete env.GOOGLE_APPLICATION_CREDENTIALS;delete env.FIREBASE_TOKEN;
const children=new Set();
async function run(cmd,args){return new Promise((resolve,reject)=>{const p=spawn(cmd,args,{stdio:'inherit',env});children.add(p);p.on('exit',c=>{children.delete(p);c===0?resolve():reject(Error(cmd+' exited '+c))});p.on('error',reject)})}
for(const sig of ['SIGINT','SIGTERM'])process.on(sig,()=>{for(const p of children)p.kill(sig);process.exit(130)});
async function free(port){await new Promise((resolve,reject)=>{const s=createServer();s.once('error',()=>reject(Error('Port '+port+' is in use; refusing to reuse unknown services.')));s.listen(port,'127.0.0.1',()=>s.close(resolve))})}
try{
 for(const port of [8080,9099,4173])await free(port);
 if(mode!=='rules')await run('npm',['run','build']);
 await run(process.execPath,['node_modules/firebase-tools/lib/bin/firebase.js','emulators:exec','--only','auth,firestore','--project','demo-lifebuckets','node e2e/inside.mjs '+mode]);
}catch(e){console.error(e);process.exitCode=1}finally{for(const p of children)p.kill()}
