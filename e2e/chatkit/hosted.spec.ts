import {test,expect} from '@playwright/test';

test('hosted recovery copy, expired thread and New chat work with real ChatKit UI',async({page,request})=>{
 test.skip(process.env.CHATKIT_HOSTED_CHECK!=='1','Opt in with CHATKIT_HOSTED_CHECK=1 and an isolated simulated backend on port 8002');
 // A separate simulated Python process keeps the user's live GPT process untouched.
 const backend='http://127.0.0.1:8002';
 expect((await (await request.get(backend+'/api/chatkit/health')).json()).provider).toBe('simulated');
 let expire=false;
 await page.route('**/api/chatkit**',async route=>{
  if(expire&&route.request().method()==='POST'){
   expire=false;
   await route.fulfill({status:404,contentType:'application/json',body:JSON.stringify({error:'Conversation expired. Start a new chat.'})});return;
  }
  const response=await route.fetch({url:backend+new URL(route.request().url()).pathname});
  await route.fulfill({response});
 });
 await page.goto('/');
 await page.getByLabel('Email',{exact:true}).fill('owner@example.test');
 await page.getByLabel('Password',{exact:true}).fill('review-only-123');
 await page.getByRole('button',{name:'Sign in',exact:true}).click();
 await page.getByRole('link',{name:/Assistant/}).click();
 const frame=page.frameLocator('iframe[title="LifeBuckets Assistant"]');
 await expect(frame.getByText('A little space to talk.')).toBeVisible({timeout:30000});
 await expect(frame.getByText(/may expire or disappear when the server restarts/)).toBeVisible();
 await frame.getByRole('button',{name:/Say hello/}).click();
 await expect(frame.getByText(/This is a simulated reply/)).toBeVisible({timeout:20000});
 await expect(page.locator('.assistant-status')).toHaveText('');
 expire=true;
 await frame.getByRole('textbox').fill('Continue after restart');
 await frame.getByRole('textbox').press('Enter');
 await expect(page.getByRole('alert')).toContainText('expired');
 await page.getByRole('button',{name:/New chat/}).click();
 await expect(frame.getByText('A little space to talk.')).toBeVisible();
 await expect(page.getByRole('alert')).toHaveCount(0);
 for(const width of [390,1440]){
  await page.setViewportSize({width,height:900});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.screenshot({path:`docs/09-engineering/sprint-004/hosted-recovery-${width}.png`,fullPage:true});
 }
});
