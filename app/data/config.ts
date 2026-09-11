import type {FirebaseOptions} from 'firebase/app';
export interface AppConfig {hosted:boolean;signIn:'email'|'google';firebase:FirebaseOptions}
export function readConfig(env:Record<string,unknown>):AppConfig {
 const mode=env.VITE_APP_ENV;
 if(mode!==undefined&&mode!==''&&mode!=='emulator'&&mode!=='production')throw Error('Unknown app environment');
 if(env.MODE==='hosted'&&mode!=='production')throw Error('Hosted builds require production configuration');
 if(mode!=='production')return {hosted:false,signIn:'email',firebase:{projectId:'demo-lifebuckets',apiKey:'demo-key',authDomain:'localhost',appId:'demo-app'}};
 const get=(key:string)=>{const value=env[key];if(typeof value!=='string'||!value.trim())throw Error('Missing '+key);return value};
 const projectId=get('VITE_FIREBASE_PROJECT_ID');
 if(projectId!=='lifebuckets-bd43d')throw Error('Unapproved production project');
 const authDomain=get('VITE_FIREBASE_AUTH_DOMAIN');
 if(!['lifebuckets-bd43d.firebaseapp.com','lifebuckets-bd43d.web.app'].includes(authDomain))throw Error('Unapproved auth domain');
 const method=get('VITE_SIGN_IN_METHOD');if(method!=='email'&&method!=='google')throw Error('Invalid sign-in method');
 return {hosted:true,signIn:method,firebase:{projectId,authDomain,apiKey:get('VITE_FIREBASE_API_KEY'),appId:get('VITE_FIREBASE_APP_ID')}};
}
export const config=readConfig(import.meta.env);
