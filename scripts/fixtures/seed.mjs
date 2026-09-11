import { readFile } from 'node:fs/promises';
import { initializeApp, deleteApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

export function assertLocal(env=process.env) {
  if(env.GCLOUD_PROJECT !== 'demo-lifebuckets' ||
     env.FIRESTORE_EMULATOR_HOST !== '127.0.0.1:8080' ||
     env.FIREBASE_AUTH_EMULATOR_HOST !== '127.0.0.1:9099') {
    throw Error('Fixture provisioning requires demo-lifebuckets and exact loopback emulators.');
  }
}
export async function seed() {
  assertLocal();
  const app=initializeApp({projectId:'demo-lifebuckets'},'fixtures');
  const db=getFirestore(app), auth=getAuth(app);
  const taxonomy=JSON.parse(await readFile('docs/08-specifications-as-code/taxonomy.json','utf8'));
  const cases=['owner','other','empty','missing','malformed','mismatch','colors'];
  try {
    for(const uid of cases) {
      try {await auth.getUser(uid)} catch {await auth.createUser({uid,email:uid+'@example.test',password:'review-only-123'})}
      const old=await db.collection('luckets').where('ownerId','==',uid).get();
      const batch=db.batch();
      old.docs.forEach(doc=>batch.delete(doc.ref));
      batch.set(db.doc('users/'+uid),uid==='missing'?{fixture:true}:{openDay:'2026-09-09',fixture:true});
      if(uid!=='empty') {
        let order=0;
        for(const category of taxonomy.categories) {
          const path=category.code+' — '+category.name;
          const make=(code,name,kind,bucket)=>({
            ownerId:uid,itemId:code,category:path,bucket,subBucket:'',subSubBucket:'',
            name,kind,sortOrder:order++,status:null,actionDay:'2026-09-09',actionStatusDay:null,
            description:'',currentFocus:'',schemaVersion:1,updatedAt:new Date('2026-09-09T12:00:00Z')
          });
          batch.set(db.doc('luckets/'+uid+'-'+category.code),make(category.code,category.name,'category',''));
          for(const row of category.luckets) {
            const record=make(row.code,row.name,'lucket',row.code+' '+row.name);
            if(uid==='colors'){record.status=['yellow','red','blue','green'][order%4];record.actionStatusDay=['green','blue','red','yellow'][order%4]}
            if(uid==='mismatch')record.actionDay='2026-09-08';
            if(uid==='malformed' && row.code==='A0')record.subSubBucket='Missing intermediate level';
            if(row.code==='C8')record.description='Sample context: space for a longer reflection, without hiding the code or the two indicators.';
            batch.set(db.doc('luckets/'+uid+'-'+row.code),record);
          }
        }
      }
      await batch.commit();
      const count=(await db.collection('luckets').where('ownerId','==',uid).get()).size;
      if(count!==(uid==='empty'?0:56))throw Error('Fixture count mismatch: '+uid);
    }
    console.log('Fixtures verified: 7 synthetic owners, 56 rows per nonempty owner, explicit 2026-09-09.');
  } finally {await deleteApp(app)}
}
if(process.argv[1]?.endsWith('/seed.mjs'))seed().catch(e=>{console.error(e.message);process.exitCode=1});
