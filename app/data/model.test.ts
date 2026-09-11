import { describe,it,expect } from 'vitest';
import {validDay,displayDay,makeView} from './model';
const base={ownerId:'a',itemId:'C',category:'C — Work',bucket:'',subBucket:'',subSubBucket:'',name:'Work',kind:'category',sortOrder:0};
const child={...base,itemId:'C1',name:'Work-Plan',kind:'lucket',bucket:'C1 Work-Plan',sortOrder:1,status:'red',actionDay:'2026-09-08',actionStatusDay:'green'};
describe('business dates and hierarchy',()=>{
 it('rejects impossible calendar dates',()=>{expect(validDay('2026-02-29')).toBe(false);expect(validDay('2024-02-29')).toBe(true);expect(validDay('2026-9-09')).toBe(false)});
 it('formats without the device timezone',()=>{const previous=process.env.TZ;try{for(const tz of ['Pacific/Honolulu','Pacific/Kiritimati','America/Argentina/Buenos_Aires']){process.env.TZ=tz;expect(displayDay('2026-09-09')).toBe('Wednesday, Sep 9')}}finally{process.env.TZ=previous}});
 it('keeps a stale action out of the open day',()=>{const v=makeView('a',{openDay:'2026-09-09'},[{id:'c1',data:child},{id:'c',data:base}]);expect(v.groups[0].children[0]).toMatchObject({status:'red',actionStatus:null,actionDay:'2026-09-08',actionAvailable:false})});
 it('does not initialize a missing day',()=>expect(makeView('a',{},[]).openDay).toBe(null));
 it('rejects missing levels and missing categories',()=>{expect(()=>makeView('a',{},[{id:'x',data:{...child,subSubBucket:'orphan'}}])).toThrow('intermediate');expect(()=>makeView('a',{},[{id:'x',data:child}])).toThrow('category')});
 it('rejects owner mismatch and malformed date',()=>{expect(()=>makeView('b',{},[{id:'c',data:base}])).toThrow('Owner');expect(()=>makeView('a',{openDay:'yesterday'},[])).toThrow('date')});
});
