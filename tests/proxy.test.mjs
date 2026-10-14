import {test,afterEach} from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/anfrage.js';
const originalFetch=globalThis.fetch;
afterEach(()=>{globalThis.fetch=originalFetch;delete process.env.TABLESCOUT_FORM_API_KEY;});
function response(){return {code:200,headers:{},setHeader(k,v){this.headers[k]=v},status(n){this.code=n;return this},json(v){this.body=v;return this}};}
test('proxy forwards services and calculator without leaking credentials',async()=>{
 process.env.TABLESCOUT_FORM_API_KEY='test-key';let received;
 globalThis.fetch=async(url,options)=>{received=options;return new Response(JSON.stringify({ok:true}),{status:200})};
 const res=response();await handler({method:'POST',body:{betrieb:'Test',services:['profile','management'],calculator:{positive:20,negative:4,price:1},email:'test@example.com'}},res);
 assert.deepEqual(JSON.parse(received.body).services,['profile','management']);assert.deepEqual(JSON.parse(received.body).calculator,{positive:20,negative:4});assert.equal(received.headers['x-website-funnel-key'],'test-key');assert.equal(res.body.ok,true);assert.ok(!JSON.stringify(res.body).includes('test-key'));
});
test('rejects invalid requests, honeypot does not reach backend',async()=>{
 process.env.TABLESCOUT_FORM_API_KEY='test-key';globalThis.fetch=()=>{throw Error('should not send')};
 for(const body of [null,'bad-json',[]]){const res=response();await handler({method:'POST',body},res);assert.equal(res.code,400);}
 const res=response();await handler({method:'POST',body:{website:'spam'}},res);assert.equal(res.body.ok,true);
 const get=response();await handler({method:'GET'},get);assert.equal(get.code,405);
});
test('backend validation remains actionable, outages are not reported as success',async()=>{
 process.env.TABLESCOUT_FORM_API_KEY='test-key';globalThis.fetch=async()=>new Response(JSON.stringify({ok:false,reason:'invalid_input',fields:['email']}),{status:400});
 const res=response();await handler({method:'POST',body:{email:'wrong'}},res);assert.equal(res.code,400);assert.equal(res.body.ok,false);assert.deepEqual(res.body.fields,['email']);
});
