// Explicit paid check: two short turns only. Never run in the default test suite.
import {chromium,expect} from '@playwright/test';
import {writeFile} from 'node:fs/promises';
const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage({viewport:{width:390,height:844}});
 await page.goto('http://127.0.0.1:4173/');
 await page.getByLabel('Email',{exact:true}).fill('owner@example.test');
 await page.getByLabel('Password',{exact:true}).fill('review-only-123');
 await page.getByRole('button',{name:'Sign in',exact:true}).click();
 await page.getByRole('link',{name:/Assistant/}).click();
 await expect(page.getByText('A conversation with GPT')).toBeVisible();
 const frame=page.frameLocator('iframe[title="LifeBuckets Assistant"]');
 const replies=[];
 await frame.getByRole('button',{name:/Say hello/}).click();
 await expect(frame.getByText('The assistant said:',{exact:true})).toHaveCount(1,{timeout:40000});
 await expect(page.locator('.assistant-status')).toHaveText('',{timeout:40000});
 await expect(page.locator('.assistant-alert')).toHaveCount(0);
 replies.push({text:await frame.locator('body').innerText()});
 const composer=frame.getByRole('textbox');
 await composer.fill('Who was General San Martin, and why is he famous in Argentina? Answer in two sentences.');
 await composer.press('Enter');
 await expect(frame.getByText('The assistant said:',{exact:true})).toHaveCount(2,{timeout:40000});
 await expect(page.locator('.assistant-status')).toHaveText('',{timeout:40000});
 await expect(page.locator('.assistant-alert')).toHaveCount(0);
 replies.push({text:await frame.locator('body').innerText()});
 if(!/Mart[ií]n/.test(replies[1].text)||/simulated/.test(replies.map(r=>r.text).join(' ')))throw Error('Unexpected live reply');
 await expect(page.locator('.assistant-status')).toHaveText('');
 await page.waitForTimeout(1200);
 await page.screenshot({path:'docs/09-engineering/sprint-004/assistant-live-phone.png',fullPage:true});
 await writeFile('docs/09-engineering/sprint-004/live-result.json',JSON.stringify({date:new Date().toISOString(),model:'gpt-4.1-mini',provider:'openai',turns:2,replies},null,2)+'\n');
 console.log('PASS: real GPT greeting and San Martin follow-up via authenticated ChatKit. Two requests only.');
}catch(error){console.error('Live check failed:',error.message);process.exitCode=1}
finally{await browser.close()}
