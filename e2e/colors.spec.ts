import {test,expect,chromium,type Page} from '@playwright/test';
import {mkdir} from 'node:fs/promises';
const prefix='lifebuckets.local-colors.v1.';
async function login(page:Page,trusted=true,owner='owner'){
 await page.goto('/');await page.getByLabel('Email',{exact:true}).fill(owner+'@example.test');
 await page.getByLabel('Password',{exact:true}).fill('review-only-123');
 if(trusted)await page.getByLabel('Remember data').check();
 await page.getByRole('button',{name:'Sign in',exact:true}).click();await ready(page);
}
async function ready(page:Page){await expect(page.getByRole('button',{name:'Work',exact:true})).toBeVisible()}
async function expand(page:Page){await page.getByRole('button',{name:'Work',exact:true}).click()}
function row(page:Page){return page.locator('[data-code="C1"]')}
async function pick(page:Page,kind:string,color:string){
 await row(page).getByRole('button',{name:new RegExp('Edit '+kind)}).click();
 await page.getByRole('dialog').getByRole('button',{name:color,exact:true}).click();
 await expect(page.getByRole('dialog')).toHaveCount(0);
}
async function pending(page:Page){return page.evaluate(p=>JSON.parse(localStorage.getItem(p+'owner')||'{"pending":[]}').pending,prefix)}
test('five colors, independent saves, current choice, cancel, and narrow-screen palette',async({page})=>{
 const writes:string[]=[];page.on('request',r=>{if(/firestore.*(?:Write|Commit)|\/documents:commit/i.test(r.url()))writes.push(r.url())});
 await login(page);await expand(page);await page.setViewportSize({width:320,height:700});
 await pick(page,'condition','White');await pick(page,'action','Blue');
 await expect(row(page).getByRole('img',{name:'Condition: white',exact:true})).toBeVisible();
 await expect(row(page).getByRole('img',{name:'Action: blue',exact:true})).toBeVisible();
 expect(await pending(page)).toEqual(expect.arrayContaining([expect.objectContaining({field:'status',value:'white',actionDay:null}),expect.objectContaining({field:'actionStatusDay',value:'blue',actionDay:'2026-09-09'})]));
 const trigger=row(page).getByRole('button',{name:/Edit condition/});await trigger.focus();await page.keyboard.press('Enter');
 const palette=page.getByRole('dialog');
 expect(await palette.locator('.color-choices button').allTextContents()).toEqual(['Blue','Green','White✓','Yellow','Red']);
 await expect(palette.getByRole('button',{name:'White',exact:true})).toHaveAttribute('aria-pressed','true');
 await expect(palette.getByRole('button',{name:'White',exact:true})).toBeFocused();
 const bounds=await palette.boundingBox();expect(bounds!.x).toBeGreaterThanOrEqual(0);expect(bounds!.x+bounds!.width).toBeLessThanOrEqual(320);
 await mkdir('docs/09-build-and-test/sprint-003-evidence',{recursive:true});
 await page.screenshot({path:'docs/09-build-and-test/sprint-003-evidence/palette-320.png',fullPage:true});
 await page.keyboard.press('Escape');await expect(trigger).toBeFocused();
 await trigger.click();await page.mouse.click(2,2);await expect(palette).toHaveCount(0);
 await trigger.click();await palette.getByRole('button',{name:'Green',exact:true}).focus();await page.keyboard.press('Enter');
 await expect(row(page).getByRole('img',{name:'Condition: green',exact:true})).toBeVisible();expect(writes).toEqual([]);
});
test('persistent edits survive real browser restart offline and server refresh',async({},info)=>{
 let context=await chromium.launchPersistentContext(info.outputPath('colors-profile'),{headless:true,baseURL:'http://127.0.0.1:4173'});
 try{
  let page=await context.newPage();await login(page);await expand(page);await pick(page,'condition','Red');await pick(page,'action','Green');
  await page.evaluate(async()=>{await navigator.serviceWorker.ready});await expect.poll(()=>page.evaluate(()=>!!navigator.serviceWorker.controller)).toBe(true);
  await context.close();context=await chromium.launchPersistentContext(info.outputPath('colors-profile'),{headless:true,baseURL:'http://127.0.0.1:4173',offline:true});
  page=await context.newPage();await page.goto('/');await ready(page);await expand(page);
  await expect(row(page).getByRole('img',{name:'Condition: red',exact:true})).toBeVisible();await expect(row(page).getByRole('img',{name:'Action: green',exact:true})).toBeVisible();
  await expect(page.locator('[data-lucket="C1"] .circle')).toHaveClass(/red/);
  await expect(page.locator('[data-lucket="C1"] .square')).toHaveClass(/green/);
  await expect(page.locator('time')).toHaveAttribute('datetime','2026-09-09');
  await pick(page,'action','Yellow');await expect(page.locator('[data-lucket="C1"] .square')).toHaveClass(/yellow/);await context.setOffline(false);await expect(page.getByText('Server data received',{exact:true})).toBeVisible();
  await expect(row(page).getByRole('img',{name:'Action: yellow',exact:true})).toBeVisible();
  await page.reload();await ready(page);await expand(page);await expect(row(page).getByRole('img',{name:'Action: yellow',exact:true})).toBeVisible();
 }finally{await context.close()}
});
test('concurrent tabs retain both fields and cleanup clears every tab',async({page,context})=>{
 await login(page);await expand(page);const second=await context.newPage();await second.goto('/');await ready(second);await expand(second);
 await Promise.all([pick(page,'condition','Red'),pick(second,'action','Blue')]);
 await expect(row(page).getByRole('img',{name:'Action: blue',exact:true})).toBeVisible();await expect(row(second).getByRole('img',{name:'Condition: red',exact:true})).toBeVisible();
 expect(await pending(page)).toHaveLength(2);
 await page.getByRole('button',{name:'Account',exact:true}).click();
 page.once('dialog',d=>d.dismiss());await page.getByRole('button',{name:'Sign out and clear this device'}).click();await ready(page);
 page.once('dialog',d=>d.accept());await page.getByRole('button',{name:'Sign out and clear this device'}).click();
 await expect(page.getByRole('button',{name:'Sign in',exact:true})).toBeVisible();await expect(second.locator('.lucket-row')).toHaveCount(0);
 expect(await pending(page)).toEqual([]);
 await login(page,true,'other');await expand(page);await expect(row(page).getByRole('img',{name:'Condition: not recorded',exact:true})).toBeVisible();
});
test('session-only edits never persist and disappear on reload',async({page})=>{
 await login(page,false);await expand(page);await pick(page,'condition','Blue');
 expect(await pending(page)).toEqual([]);await expect(page.getByText('1 local color change · not sent to server')).toBeVisible();
 await page.reload();await login(page,false);await expand(page);await expect(row(page).getByRole('img',{name:'Condition: not recorded',exact:true})).toBeVisible();
});
test('quota failure leaves previous save intact and keeps the palette open',async({page})=>{
 await login(page);await expand(page);await pick(page,'condition','Green');
 await page.evaluate(p=>{const original=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k.startsWith(p))throw new DOMException('Quota','QuotaExceededError');original.call(this,k,v)}},prefix);
 await row(page).getByRole('button',{name:/Edit condition/}).click();await page.getByRole('dialog').getByRole('button',{name:'Red',exact:true}).click();
 await expect(page.getByRole('alert')).toContainText('Could not save');expect((await pending(page))[0].value).toBe('green');
 await page.getByRole('button',{name:'Cancel',exact:true}).click();await expect(row(page).getByRole('img',{name:'Condition: green',exact:true})).toBeVisible();
});
test('missing open day disables only action editing',async({page})=>{
 await login(page,true,'missing');await expand(page);
 await expect(row(page).getByRole('button',{name:/Edit action/})).toBeDisabled();await pick(page,'condition','Yellow');
 await expect(row(page).getByRole('img',{name:'Condition: yellow',exact:true})).toBeVisible();
});
test('corrupt storage remains intact and disables editing without hiding server rows',async({page})=>{
 await login(page);await page.evaluate(p=>localStorage.setItem(p+'owner','broken'),prefix);await page.reload();await ready(page);await expand(page);
 await expect(page.getByRole('alert')).toContainText('Local changes could not be read');await expect(row(page).getByRole('button',{name:/Edit condition/})).toBeDisabled();
 expect(await page.evaluate(p=>localStorage.getItem(p+'owner'),prefix)).toBe('broken');
});
