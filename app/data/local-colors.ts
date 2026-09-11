import {colors, validDay, type Color, type Status, type View} from './model';

export type ColorField = 'status' | 'actionStatusDay';
export interface ColorEdit {rowId:string; field:ColorField; color:Color; openDay:string|null}
export interface PendingColor {
 mutationId:string; ownerId:string; rowId:string; field:ColorField; value:Color;
 baseValue:Status; actionDay:string|null; editedAt:string; revision:number;
}
interface Store {version:1; revision:number; pending:PendingColor[]}
export const COLOR_PREFIX='lifebuckets.local-colors.v1.';
const empty=():Store=>({version:1,revision:0,pending:[]});
const isColor=(v:unknown):v is Color=>colors.includes(v as Color);
function decode(raw:string|null,owner:string):Store {
 if(raw===null)return empty();
 const s=JSON.parse(raw) as Store;
 if(!s||s.version!==1||!Number.isSafeInteger(s.revision)||s.revision<0||!Array.isArray(s.pending))throw Error('Invalid local color storage');
 const keys=new Set<string>();
 for(const p of s.pending){
  if(!p||p.ownerId!==owner||typeof p.rowId!=='string'||!p.rowId||typeof p.mutationId!=='string'||!p.mutationId||
   !['status','actionStatusDay'].includes(p.field)||!isColor(p.value)||
   !(p.baseValue===null||p.baseValue==='unknown'||isColor(p.baseValue))||
   (p.field==='status'?p.actionDay!==null:!validDay(p.actionDay))||
   !Number.isSafeInteger(p.revision)||p.revision<1||p.revision>s.revision||
   typeof p.editedAt!=='string'||!Number.isFinite(Date.parse(p.editedAt)))throw Error('Invalid local color storage');
  const key=JSON.stringify([p.rowId,p.field,p.actionDay]);
  if(keys.has(key))throw Error('Duplicate local color edit');keys.add(key);
 }
 return s;
}
/** Caller holds the session lock during edits and cleanup. A single setItem commits atomically. */
export class LocalColors {
 private memory=empty();
 private key:string;
 constructor(private owner:string,private storage?:Pick<Storage,'getItem'|'setItem'>){this.key=COLOR_PREFIX+encodeURIComponent(owner)}
 load():Store {return this.storage?decode(this.storage.getItem(this.key),this.owner):structuredClone(this.memory)}
 pending():PendingColor[]{return this.load().pending}
 edit(input:ColorEdit,view:View):void {
  const row=view.groups.flatMap(g=>g.children).find(r=>r.id===input.rowId);
  if(!row||!isColor(input.color)||!['status','actionStatusDay'].includes(input.field))throw Error('Invalid color edit');
  const action=input.field==='actionStatusDay';
  if(action&&(!validDay(input.openDay)||input.openDay!==view.openDay))throw Error('The open day changed. Reopen the palette.');
  const day=action?input.openDay:null,s=this.load();
  const prior=s.pending.find(p=>p.rowId===row.id&&p.field===input.field&&p.actionDay===day);
  const revision=s.revision+1;
  if(!Number.isSafeInteger(revision))throw Error('Local revision limit reached');
  const pending:PendingColor={ownerId:this.owner,rowId:row.id,field:input.field,value:input.color,
   baseValue:prior?prior.baseValue:action?row.actionStatus:row.status,actionDay:day,
   mutationId:crypto.randomUUID(),editedAt:new Date().toISOString(),revision};
  const next:Store={version:1,revision,pending:[...s.pending.filter(p=>p!==prior),pending]};
  if(this.storage)this.storage.setItem(this.key,JSON.stringify(next));else this.memory=next;
 }
 project(view:View):View {
  const pending=this.pending();
  return {...view,groups:view.groups.map(g=>({...g,children:g.children.map(row=>{
   const next={...row};
   for(const p of pending){
    if(p.rowId!==row.id)continue;
    if(p.field==='status')next.status=p.value;
    else if(p.actionDay===view.openDay){next.actionStatus=p.value;next.actionDay=p.actionDay;next.actionAvailable=true}
   }
   return next;
  })}))};
 }
 subscribe(notify:()=>void):()=>void {
  if(!this.storage)return()=>{};
  const changed=(event:StorageEvent)=>{if(event.key===this.key||event.key===null)notify()};
  window.addEventListener('storage',changed);return()=>window.removeEventListener('storage',changed);
 }
}
export function clearLocalColors(storage:Storage):void {
 const keys=Array.from({length:storage.length},(_,i)=>storage.key(i)).filter((k):k is string=>!!k&&k.startsWith(COLOR_PREFIX));
 for(const key of keys)storage.removeItem(key);
}
