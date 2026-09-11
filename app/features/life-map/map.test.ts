import {it,expect} from 'vitest';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {StatusIndicator} from './LifeMap';
it('labels unrecorded and different-day action distinctly',()=>{
 expect(renderToStaticMarkup(createElement(StatusIndicator,{kind:'Condition',value:null}))).toContain('Condition: not recorded');
 expect(renderToStaticMarkup(createElement(StatusIndicator,{kind:'Action',value:null,available:false}))).toContain('Action: not recorded for this day');
});
