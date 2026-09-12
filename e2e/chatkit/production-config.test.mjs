import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
const configuration={VITE_APP_ENV:'production',VITE_FIREBASE_PROJECT_ID:'lifebuckets-bd43d',VITE_FIREBASE_API_KEY:'public-test-value',VITE_FIREBASE_APP_ID:'public-test-value',VITE_FIREBASE_AUTH_DOMAIN:'lifebuckets-bd43d.firebaseapp.com',VITE_SIGN_IN_METHOD:'google',VITE_CHATKIT_DOMAIN_KEY:'domain_pk_test_syntax_only'};
function check(overrides){return spawnSync(process.execPath,['scripts/check-production.mjs'],{env:{...process.env,...configuration,...overrides},encoding:'utf8'});}
test('production gate refuses missing or localhost ChatKit domain key',()=>{
 for(const key of ['', 'domain_pk_localhost_dev','invalid'])assert.notEqual(check({VITE_CHATKIT_DOMAIN_KEY:key}).status,0);
});
test('production gate refuses wrong project and API override',()=>{
 assert.notEqual(check({VITE_FIREBASE_PROJECT_ID:'demo-lifebuckets'}).status,0);
 assert.notEqual(check({VITE_CHATKIT_API_URL:'http://127.0.0.1:8001'}).status,0);
});
test('public configuration syntax passes without claiming domain registration',()=>{
 assert.equal(check({}).status,0);
});
