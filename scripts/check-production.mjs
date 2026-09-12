import {loadEnv} from 'vite';
const env={...loadEnv('hosted',process.cwd(),'VITE_'),...process.env};
if(env.VITE_APP_ENV!=='production'||env.VITE_FIREBASE_PROJECT_ID!=='lifebuckets-bd43d')throw Error('Explicit LifeBuckets production configuration is required.');
for(const key of ['VITE_FIREBASE_API_KEY','VITE_FIREBASE_APP_ID','VITE_FIREBASE_AUTH_DOMAIN'])if(!env[key]?.trim())throw Error('Missing '+key);
if(!['lifebuckets-bd43d.firebaseapp.com','lifebuckets-bd43d.web.app'].includes(env.VITE_FIREBASE_AUTH_DOMAIN))throw Error('Unapproved production auth domain');
if(!['email','google'].includes(env.VITE_SIGN_IN_METHOD))throw Error('Select the approved production sign-in method');
const domainKey=env.VITE_CHATKIT_DOMAIN_KEY?.trim();
if(!domainKey||domainKey==='domain_pk_localhost_dev'||!/^domain_pk_[A-Za-z0-9_-]+$/.test(domainKey))throw Error('Register the production ChatKit domain key before building.');
for(const [key,value] of Object.entries(env)){
 if(key.startsWith('VITE_')&&/CHATKIT.*(URL|ENDPOINT)|API.*(URL|ENDPOINT)/.test(key)&&value)throw Error('Hosted chat must use the same-origin /api/chatkit endpoint.');
}
console.log('Production target and ChatKit configuration verified: lifebuckets-bd43d');
