function v(){}function G(t,e){for(const n in e)t[n]=e[n];return t}function L(t){return t()}function D(){return Object.create(null)}function g(t){t.forEach(L)}function P(t){return typeof t=="function"}function at(t,e){return t!=t?e==e:t!==e||t&&typeof t=="object"||typeof t=="function"}function ft(t,e){return t!=t?e==e:t!==e}function J(t){return Object.keys(t).length===0}function W(t,...e){if(t==null)return v;const n=t.subscribe(...e);return n.unsubscribe?()=>n.unsubscribe():n}function dt(t){let e;return W(t,n=>e=n)(),e}function _t(t,e,n){t.$$.on_destroy.push(W(e,n))}function ht(t,e,n,i){if(t){const r=B(t,e,n,i);return t[0](r)}}function B(t,e,n,i){return t[1]&&i?G(n.ctx.slice(),t[1](i(e))):n.ctx}function mt(t,e,n,i){if(t[2]&&i){const r=t[2](i(n));if(e.dirty===void 0)return r;if(typeof r=="object"){const o=[],s=Math.max(e.dirty.length,r.length);for(let l=0;l<s;l+=1)o[l]=e.dirty[l]|r[l];return o}return e.dirty|r}return e.dirty}function pt(t,e,n,i,r,o){if(r){const s=B(e,n,i,o);t.p(s,r)}}function yt(t){if(t.ctx.length>32){const e=[],n=t.ctx.length/32;for(let i=0;i<n;i++)e[i]=-1;return e}return-1}function gt(t,e,n){return t.set(n),e}let E=!1;function K(){E=!0}function Q(){E=!1}function U(t,e,n,i){for(;t<e;){const r=t+(e-t>>1);n(r)<=i?t=r+1:e=r}return t}function V(t){if(t.hydrate_init)return;t.hydrate_init=!0;let e=t.childNodes;if(t.nodeName==="HEAD"){const c=[];for(let u=0;u<e.length;u++){const f=e[u];f.claim_order!==void 0&&c.push(f)}e=c}const n=new Int32Array(e.length+1),i=new Int32Array(e.length);n[0]=-1;let r=0;for(let c=0;c<e.length;c++){const u=e[c].claim_order,f=(r>0&&e[n[r]].claim_order<=u?r+1:U(1,r,b=>e[n[b]].claim_order,u))-1;i[c]=n[f]+1;const a=f+1;n[a]=c,r=Math.max(a,r)}const o=[],s=[];let l=e.length-1;for(let c=n[r]+1;c!=0;c=i[c-1]){for(o.push(e[c-1]);l>=c;l--)s.push(e[l]);l--}for(;l>=0;l--)s.push(e[l]);o.reverse(),s.sort((c,u)=>c.claim_order-u.claim_order);for(let c=0,u=0;c<s.length;c++){for(;u<o.length&&s[c].claim_order>=o[u].claim_order;)u++;const f=u<o.length?o[u]:null;t.insertBefore(s[c],f)}}function X(t,e){t.appendChild(e)}function Y(t,e){if(E){for(V(t),(t.actual_end_child===void 0||t.actual_end_child!==null&&t.actual_end_child.parentNode!==t)&&(t.actual_end_child=t.firstChild);t.actual_end_child!==null&&t.actual_end_child.claim_order===void 0;)t.actual_end_child=t.actual_end_child.nextSibling;e!==t.actual_end_child?(e.claim_order!==void 0||e.parentNode!==t)&&t.insertBefore(e,t.actual_end_child):t.actual_end_child=e.nextSibling}else(e.parentNode!==t||e.nextSibling!==null)&&t.appendChild(e)}function bt(t,e,n){E&&!n?Y(t,e):(e.parentNode!==t||e.nextSibling!=n)&&t.insertBefore(e,n||null)}function H(t){t.parentNode&&t.parentNode.removeChild(t)}function xt(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function O(t){return document.createElement(t)}function T(t){return document.createTextNode(t)}function $t(){return T(" ")}function wt(){return T("")}function M(t,e,n,i){return t.addEventListener(e,n,i),()=>t.removeEventListener(e,n,i)}function vt(t,e,n){n==null?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function Z(t){return Array.from(t.childNodes)}function tt(t){t.claim_info===void 0&&(t.claim_info={last_index:0,total_claimed:0})}function q(t,e,n,i,r=!1){tt(t);const o=(()=>{for(let s=t.claim_info.last_index;s<t.length;s++){const l=t[s];if(e(l)){const c=n(l);return c===void 0?t.splice(s,1):t[s]=c,r||(t.claim_info.last_index=s),l}}for(let s=t.claim_info.last_index-1;s>=0;s--){const l=t[s];if(e(l)){const c=n(l);return c===void 0?t.splice(s,1):t[s]=c,r?c===void 0&&t.claim_info.last_index--:t.claim_info.last_index=s,l}}return i()})();return o.claim_order=t.claim_info.total_claimed,t.claim_info.total_claimed+=1,o}function et(t,e,n,i){return q(t,r=>r.nodeName===e,r=>{const o=[];for(let s=0;s<r.attributes.length;s++){const l=r.attributes[s];n[l.name]||o.push(l.name)}o.forEach(s=>r.removeAttribute(s))},()=>i(e))}function Et(t,e,n){return et(t,e,n,O)}function nt(t,e){return q(t,n=>n.nodeType===3,n=>{const i=""+e;if(n.data.startsWith(i)){if(n.data.length!==i.length)return n.splitText(i.length)}else n.data=i},()=>T(e),!0)}function At(t){return nt(t," ")}function Nt(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}function Ct(t,e,n,i){n===null?t.style.removeProperty(e):t.style.setProperty(e,n,i?"important":"")}let x;function it(){if(x===void 0){x=!1;try{typeof window<"u"&&window.parent&&window.parent.document}catch{x=!0}}return x}function St(t,e){getComputedStyle(t).position==="static"&&(t.style.position="relative");const i=O("iframe");i.setAttribute("style","display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: -1;"),i.setAttribute("aria-hidden","true"),i.tabIndex=-1;const r=it();let o;return r?(i.src="data:text/html,<script>onresize=function(){parent.postMessage(0,'*')}<\/script>",o=M(window,"message",s=>{s.source===i.contentWindow&&e()})):(i.src="about:blank",i.onload=()=>{o=M(i.contentWindow,"resize",e)}),X(t,i),()=>{(r||o&&i.contentWindow)&&o(),H(i)}}function Tt(t,e,n){t.classList[n?"add":"remove"](e)}function rt(t,e,{bubbles:n=!1,cancelable:i=!1}={}){const r=document.createEvent("CustomEvent");return r.initCustomEvent(t,n,i,e),r}function jt(t,e){const n=[];let i=0;for(const r of e.childNodes)if(r.nodeType===8){const o=r.textContent.trim();o===`HEAD_${t}_END`?(i-=1,n.push(r)):o===`HEAD_${t}_START`&&(i+=1,n.push(r))}else i>0&&n.push(r);return n}function kt(t,e){return new t(e)}let y;function p(t){y=t}function m(){if(!y)throw new Error("Function called outside component initialization");return y}function Dt(t){m().$$.on_mount.push(t)}function Mt(t){m().$$.after_update.push(t)}function zt(t){m().$$.on_destroy.push(t)}function Lt(){const t=m();return(e,n,{cancelable:i=!1}={})=>{const r=t.$$.callbacks[e];if(r){const o=rt(e,n,{cancelable:i});return r.slice().forEach(s=>{s.call(t,o)}),!o.defaultPrevented}return!0}}function Pt(t,e){return m().$$.context.set(t,e),e}function Wt(t){return m().$$.context.get(t)}const h=[],z=[],$=[],N=[],F=Promise.resolve();let C=!1;function I(){C||(C=!0,F.then(R))}function Bt(){return I(),F}function S(t){$.push(t)}function Ht(t){N.push(t)}const A=new Set;let _=0;function R(){if(_!==0)return;const t=y;do{try{for(;_<h.length;){const e=h[_];_++,p(e),st(e.$$)}}catch(e){throw h.length=0,_=0,e}for(p(null),h.length=0,_=0;z.length;)z.pop()();for(let e=0;e<$.length;e+=1){const n=$[e];A.has(n)||(A.add(n),n())}$.length=0}while(h.length);for(;N.length;)N.pop()();C=!1,A.clear(),p(t)}function st(t){if(t.fragment!==null){t.update(),g(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(S)}}const w=new Set;let d;function Ot(){d={r:0,c:[],p:d}}function qt(){d.r||g(d.c),d=d.p}function ot(t,e){t&&t.i&&(w.delete(t),t.i(e))}function Ft(t,e,n,i){if(t&&t.o){if(w.has(t))return;w.add(t),d.c.push(()=>{w.delete(t),i&&(n&&t.d(1),i())}),t.o(e)}else i&&i()}const It=typeof window<"u"?window:typeof globalThis<"u"?globalThis:global;function Rt(t,e,n){const i=t.$$.props[e];i!==void 0&&(t.$$.bound[i]=n,n(t.$$.ctx[i]))}function Gt(t){t&&t.c()}function Jt(t,e){t&&t.l(e)}function ct(t,e,n,i){const{fragment:r,after_update:o}=t.$$;r&&r.m(e,n),i||S(()=>{const s=t.$$.on_mount.map(L).filter(P);t.$$.on_destroy?t.$$.on_destroy.push(...s):g(s),t.$$.on_mount=[]}),o.forEach(S)}function ut(t,e){const n=t.$$;n.fragment!==null&&(g(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function lt(t,e){t.$$.dirty[0]===-1&&(h.push(t),I(),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function Kt(t,e,n,i,r,o,s,l=[-1]){const c=y;p(t);const u=t.$$={fragment:null,ctx:[],props:o,update:v,not_equal:r,bound:D(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(e.context||(c?c.$$.context:[])),callbacks:D(),dirty:l,skip_bound:!1,root:e.target||c.$$.root};s&&s(u.root);let f=!1;if(u.ctx=n?n(t,e.props||{},(a,b,...j)=>{const k=j.length?j[0]:b;return u.ctx&&r(u.ctx[a],u.ctx[a]=k)&&(!u.skip_bound&&u.bound[a]&&u.bound[a](k),f&&lt(t,a)),b}):[],u.update(),f=!0,g(u.before_update),u.fragment=i?i(u.ctx):!1,e.target){if(e.hydrate){K();const a=Z(e.target);u.fragment&&u.fragment.l(a),a.forEach(H)}else u.fragment&&u.fragment.c();e.intro&&ot(t.$$.fragment),ct(t,e.target,e.anchor,e.customElement),Q(),R()}p(c)}class Qt{$destroy(){ut(this,1),this.$destroy=v}$on(e,n){if(!P(n))return v;const i=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return i.push(n),()=>{const r=i.indexOf(n);r!==-1&&i.splice(r,1)}}$set(e){this.$$set&&!J(e)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}export{Rt as $,ut as A,Bt as B,v as C,at as D,ht as E,jt as F,pt as G,yt as H,mt as I,Y as J,_t as K,Lt as L,zt as M,Pt as N,dt as O,Wt as P,gt as Q,Tt as R,Qt as S,xt as T,M as U,W as V,P as W,It as X,g as Y,S as Z,St as _,bt as a,Ht as a0,qt as b,At as c,ot as d,wt as e,H as f,Ot as g,Mt as h,Kt as i,O as j,Et as k,Z as l,vt as m,ft as n,Dt as o,Ct as p,T as q,nt as r,$t as s,Ft as t,Nt as u,z as v,kt as w,Gt as x,Jt as y,ct as z};
