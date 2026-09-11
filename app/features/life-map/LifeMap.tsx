import {useState} from 'react';
import {displayDay,type Row,type Status,type View} from '../../data/model';
import './map.css';
import ColorPicker from './ColorPicker';
import type {ColorEdit} from '../../data/local-colors';

export function StatusIndicator({value,kind,available=true}:{value:Status;kind:'Condition'|'Action';available?:boolean}) {
 const meaning=!available?'not recorded for this day':value===null?'not recorded':value==='unknown'?'unknown value':value+' (illustrative color; meaning pending)';
 return <span role="img" aria-label={kind+': '+meaning} title={kind+': '+meaning}
   className={'indicator '+(kind==='Action'?'circle ':'square ')+(value??'unset')}/>;
}
function LucketRow({row,openDay,onEdit,editingDisabled}:{row:Row;openDay:string|null;onEdit:(edit:ColorEdit)=>Promise<void>;editingDisabled?:boolean}) {
 return <li className="lucket-row" data-code={row.itemId}>
  <span className="row-code">{row.itemId}</span>
  <ColorPicker rowId={row.id} name={row.name} kind="Condition" value={row.status} openDay={openDay} onEdit={onEdit} disabled={editingDisabled}/>
  <ColorPicker rowId={row.id} name={row.name} kind="Action" value={row.actionStatus} available={row.actionAvailable} openDay={openDay} onEdit={onEdit} disabled={editingDisabled}/>
  <div className="row-content"><span className="row-name">{row.name}</span>{row.description&&<p className="row-detail">{row.description}</p>}</div>
 </li>;
}
export default function LifeMap({view,onSignOut,onEdit,editingDisabled}:{view:View;onSignOut:()=>void;onEdit:(edit:ColorEdit)=>Promise<void>;editingDisabled?:boolean}) {
 const [expanded,setExpanded]=useState<Set<string>>(new Set());
 const [menu,setMenu]=useState(false);
 function toggle(id:string){setExpanded(old=>{const next=new Set(old);if(next.has(id))next.delete(id);else next.add(id);return next})}
 return <section className="life-map" aria-label="Life map">
  <header className="compact-header">
   <h1>LifeBuckets</h1>
   <button className="avatar" aria-label="Account" aria-expanded={menu} aria-controls="account-panel" onClick={()=>setMenu(!menu)}>P</button>
   {view.openDay&&<time dateTime={view.openDay}>{displayDay(view.openDay)}</time>}
  </header>
  {menu&&<div className="account-panel" id="account-panel"><button className="plain-button" onClick={onSignOut}>Sign out and clear this device</button></div>}
  {!view.openDay&&<p className="notice">No open day has been set. Account setup is needed; no date has been created automatically.</p>}
  {view.groups.length===0?<p className="notice">Your life map has no rows yet.</p>:<div className="category-list">
   {view.groups.map(({category,children})=>{
    const open=expanded.has(category.id);
    return <section className={'category-group '+(open?'expanded':'')} key={category.id}>
      <button className="category-row" data-code={category.itemId} aria-label={category.name} aria-expanded={open} aria-controls={'rows-'+category.id} onClick={()=>toggle(category.id)}>
       <span>{category.itemId}</span><span>{category.name}</span><span className="count">{children.length}</span><span aria-hidden="true">{open?'⌄':'›'}</span>
      </button>
      <ul id={'rows-'+category.id} hidden={!open}>{children.map(row=><LucketRow key={row.id} row={row} openDay={view.openDay} onEdit={onEdit} editingDisabled={editingDisabled}/>)}</ul>
    </section>
   })}
  </div>}
 </section>;
}
