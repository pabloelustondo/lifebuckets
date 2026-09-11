import {it,expect} from 'vitest';
import {readConfig} from './config';
const production={MODE:'hosted',VITE_APP_ENV:'production',VITE_FIREBASE_PROJECT_ID:'lifebuckets-bd43d',VITE_FIREBASE_AUTH_DOMAIN:'lifebuckets-bd43d.firebaseapp.com',VITE_FIREBASE_API_KEY:'public-test-config',VITE_FIREBASE_APP_ID:'test-app',VITE_SIGN_IN_METHOD:'google'};
it('keeps default tests and local builds on the demo emulator',()=>{expect(readConfig({})).toMatchObject({hosted:false,signIn:'email',firebase:{projectId:'demo-lifebuckets'}})});
it('requires explicit complete configuration for hosted builds',()=>{expect(()=>readConfig({MODE:'hosted'})).toThrow();expect(()=>readConfig({...production,VITE_FIREBASE_API_KEY:''})).toThrow()});
it('rejects another project or auth domain',()=>{expect(()=>readConfig({...production,VITE_FIREBASE_PROJECT_ID:'other'})).toThrow();expect(()=>readConfig({...production,VITE_FIREBASE_AUTH_DOMAIN:'localhost'})).toThrow()});
it('selects the approved production project without emulator mode',()=>{expect(readConfig(production)).toMatchObject({hosted:true,signIn:'google',firebase:{projectId:'lifebuckets-bd43d'}})});
