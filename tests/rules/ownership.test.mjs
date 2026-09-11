import { test, before, after } from 'node:test';
import { readFile } from 'node:fs/promises';
import { initializeTestEnvironment, assertSucceeds, assertFails } from '@firebase/rules-unit-testing';
import { doc, collection, query, where, getDoc, getDocs, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
let env;
before(async()=>{
 if(process.env.FIRESTORE_EMULATOR_HOST!=='127.0.0.1:8080')throw Error('Local emulator required');
 env=await initializeTestEnvironment({projectId:'demo-lifebuckets',firestore:{host:'127.0.0.1',port:8080,rules:await readFile('firestore.rules','utf8')}});
 await env.withSecurityRulesDisabled(async ctx=>{const db=ctx.firestore();await setDoc(doc(db,'users/a'),{openDay:'2026-09-09'});await setDoc(doc(db,'luckets/a'),{ownerId:'a'});await setDoc(doc(db,'luckets/b'),{ownerId:'b'})});
});
after(async()=>env?.cleanup());
test('owner reads its profile and filtered hierarchy',async()=>{const db=env.authenticatedContext('a').firestore();await assertSucceeds(getDoc(doc(db,'users/a')));await assertSucceeds(getDocs(query(collection(db,'luckets'),where('ownerId','==','a'))));await assertFails(getDocs(collection(db,'luckets')))});
test('cross-owner and unauthenticated reads fail',async()=>{for(const ctx of [env.authenticatedContext('b'),env.unauthenticatedContext()]){await assertFails(getDoc(doc(ctx.firestore(),'users/a')));await assertFails(getDoc(doc(ctx.firestore(),'luckets/a')))}});
test('all business-data writes denied even to the owner',async()=>{for(const ctx of [env.authenticatedContext('a'),env.authenticatedContext('b'),env.unauthenticatedContext()]){const db=ctx.firestore();for(const path of ['users/a','luckets/a','unexpected/x']){await assertFails(setDoc(doc(db,path),{ownerId:'a'}));await assertFails(updateDoc(doc(db,path),{status:'green'}));await assertFails(deleteDoc(doc(db,path)))}}});
