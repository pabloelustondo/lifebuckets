export type Status = 'yellow' | 'red' | 'blue' | 'green' | 'unknown' | null;
export interface Row {
  id: string; itemId: string; category: string; bucket: string; subBucket: string; subSubBucket: string;
  name: string; kind: 'category' | 'lucket'; sortOrder: number;
  status: Status; actionStatus: Status; actionDay: string | null; actionAvailable: boolean;
  description: string;
}
export interface Group { category: Row; children: Row[] }
export interface View { openDay: string | null; groups: Group[]; fixture: boolean }
export function validDay(value: unknown): value is string {
  if(typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value))return false;
  const date=new Date(value+'T12:00:00Z');
  return Number.isFinite(date.valueOf()) && date.toISOString().slice(0,10)===value;
}
export function displayDay(value: string): string {
  if(!validDay(value))throw Error('Invalid business date');
  return new Intl.DateTimeFormat('en',{weekday:'long',month:'short',day:'numeric',timeZone:'UTC'}).format(new Date(value+'T12:00:00Z'));
}
function status(value: unknown): Status {
  if(value == null)return null;
  return ['yellow','red','blue','green'].includes(String(value)) ? value as Status : 'unknown';
}
function text(data: Record<string,unknown>, key: string, optional=false): string {
  const value=data[key];
  if(optional && value == null)return '';
  if(typeof value!=='string' || (!optional && !value.trim()))throw Error('Invalid '+key+' in a stored row');
  return value;
}
export function makeView(uid: string, profile: Record<string,unknown> | undefined,
  records: {id:string; data:Record<string,unknown>}[]): View {
  const day=profile?.openDay;
  if(day!=null && !validDay(day))throw Error('Stored business date is invalid.');
  const openDay=validDay(day)?day:null;
  const rows=records.map(({id,data}):Row=>{
    if(data.ownerId!==uid)throw Error('Owner mismatch');
    const category=text(data,'category'),bucket=text(data,'bucket',true);
    const subBucket=text(data,'subBucket',true),subSubBucket=text(data,'subSubBucket',true);
    if((subBucket && !bucket)||(subSubBucket && !subBucket))throw Error('Hierarchy is missing an intermediate level.');
    if(data.kind!=='category' && data.kind!=='lucket')throw Error('Invalid row kind');
    if(data.kind==='category' && (bucket||subBucket||subSubBucket))throw Error('Category contains a child path');
    if(data.kind==='lucket' && !bucket)throw Error('Lucket has no bucket path');
    if(typeof data.sortOrder!=='number'||!Number.isFinite(data.sortOrder))throw Error('Invalid order');
    if(data.actionDay!=null && !validDay(data.actionDay))throw Error('Invalid action date');
    const actionDay=validDay(data.actionDay)?data.actionDay:null;
    return {id,itemId:text(data,'itemId'),name:text(data,'name'),category,bucket,subBucket,subSubBucket,
      kind:data.kind,sortOrder:data.sortOrder,status:status(data.status),
      actionStatus:actionDay===openDay&&openDay!==null?status(data.actionStatusDay):null,
      actionDay,actionAvailable:openDay!==null&&actionDay===openDay,description:text(data,'description',true)};
  }).sort((a,b)=>a.sortOrder-b.sortOrder || a.itemId.localeCompare(b.itemId));
  if(new Set(rows.map(r=>r.itemId)).size!==rows.length)throw Error('Duplicate row codes');
  const categories=rows.filter(r=>r.kind==='category');
  if(new Set(categories.map(r=>r.category)).size!==categories.length)throw Error('Duplicate category paths');
  const groups=categories.map(category=>({category,children:rows.filter(r=>r.kind==='lucket'&&r.category===category.category)}));
  if(groups.reduce((n,g)=>n+g.children.length,0)!==rows.filter(r=>r.kind==='lucket').length)throw Error('Lucket has no category');
  return {openDay,groups,fixture:profile?.fixture===true};
}
