import {test,expect} from '@playwright/test';

test('Assistant real ChatKit greeting, follow-up, new chat and map preservation',async({page,request})=>{
 const health=await request.get('/api/chatkit/health');
 test.skip(!health.ok(),'Start npm run chat:server for the ChatKit integration check');
 expect((await health.json()).provider).toBe('simulated');
 await page.goto('/');
 await page.getByLabel('Email',{exact:true}).fill('owner@example.test');
 await page.getByLabel('Password',{exact:true}).fill('review-only-123');
 await page.getByLabel('Remember data').check();
 await page.getByRole('button',{name:'Sign in',exact:true}).click();
 await expect(page.getByRole('button',{name:'Life',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Life',exact:true}).click();
 const row=page.locator('[data-code="A1"]');
 await row.getByRole('button',{name:/Edit condition/}).click();
 await page.getByRole('button',{name:/^Blue/}).click();
 await page.getByRole('link',{name:/Assistant/}).click();
 await expect(page.getByText('Local test · simulated replies')).toBeVisible();
 const frame=page.frameLocator('iframe[title="LifeBuckets Assistant"]');
 await expect(frame.getByText('A little space to talk.')).toBeVisible({timeout:30000});
 await page.setViewportSize({width:390,height:844});
 await page.screenshot({path:'docs/09-engineering/sprint-004/assistant-phone-welcome.png',fullPage:true});
 await frame.getByRole('button',{name:/Say hello/}).click();
 await expect(frame.getByText(/This is a simulated reply/)).toBeVisible({timeout:20000});
 await expect(page.locator('.assistant-status')).toHaveText('');
 const composer=frame.getByRole('textbox');
 await composer.fill('How are you?');
 await composer.press('Enter');
 await expect(frame.getByText(/simulated follow-up/)).toBeVisible({timeout:20000});
 await expect(page.locator('.assistant-status')).toHaveText('');
 // The CDN widget animates message entry after its response.end event.
 await page.waitForTimeout(1200);
 await page.screenshot({path:'docs/09-engineering/sprint-004/assistant-phone-chat.png',fullPage:true});
 for(const width of [320,1440]){
  await page.setViewportSize({width,height:900});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
 await page.screenshot({path:'docs/09-engineering/sprint-004/assistant-desktop-chat.png',fullPage:true});
 await composer.fill('Draft survives offline');
 await page.context().setOffline(true);
 await expect(page.getByText(/You’re offline/)).toBeVisible();
 await page.context().setOffline(false);
 await expect(composer).toHaveText('Draft survives offline');
 await page.getByRole('button',{name:/New chat/}).click();
 await expect(frame.getByText('A little space to talk.')).toBeVisible();
 await page.reload();
 await expect(frame.getByText('A little space to talk.')).toBeVisible();
 await page.getByRole('link',{name:'← Life map'}).click();
 await page.getByRole('button',{name:'Life',exact:true}).click();
 await expect(row.getByRole('img',{name:/Condition: blue/})).toBeVisible();
 await expect(page.getByText(/1 local color change/)).toBeVisible();
});
