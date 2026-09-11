import {describe,it,expect} from 'vitest';
import {LocalColors,COLOR_PREFIX} from './local-colors';
import {makeView} from './model';
const category={ownerId:'a',itemId:'C',category:'C',bucket:'',name:'Work',kind:'category',sortOrder:0};
const view=()=>makeView('a',{openDay:'2026-09-09'},[{id:'category',data:category},{id:'row',data:{...category,itemId:'C1',bucket:'C1',name:'Plan',kind:'lucket',status:'red',actionStatusDay:'green',actionDay:'2026-09-09'}}]);
function storage(){const data=new Map<string,string>();return {data,getItem:(k:string)=>data.get(k)??null,setItem:(k:string,v:string)=>{data.set(k,v)}}}
const edit={rowId:'row',field:'status' as const,color:'white' as const,openDay:'2026-09-09'};
describe('local color persistence',()=>{
 it('preserves independent fields, original base and current revision across coalesced edits',()=>{
  const s=new LocalColors('a');s.edit(edit,view());s.edit({...edit,color:'blue'},s.project(view()));
  expect(s.pending()).toHaveLength(1);expect(s.pending()[0]).toMatchObject({baseValue:'red',value:'blue',revision:2});
  expect(s.project(view()).groups[0].children[0]).toMatchObject({status:'blue',actionStatus:'green'});
 });
 it('survives new instances only in persistent mode and overlays refreshed server values',()=>{
  const disk=storage(),s=new LocalColors('a',disk);s.edit(edit,view());
  expect(new LocalColors('a',disk).project(view()).groups[0].children[0].status).toBe('white');
  expect(new LocalColors('a').pending()).toEqual([]);expect(new LocalColors('b',disk).pending()).toEqual([]);
 });
 it('keeps edits for distinct business days without carrying an action to another day',()=>{
  const s=new LocalColors('a'),v=view();s.edit({...edit,field:'actionStatusDay',color:'blue'},v);
  const tomorrow={...v,openDay:'2026-09-10'};
  expect(s.project(tomorrow).groups[0].children[0].actionStatus).toBe('green');
  s.edit({...edit,field:'actionStatusDay',color:'yellow',openDay:tomorrow.openDay},tomorrow);
  expect(s.pending()).toHaveLength(2);expect(s.project(v).groups[0].children[0].actionStatus).toBe('blue');
  expect(()=>s.edit({...edit,field:'actionStatusDay',openDay:null},v)).toThrow();
 });
 it('does not lose the last saved choice if storage fails',()=>{
  const disk=storage(),s=new LocalColors('a',disk);s.edit(edit,view());
  disk.setItem=()=>{throw Error('quota')};expect(()=>s.edit({...edit,color:'blue'},view())).toThrow('quota');
  expect(s.project(view()).groups[0].children[0].status).toBe('white');
 });
 it('rejects corrupt records and wrong owners without replacing storage',()=>{
  const disk=storage();disk.data.set(COLOR_PREFIX+'a','broken');
  expect(()=>new LocalColors('a',disk).edit(edit,view())).toThrow();expect(disk.getItem(COLOR_PREFIX+'a')).toBe('broken');
  disk.data.clear();new LocalColors('a',disk).edit(edit,view());disk.data.set(COLOR_PREFIX+'b',disk.getItem(COLOR_PREFIX+'a')!);
  expect(()=>new LocalColors('b',disk).load()).toThrow();
 });
 it('reloads shared storage before each write so distinct tab edits survive',()=>{
  const disk=storage(),a=new LocalColors('a',disk),b=new LocalColors('a',disk);
  a.edit(edit,view());b.edit({...edit,field:'actionStatusDay',color:'yellow'},view());
  expect(a.pending()).toHaveLength(2);expect(a.project(view()).groups[0].children[0]).toMatchObject({status:'white',actionStatus:'yellow'});
 });
 it('accepts white distinctly from null and retains unsupported values as unknown',()=>{
  expect(view().groups[0].children[0].status).toBe('red');
  const v=makeView('a',{},[{id:'c',data:category},{id:'r',data:{...category,kind:'lucket',bucket:'C1',itemId:'C1',status:'white'}}]);
  expect(v.groups[0].children[0]).toMatchObject({status:'white',actionStatus:null});
 });
});
