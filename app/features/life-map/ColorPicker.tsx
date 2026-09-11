import {useEffect,useId,useRef,useState} from 'react';
import {colors,type Status} from '../../data/model';
import type {ColorEdit,ColorField} from '../../data/local-colors';

export default function ColorPicker({rowId,name,kind,value,available=true,openDay,disabled,onEdit}: {
 rowId:string;name:string;kind:'Condition'|'Action';value:Status;available?:boolean;openDay:string|null;
 disabled?:boolean;onEdit:(edit:ColorEdit)=>Promise<void>;
}){
 const dialog=useRef<HTMLDialogElement>(null),trigger=useRef<HTMLButtonElement>(null);
 const [open,setOpen]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState('');
 const id=useId();
 const meaning=!available?'not recorded for this day':value===null?'not recorded':value==='unknown'?'unknown value':value;
 const label=kind+': '+meaning;
 useEffect(()=>{
  if(!open)return;
  const node=dialog.current!,anchor=trigger.current!.getBoundingClientRect();
  const position=()=>{
   node.style.left=Math.max(12,Math.min(anchor.left,window.innerWidth-292))+'px';
   node.style.top=Math.max(12,Math.min(anchor.bottom+10,window.innerHeight-node.offsetHeight-12))+'px';
  };
  node.showModal();position();node.querySelector<HTMLButtonElement>('[aria-pressed="true"]')?.focus();
  window.addEventListener('resize',position);
  return()=>{window.removeEventListener('resize',position);node.close()};
 },[open]);
 function close(){if(busy)return;dialog.current?.close();setOpen(false);trigger.current?.focus()}
 async function select(color:typeof colors[number]){
  setBusy(true);setError('');
  const field:ColorField=kind==='Condition'?'status':'actionStatusDay';
  try{await onEdit({rowId,field,color,openDay});dialog.current?.close();setOpen(false);trigger.current?.focus()}
  catch(e){setError(e instanceof Error?e.message:'Could not save this color locally.')}
  finally{setBusy(false)}
 }
 return <>
  <button ref={trigger} className="color-trigger" disabled={disabled||(kind==='Action'&&!openDay)}
   aria-label={'Edit '+kind.toLowerCase()+' for '+name+': '+meaning} aria-haspopup="dialog" aria-expanded={open}
   title={kind==='Action'&&!openDay?'Set an open day before assigning an action color':label}
   onClick={()=>{setError('');setOpen(true)}}>
   <span role="img" aria-label={label} className={'indicator '+(kind==='Action'?'circle ':'square ')+(value??'unset')}/>
  </button>
  {open&&<dialog ref={dialog} className="color-palette" aria-labelledby={id} aria-busy={busy}
   onCancel={e=>{e.preventDefault();close()}}
   onClick={e=>{if(e.target===e.currentTarget){const r=e.currentTarget.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)close()}}}>
   <h2 id={id}>{kind} · {name}</h2>
   <div className="color-choices" role="group" aria-label="Choose a color">
    {colors.map(color=><button key={color} type="button" disabled={busy} aria-pressed={value===color}
     onClick={()=>void select(color)}><span aria-hidden="true" className={'swatch '+color+(kind==='Action'?' circle':'')}/>
     <span>{color[0].toUpperCase()+color.slice(1)}</span><span aria-hidden="true">{value===color?'✓':''}</span></button>)}
   </div>
   <p className="palette-note" role="status">{busy?'Saving locally…':'Saved locally · server sync is not connected'}</p>
   {error&&<p className="palette-error" role="alert">{error}</p>}
   <button className="palette-cancel" disabled={busy} onClick={close}>Cancel</button>
  </dialog>}
 </>;
}
