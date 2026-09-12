import {test,expect} from '@playwright/test';
import {initializeApp,deleteApp} from 'firebase-admin/app';
import {getFirestore} from 'firebase-admin/firestore';
import {getAuth} from 'firebase-admin/auth';
import {mkdir} from 'node:fs/promises';

test('matrix boundaries, semantic states, ordering and responsive alignment',async({page})=>{
 if(process.env.GCLOUD_PROJECT!=='demo-lifebuckets'||process.env.FIRESTORE_EMULATOR_HOST!=='127.0.0.1:8080'||process.env.FIREBASE_AUTH_EMULATOR_HOST!=='127.0.0.1:9099')throw Error('Local emulators required');
 const app=initializeApp({projectId:'demo-lifebuckets'},'matrix');
 try{
  const db=getFirestore(app),uid='matrix';
  await getAuth(app).createUser({uid,email:uid+'@example.test',password:'review-only-123'});
  const batch=db.batch();batch.set(db.doc('users/'+uid),{openDay:'2026-09-09',fixture:true});
  for(const [index,count] of [0,1,10,11].entries()){
   const code=String.fromCharCode(65+index),category=code+' category';
   const base={ownerId:uid,category,subBucket:'',subSubBucket:'',description:'',status:null,actionDay:'2026-09-09',actionStatusDay:null};
   batch.set(db.doc('luckets/matrix-'+code),{...base,itemId:code,name:'Category '+code+' with a long label',kind:'category',bucket:'',sortOrder:index*100});
   for(let n=0;n<count;n++)batch.set(db.doc('luckets/matrix-'+code+n),{...base,itemId:code+n,name:'Item '+n,kind:'lucket',bucket:code+n,sortOrder:index*100+n+1,status:[null,'white','unrecognized','red','blue'][n%5],actionStatusDay:'green',actionDay:n===0?'2026-09-08':'2026-09-09'});
  }
  await batch.commit();
  await page.goto('/');await page.getByLabel('Email',{exact:true}).fill('matrix@example.test');await page.getByLabel('Password',{exact:true}).fill('review-only-123');await page.getByRole('button',{name:'Sign in',exact:true}).click();
  await expect(page.locator('.category-row')).toHaveCount(4);
  for(const [code,count] of [['A',0],['B',1],['C',10],['D',0]] as const)await expect(page.locator('.category-row[data-code="'+code+'"] .matrix-column')).toHaveCount(count);
  await expect(page.locator('.matrix-overflow')).toContainText('More than 10');
  const c=page.locator('.category-row[data-code="C"]');
  expect(await c.locator('.matrix-column').evaluateAll(ns=>ns.map(n=>n.getAttribute('data-lucket')))).toEqual(Array.from({length:10},(_,i)=>'C'+i));
  await expect(c.locator('[data-lucket="C0"] .circle')).toHaveClass(/unset/);
  await expect(c.locator('[data-lucket="C0"] .square')).toHaveClass(/unset/);
  await expect(c.locator('[data-lucket="C1"] .circle')).toHaveClass(/white/);
  await expect(c.locator('[data-lucket="C2"] .circle')).toHaveClass(/unknown/);
  await expect(c).toHaveAccessibleDescription(/C0 Item 0: condition not recorded; action not recorded for this day/);
  await mkdir('docs/09-build-and-test/sprint-003-evidence',{recursive:true});
  for(const width of [320,1440]){
   await page.setViewportSize({width,height:1000});
   const b=await page.locator('.category-row[data-code="B"] .category-matrix').boundingBox(),box=await c.locator('.category-matrix').boundingBox();
   expect(Math.abs(b!.x+b!.width-box!.x-box!.width)).toBeLessThan(1);
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
   const mark=await c.locator('.indicator').first().boundingBox();expect(mark!.width).toBe(11);
   await page.screenshot({path:'docs/09-build-and-test/sprint-003-evidence/boundaries-'+width+'.png',fullPage:true});
  }
  await c.focus();await page.keyboard.press('Enter');await expect(c).toHaveAttribute('aria-expanded','true');await expect(c).toBeFocused();
  await page.locator('.category-row[data-code="D"]').click();await expect(page.locator('.category-group').last().locator('.lucket-row')).toHaveCount(11);
  await expect(page.locator('.count')).toHaveCount(0);
 }finally{await deleteApp(app)}
});
