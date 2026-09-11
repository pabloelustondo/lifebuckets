import {spawn} from 'node:child_process';
import {seed,assertLocal} from '../scripts/fixtures/seed.mjs';
const mode=process.argv[2];assertLocal();
const children=new Set();
async function run(args){return new Promise((resolve,reject)=>{const p=spawn(process.execPath,args,{stdio:'inherit'});children.add(p);p.on('exit',c=>{children.delete(p);c===0?resolve():reject(Error('Check failed: '+args.join(' ')))});p.on('error',reject)})}
for(const sig of ['SIGINT','SIGTERM'])process.on(sig,()=>{for(const p of children)p.kill(sig);process.exit(130)});
try{
 if(mode==='rules'){await run(['--test','tests/rules/ownership.test.mjs'])}
 else{
 await seed();
 const server=spawn(process.execPath,['e2e/serve.mjs'],{stdio:'inherit'});children.add(server);
 let ready=false;for(let i=0;i<100;i++){try{ready=(await fetch('http://127.0.0.1:4173')).ok;if(ready)break}catch{}await new Promise(r=>setTimeout(r,100))}
 if(!ready)throw Error('Review server failed to start');
 if(mode==='review'){console.log('Synthetic login: owner@example.test / review-only-123');await new Promise((resolve,reject)=>server.on('exit',()=>reject(Error('Server stopped'))))}
 else await run(['node_modules/@playwright/test/cli.js','test']);
 }
}catch(e){console.error(e);process.exitCode=1}finally{for(const p of children)p.kill()}
