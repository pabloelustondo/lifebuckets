import {test,expect,chromium,type Page} from '@playwright/test';
import {mkdir,readFile} from 'node:fs/promises';

async function login(page:Page,owner='owner',trusted=false){
 await page.goto('/');
 await page.getByLabel('Email',{exact:true}).fill(owner+'@example.test');
 await page.getByLabel('Password',{exact:true}).fill('review-only-123');
 if(trusted)await page.getByLabel('Remember data').check();
 await page.getByRole('button',{name:'Sign in',exact:true}).click();
}
async function ready(page:Page){
 await expect(page.getByRole('button',{name:'Work',exact:true})).toBeVisible();
 await expect(page.getByText('Server data received',{exact:true})).toBeVisible();
}
async function shell(page:Page){
 await page.evaluate(async()=>{await navigator.serviceWorker.ready});
 await expect.poll(()=>page.evaluate(()=>!!navigator.serviceWorker.controller)).toBe(true);
}
async function signout(page:Page){
 await page.getByRole('button',{name:'Account',exact:true}).click();
 await page.getByRole('button',{name:'Sign out and clear this device'}).click();
 await expect(page.getByRole('button',{name:'Sign in',exact:true})).toBeVisible();
}
test('map layout, exact taxonomy, keyboard and independent categories',async({page})=>{
 await login(page,'colors');await ready(page);
 await mkdir('docs/09-build-and-test/sprint-002-evidence',{recursive:true});
 await page.setViewportSize({width:420,height:920});
 await page.screenshot({path:'docs/09-build-and-test/sprint-002-evidence/collapsed-420.png',fullPage:true});
 await page.getByRole('button',{name:'Work',exact:true}).focus();
 await page.keyboard.press('Enter');
 await page.getByRole('button',{name:'Life',exact:true}).click();
 await expect(page.getByRole('button',{name:'Work',exact:true})).toHaveAttribute('aria-expanded','true');
 await expect(page.getByRole('button',{name:'Life',exact:true})).toHaveAttribute('aria-expanded','true');
 await expect(page.locator('.category-row')).toHaveCount(7);
 await expect(page.locator('.lucket-row')).toHaveCount(49);
 const taxonomy=JSON.parse(await readFile('docs/08-specifications-as-code/taxonomy.json','utf8'));
 expect(await page.locator('.lucket-row .row-name').allTextContents()).toEqual(taxonomy.categories.flatMap((c:any)=>c.luckets.map((r:any)=>r.name)));
 expect(await page.locator('.lucket-row .row-code').allTextContents()).toEqual(taxonomy.categories.flatMap((c:any)=>c.luckets.map((r:any)=>r.code)));
 expect(await page.locator('.category-row').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('aria-label')))).toEqual(taxonomy.categories.map((c:any)=>c.name));
 await expect(page.locator('time')).toHaveAttribute('datetime','2026-09-09');
 const row=page.locator('[data-code="C1"]');
 await expect(row.getByRole('img',{name:/Condition:/})).toBeVisible();
 await expect(row.getByRole('img',{name:/Action:/})).toBeVisible();
 for(const width of [320,1440]){
  await page.setViewportSize({width,height:1000});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await expect(page.locator('[data-code="C8"]')).toBeVisible();
  await page.screenshot({path:'docs/09-build-and-test/sprint-002-evidence/expanded-'+width+'.png',fullPage:true});
 }
 await page.getByRole('button',{name:'Work',exact:true}).click();
 await expect(page.getByRole('button',{name:'Life',exact:true})).toHaveAttribute('aria-expanded','true');
 expect(await page.locator('.compact-header').innerText()).not.toMatch(/Open day|Sample|Status|Sign out/);
});
for(const [owner,message] of [['empty','Your life map has no rows yet.'],['missing','No open day has been set.'],['malformed','Hierarchy is missing an intermediate level.']]){
 test('explicit '+owner+' state',async({page})=>{
  await login(page,owner);
  await expect(page.getByText(message,{exact:owner!=='missing'})).toBeVisible();
 });
}
test('mismatched action date and null condition labels',async({page})=>{
 await login(page,'mismatch');await ready(page);
 await page.getByRole('button',{name:'Work',exact:true}).click();
 const row=page.locator('[data-code="C1"]');
 await expect(row.getByRole('img',{name:'Action: not recorded for this day',exact:true})).toBeVisible();
 await expect(row.getByRole('img',{name:'Condition: not recorded',exact:true})).toBeVisible();
});
test('session-only sign-in does not survive reload',async({page})=>{
 await login(page);await ready(page);await shell(page);
 await page.reload();await expect(page.getByRole('button',{name:'Sign in',exact:true})).toBeVisible();
});
test('trusted profile survives a real browser restart offline',async({},info)=>{
 const profile=info.outputPath('profile');
 let context=await chromium.launchPersistentContext(profile,{headless:true,baseURL:'http://127.0.0.1:4173'});
 try{
  const page=await context.newPage();await login(page,'owner',true);await ready(page);await shell(page);
  await context.close();
  context=await chromium.launchPersistentContext(profile,{headless:true,baseURL:'http://127.0.0.1:4173',offline:true,timezoneId:'Pacific/Kiritimati'});
  const resumed=await context.newPage();await resumed.goto('/');
  await expect(resumed.getByRole('button',{name:'Work',exact:true})).toBeVisible();
  await expect(resumed.locator('time')).toHaveAttribute('datetime','2026-09-09');
  await expect(resumed.getByText('Offline · previously loaded data',{exact:true})).toBeVisible();
  await resumed.getByRole('button',{name:'Work',exact:true}).click();
  await resumed.screenshot({path:'docs/09-build-and-test/sprint-002-evidence/offline-restart.png',fullPage:true});
  await resumed.clock.setFixedTime(new Date('2026-09-20T12:00:00Z'));await resumed.reload();
  await expect(resumed.locator('time')).toHaveAttribute('datetime','2026-09-09');
  await context.setOffline(false);
  await expect(resumed.getByText('Server data received',{exact:true})).toBeVisible();
  await signout(resumed);
  await context.setOffline(true);await resumed.reload();
  await expect(resumed.getByRole('button',{name:'Sign in',exact:true})).toBeVisible();
  await expect(resumed.locator('.lucket-row')).toHaveCount(0);
 }finally{await context.close()}
});
test('sign-out clears all tabs and allows a different owner',async({context,page})=>{
 await login(page,'owner',true);await ready(page);
 const second=await context.newPage();await second.goto('/');await ready(second);
 await signout(page);
 await expect(second.locator('.category-row')).toHaveCount(0);
 await login(page,'other',true);await ready(page);
 await expect(page.locator('time')).toHaveAttribute('datetime','2026-09-09');
});
test('evicted data is unavailable rather than invented',async({},info)=>{
 const profile=info.outputPath('evicted');
 let context=await chromium.launchPersistentContext(profile,{headless:true,baseURL:'http://127.0.0.1:4173'});
 try{
  const page=await context.newPage();await login(page,'owner',true);await ready(page);await shell(page);await context.close();
  context=await chromium.launchPersistentContext(profile,{headless:true,baseURL:'http://127.0.0.1:4173'});
  const blank=await context.newPage();
  const cdp=await context.newCDPSession(blank);
  await cdp.send('Storage.clearDataForOrigin',{origin:'http://127.0.0.1:4173',storageTypes:'indexeddb'});
  await context.setOffline(true);await blank.goto('/');
  await expect(blank.getByText('Account data is not available offline. Reconnect to load it.')).toBeVisible();
  await expect(blank.locator('.lucket-row')).toHaveCount(0);
 }finally{await context.close()}
});
test('unsupported persistence gives an actionable error',async({page})=>{
 await page.addInitScript(()=>Object.defineProperty(window,'indexedDB',{get(){throw new Error('Storage unavailable')}}));
 await login(page,'owner',true);
 await expect(page.getByRole('alert')).toContainText('Persistence is unavailable');
});
test('blocked storage cleanup locks switching until the blocker closes',async({context,page})=>{
 await login(page,'owner',true);await ready(page);
 const holder=await context.newPage();await holder.goto('/');await ready(holder);
 await holder.evaluate(async()=>{
  const databases=await indexedDB.databases();
  const name=databases.find(d=>d.name?.includes('firestore'))?.name;
  if(!name)throw Error('No Firestore database to hold');
  await new Promise<void>((resolve,reject)=>{const request=indexedDB.open(name);request.onerror=()=>reject(request.error);request.onsuccess=()=>{(window as any).heldDatabase=request.result;request.result.onversionchange=()=>{};resolve()}});
 });
 await page.getByRole('button',{name:'Account',exact:true}).click();
 await page.getByRole('button',{name:'Sign out and clear this device'}).click();
 await expect(page.getByText('Cleanup is blocked.',{exact:false})).toBeVisible({timeout:10000});
 await expect(page.locator('.category-row')).toHaveCount(0);
 await expect(page.getByRole('button',{name:'Sign in',exact:true})).toHaveCount(0);
 await holder.close();
 await page.getByRole('button',{name:'Retry device cleanup'}).click();
 await expect(page.getByRole('button',{name:'Sign in',exact:true})).toBeVisible();
});
