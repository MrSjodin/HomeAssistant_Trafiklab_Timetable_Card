/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const N=globalThis,B=N.ShadowRoot&&(N.ShadyCSS===void 0||N.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,j=Symbol(),J=new WeakMap;let it=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==j)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(B&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=J.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&J.set(e,t))}return t}toString(){return this.cssText}};const ut=o=>new it(typeof o=="string"?o:o+"",void 0,j),nt=(o,...t)=>{const e=o.length===1?o[0]:t.reduce((s,i,n)=>s+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+o[n+1],o[0]);return new it(e,o,j)},pt=(o,t)=>{if(B)o.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),i=N.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,o.appendChild(s)}},K=B?o=>o:o=>o instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return ut(e)})(o):o;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:mt,defineProperty:_t,getOwnPropertyDescriptor:ft,getOwnPropertyNames:gt,getOwnPropertySymbols:$t,getPrototypeOf:yt}=Object,g=globalThis,Y=g.trustedTypes,vt=Y?Y.emptyScript:"",bt=g.reactiveElementPolyfillSupport,E=(o,t)=>o,L={toAttribute(o,t){switch(t){case Boolean:o=o?vt:null;break;case Object:case Array:o=o==null?o:JSON.stringify(o)}return o},fromAttribute(o,t){let e=o;switch(t){case Boolean:e=o!==null;break;case Number:e=o===null?null:Number(o);break;case Object:case Array:try{e=JSON.parse(o)}catch{e=null}}return e}},rt=(o,t)=>!mt(o,t),Z={attribute:!0,type:String,converter:L,reflect:!1,useDefault:!1,hasChanged:rt};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),g.litPropertyMetadata??(g.litPropertyMetadata=new WeakMap);let b=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Z){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&_t(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:n}=ft(this.prototype,t)??{get(){return this[e]},set(r){this[e]=r}};return{get:i,set(r){const l=i?.call(this);n?.call(this,r),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Z}static _$Ei(){if(this.hasOwnProperty(E("elementProperties")))return;const t=yt(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(E("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(E("properties"))){const e=this.properties,s=[...gt(e),...$t(e)];for(const i of s)this.createProperty(i,e[i])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const i of s)e.unshift(K(i))}else t!==void 0&&e.push(K(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return pt(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){const n=(s.converter?.toAttribute!==void 0?s.converter:L).toAttribute(e,s.type);this._$Em=t,n==null?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(t,e){const s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){const n=s.getPropertyOptions(i),r=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:L;this._$Em=i;const l=r.fromAttribute(e,n.type);this[i]=l??this._$Ej?.get(i)??l,this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){const i=this.constructor,n=this[t];if(s??(s=i.getPropertyOptions(t)),!((s.hasChanged??rt)(n,e)||s.useDefault&&s.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(i._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:n},r){s&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,r??e??this[t]),n!==!0||r!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),i===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[i,n]of this._$Ep)this[i]=n;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[i,n]of s){const{wrapped:r}=n,l=this[i];r!==!0||this._$AL.has(i)||l===void 0||this.C(i,void 0,n,l)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}};b.elementStyles=[],b.shadowRootOptions={mode:"open"},b[E("elementProperties")]=new Map,b[E("finalized")]=new Map,bt?.({ReactiveElement:b}),(g.reactiveElementVersions??(g.reactiveElementVersions=[])).push("2.1.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const C=globalThis,O=C.trustedTypes,G=O?O.createPolicy("lit-html",{createHTML:o=>o}):void 0,ot="$lit$",f=`lit$${Math.random().toFixed(9).slice(2)}$`,at="?"+f,xt=`<${at}>`,v=document,T=()=>v.createComment(""),P=o=>o===null||typeof o!="object"&&typeof o!="function",V=Array.isArray,At=o=>V(o)||typeof o?.[Symbol.iterator]=="function",z=`[ 	
\f\r]`,S=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Q=/-->/g,X=/>/g,$=RegExp(`>|${z}(?:([^\\s"'>=/]+)(${z}*=${z}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),tt=/'/g,et=/"/g,lt=/^(?:script|style|textarea|title)$/i,wt=o=>(t,...e)=>({_$litType$:o,strings:t,values:e}),p=wt(1),A=Symbol.for("lit-noChange"),d=Symbol.for("lit-nothing"),st=new WeakMap,y=v.createTreeWalker(v,129);function ct(o,t){if(!V(o)||!o.hasOwnProperty("raw"))throw Error("invalid template strings array");return G!==void 0?G.createHTML(t):t}const St=(o,t)=>{const e=o.length-1,s=[];let i,n=t===2?"<svg>":t===3?"<math>":"",r=S;for(let l=0;l<e;l++){const a=o[l];let h,u,c=-1,m=0;for(;m<a.length&&(r.lastIndex=m,u=r.exec(a),u!==null);)m=r.lastIndex,r===S?u[1]==="!--"?r=Q:u[1]!==void 0?r=X:u[2]!==void 0?(lt.test(u[2])&&(i=RegExp("</"+u[2],"g")),r=$):u[3]!==void 0&&(r=$):r===$?u[0]===">"?(r=i??S,c=-1):u[1]===void 0?c=-2:(c=r.lastIndex-u[2].length,h=u[1],r=u[3]===void 0?$:u[3]==='"'?et:tt):r===et||r===tt?r=$:r===Q||r===X?r=S:(r=$,i=void 0);const _=r===$&&o[l+1].startsWith("/>")?" ":"";n+=r===S?a+xt:c>=0?(s.push(h),a.slice(0,c)+ot+a.slice(c)+f+_):a+f+(c===-2?l:_)}return[ct(o,n+(o[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};class M{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,r=0;const l=t.length-1,a=this.parts,[h,u]=St(t,e);if(this.el=M.createElement(h,s),y.currentNode=this.el.content,e===2||e===3){const c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(i=y.nextNode())!==null&&a.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(const c of i.getAttributeNames())if(c.endsWith(ot)){const m=u[r++],_=i.getAttribute(c).split(f),H=/([.?@])?(.*)/.exec(m);a.push({type:1,index:n,name:H[2],strings:_,ctor:H[1]==="."?Ct:H[1]==="?"?kt:H[1]==="@"?Tt:R}),i.removeAttribute(c)}else c.startsWith(f)&&(a.push({type:6,index:n}),i.removeAttribute(c));if(lt.test(i.tagName)){const c=i.textContent.split(f),m=c.length-1;if(m>0){i.textContent=O?O.emptyScript:"";for(let _=0;_<m;_++)i.append(c[_],T()),y.nextNode(),a.push({type:2,index:++n});i.append(c[m],T())}}}else if(i.nodeType===8)if(i.data===at)a.push({type:2,index:n});else{let c=-1;for(;(c=i.data.indexOf(f,c+1))!==-1;)a.push({type:7,index:n}),c+=f.length-1}n++}}static createElement(t,e){const s=v.createElement("template");return s.innerHTML=t,s}}function w(o,t,e=o,s){if(t===A)return t;let i=s!==void 0?e._$Co?.[s]:e._$Cl;const n=P(t)?void 0:t._$litDirective$;return i?.constructor!==n&&(i?._$AO?.(!1),n===void 0?i=void 0:(i=new n(o),i._$AT(o,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=i:e._$Cl=i),i!==void 0&&(t=w(o,i._$AS(o,t.values),i,s)),t}class Et{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??v).importNode(e,!0);y.currentNode=i;let n=y.nextNode(),r=0,l=0,a=s[0];for(;a!==void 0;){if(r===a.index){let h;a.type===2?h=new U(n,n.nextSibling,this,t):a.type===1?h=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(h=new Pt(n,this,t)),this._$AV.push(h),a=s[++l]}r!==a?.index&&(n=y.nextNode(),r++)}return y.currentNode=v,i}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class U{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=d,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=w(this,t,e),P(t)?t===d||t==null||t===""?(this._$AH!==d&&this._$AR(),this._$AH=d):t!==this._$AH&&t!==A&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):At(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==d&&P(this._$AH)?this._$AA.nextSibling.data=t:this.T(v.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=M.createElement(ct(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{const n=new Et(i,this),r=n.u(this.options);n.p(e),this.T(r),this._$AH=n}}_$AC(t){let e=st.get(t.strings);return e===void 0&&st.set(t.strings,e=new M(t)),e}k(t){V(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const n of t)i===e.length?e.push(s=new U(this.O(T()),this.O(T()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const s=t.nextSibling;t.remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}}class R{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,n){this.type=1,this._$AH=d,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=d}_$AI(t,e=this,s,i){const n=this.strings;let r=!1;if(n===void 0)t=w(this,t,e,0),r=!P(t)||t!==this._$AH&&t!==A,r&&(this._$AH=t);else{const l=t;let a,h;for(t=n[0],a=0;a<n.length-1;a++)h=w(this,l[s+a],e,a),h===A&&(h=this._$AH[a]),r||(r=!P(h)||h!==this._$AH[a]),h===d?t=d:t!==d&&(t+=(h??"")+n[a+1]),this._$AH[a]=h}r&&!i&&this.j(t)}j(t){t===d?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Ct extends R{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===d?void 0:t}}class kt extends R{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==d)}}class Tt extends R{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){if((t=w(this,t,e,0)??d)===A)return;const s=this._$AH,i=t===d&&s!==d||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==d&&(s===d||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class Pt{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){w(this,t)}}const Mt=C.litHtmlPolyfillSupport;Mt?.(M,U),(C.litHtmlVersions??(C.litHtmlVersions=[])).push("3.3.1");const Ut=(o,t,e)=>{const s=e?.renderBefore??t;let i=s._$litPart$;if(i===void 0){const n=e?.renderBefore??null;s._$litPart$=i=new U(t.insertBefore(T(),n),n,void 0,e??{})}return i._$AI(o),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const k=globalThis;class x extends b{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Ut(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return A}}x._$litElement$=!0,x.finalized=!0,k.litElementHydrateSupport?.({LitElement:x});const Ht=k.litElementPolyfillSupport;Ht?.({LitElement:x});(k.litElementVersions??(k.litElementVersions=[])).push("4.2.1");const Nt={title:"Trafiklab Timetable"},Ot={entity_not_found:"Entity not found: {entity}"},Rt={no_upcoming:"No upcoming departures"},zt={platform:"Platform {platform}",stand:"Stand {platform}",bay:"Bay {platform}",now:"Now",in_minutes:"in {minutes} min",updated:"Updated {time}",mode_bus:"Bus",mode_metro:"Metro",mode_train:"Train",mode_tram:"Tram",mode_taxi:"Taxi",mode_boat:"Boat"},Lt={cancelled:"Cancelled",delayed:"Delayed {minutes} min",on_time:"On time"},Dt={sensor_entity:"Sensor entity",show_heading:"Show heading (friendly name)",max_items:"Max items",section_general:"Card options",help_sensor:"Select the Trafiklab timetable sensor entity.",help_show_heading:"Show the sensor's friendly name as the card heading.",help_max_items:"Maximum number of departures to display."},ht={card:Nt,error:Ot,empty:Rt,label:zt,status:Lt,editor:Dt},It={title:"Trafiklab Tidtabell"},Bt={entity_not_found:"Enheten hittades inte: {entity}"},jt={no_upcoming:"Inga kommande avgångar"},Vt={platform:"Plattform {platform}",stand:"Läge {platform}",bay:"Brygga {platform}",now:"Nu",in_minutes:"om {minutes} min",updated:"Uppdaterad {time}",mode_bus:"Buss",mode_metro:"T-bana",mode_train:"Tåg",mode_tram:"Spårvagn",mode_taxi:"Taxi",mode_boat:"Båt"},qt={cancelled:"Inställd",delayed:"Försenad {minutes} min",on_time:"I tid"},Ft={sensor_entity:"Sensornamn",show_heading:"Visa rubrik (visningsnamn)",max_items:"Max antal",section_general:"Kortalternativ",help_sensor:"Välj Trafiklab-tidtabellens sensor.",help_show_heading:"Visa sensorns visningsnamn som kortets rubrik.",help_max_items:"Maximalt antal avgångar att visa."},dt={card:It,error:Bt,empty:jt,label:Vt,status:qt,editor:Ft};function Wt(o,t,e){const s=o?.locale?.language||o?.language||"en",i=String(s).toLowerCase().startsWith("sv")?dt:ht;return t.split(".").reduce((r,l)=>r?r[l]:void 0,i)||t}const F=class F extends x{setConfig(t){this._config={show_name:!0,max_items:5,...t}}_valueChanged(t){this._config||(this._config={type:"trafiklab-timetable-card",entity:"",show_name:!0,max_items:5});const e=t.currentTarget,s=t.detail,i={...this._config},n=e?.configValue??e?.dataset?.configValue;if(n){let r=s?.value??e.value??e.checked;if(e.type==="number"||e.inputMode==="numeric"||n==="max_items"){const l=Number(r);Number.isNaN(l)||(r=l)}e.type==="checkbox"?i[n]=e.checked:r!==void 0&&(i[n]=r)}JSON.stringify(i)!==JSON.stringify(this._config)&&(this._config=i,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:i}})))}render(){const t=(l,a)=>Wt(this.hass,l),e=!!customElements.get("ha-entity-picker")&&!!this.hass,s=!!customElements.get("ha-switch"),i=!!customElements.get("ha-textfield"),n=!!customElements.get("ha-form"),r={entity:this._config?.entity??"",show_name:this._config?.show_name!==!1,max_items:this._config?.max_items??5};if(n){const l=[{name:"entity",selector:{entity:{domain:"sensor"}}},{name:"show_name",selector:{boolean:{}}},{name:"max_items",selector:{number:{min:1,max:20,mode:"box"}}}],a={entity:r.entity,show_name:r.show_name,max_items:r.max_items};return p`
        <ha-form
          .hass=${this.hass}
          .data=${a}
          .schema=${l}
          .computeLabel=${h=>{switch(h.name){case"entity":return t("editor.sensor_entity");case"show_name":return t("editor.show_heading");case"max_items":return t("editor.max_items");default:return String(h.name)}}}
          .computeHelper=${h=>{switch(h.name){case"entity":return t("editor.help_sensor");case"show_name":return t("editor.help_show_heading");case"max_items":return t("editor.help_max_items");default:return}}}
          @value-changed=${h=>{const u=h.detail?.value||{},c={...this._config||{type:"trafiklab-timetable-card"},entity:u.entity??"",show_name:u.show_name??!0,max_items:typeof u.max_items=="number"?u.max_items:Number(u.max_items)||5};JSON.stringify(c)!==JSON.stringify(this._config)&&(this._config=c,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:c}})))}}
        ></ha-form>
      `}return p`
      <div class="card-config">
        <div class="field">
          ${e?p`<ha-entity-picker
                  .hass=${this.hass}
                  .value=${r.entity}
                  .label=${t("editor.sensor_entity")}
                  .configValue=${"entity"}
                  .includeDomains=${["sensor"]}
                  allow-custom-entity
                  @value-changed=${this._valueChanged}
                ></ha-entity-picker>`:p`<label class="lbl">${t("editor.sensor_entity")}<input
                    type="text"
                    .value=${r.entity}
                    data-config-value="entity"
                    @input=${l=>this._valueChanged(l)}
                  /></label>`}
        </div>
        <div class="field">
          ${s?p`<ha-formfield .label=${t("editor.show_heading")}>
                  <ha-switch
                    .checked=${r.show_name}
                    .configValue=${"show_name"}
                    @change=${this._valueChanged}
                  ></ha-switch>
                </ha-formfield>`:p`<label class="lbl"><input type="checkbox"
                    .checked=${r.show_name}
                    data-config-value="show_name"
                    @change=${l=>this._valueChanged(l)}
                  /> ${t("editor.show_heading")}</label>`}
        </div>
        <div class="field">
          ${i?p`<ha-textfield
                  .label=${t("editor.max_items")}
                  .value=${String(r.max_items)}
                  .configValue=${"max_items"}
                  type="number"
                  min="1"
                  max="20"
                  @value-changed=${this._valueChanged}
                  @input=${this._valueChanged}
                  @change=${this._valueChanged}
                ></ha-textfield>`:p`<label class="lbl">${t("editor.max_items")}<input
                    type="number" min="1" max="20"
                    .value=${String(r.max_items)}
                    data-config-value="max_items"
                    @input=${l=>this._valueChanged(l)}
                  /></label>`}
        </div>
      </div>
    `}};F.styles=nt`
  .card-config { display: grid; gap: 16px; }
  .lbl { display: grid; gap: 6px; font: inherit; color: var(--primary-text-color); }
  input[type="text"], input[type="number"] { padding: 8px; border-radius: 6px; border: 1px solid var(--divider-color); width: 100%; background: var(--card-background-color); color: var(--primary-text-color); }
  `;let D=F;customElements.define("trafiklab-timetable-card-editor",D);const q="trafiklab-timetable-card",W=class W extends x{constructor(){super(...arguments),this._overlayHeight=0,this._overlayTop=0}set hass(t){this._hass=t,this.requestUpdate()}get hass(){return this._hass}static getStubConfig(){return{show_name:!0,max_items:5}}static getConfigElement(){return document.createElement("trafiklab-timetable-card-editor")}setConfig(t){if(!t||!t.entity)throw new Error("Required property missing: entity");this._config={show_name:!0,max_items:5,...t,type:q}}getCardSize(){const t=this._getDepartures().length||1;return 1+Math.min(t,this._config?.max_items??5)}_getEntity(){const t=this._config?.entity;if(t)return this.hass?.states?.[t]}_t(t,e){const s=this.hass?.locale?.language||this.hass?.language||"en",i=String(s).toLowerCase().startsWith("sv")?dt:ht,n=t.split(".").reduce((r,l)=>r?r[l]:void 0,i)||t;return e?Object.entries(e).reduce((r,[l,a])=>r.replaceAll(`{${l}}`,String(a)),n):n}_getDepartures(){const t=this._getEntity();if(!t)return[];const e=t.attributes?.upcoming;if(Array.isArray(e))return e;const s=this._mapEntityToItem(t);return s?[s]:[]}_mapEntityToItem(t){const e=t.attributes||{};if(!(!("destination"in e)&&!("scheduled_time"in e)))return{line:e.line,destination:e.destination,scheduled_time:e.scheduled_time,expected_time:e.expected_time??e.scheduled_time,time_formatted:e.time_formatted,minutes_until:Number(t.state),transport_mode:e.transport_mode,real_time:e.real_time,delay:e.delay,delay_minutes:e.delay_minutes,canceled:e.canceled,platform:e.platform,agency:e.agency}}_modeLabel(t){if(!t)return;const e=`label.mode_${String(t).toLowerCase()}`,s=this._t(e);return s===e?t:s}_iconForMode(t){if(t)switch(String(t).toLowerCase()){case"bus":return"mdi:bus";case"metro":return"mdi:subway-variant";case"train":return"mdi:train";case"tram":return"mdi:tram";case"taxi":return"mdi:taxi";case"boat":return"mdi:ferry";default:return}}_platformLabelFor(t){const e=t?.platform;if(e==null||e==="")return;const s=String(t?.transport_mode||"").toLowerCase(),i=s==="bus"||s==="taxi"||s==="tram"?"label.stand":s==="boat"?"label.bay":"label.platform";return this._t(i,{platform:e})}_statusFor(t){if(t.canceled)return{label:this._t("status.cancelled"),badge:"cancel"};const e=typeof t.delay_minutes=="number"?t.delay_minutes:typeof t.delay=="number"?Math.round(t.delay/60):0;return e>0?{label:this._t("status.delayed",{minutes:e}),badge:"delay"}:{label:this._t("status.on_time"),badge:"ok"}}_formatTimeString(t){if(t.time_formatted)return t.time_formatted;const e=t.expected_time||t.scheduled_time;if(!e)return"";try{const s=new Date(e),i=s.getHours().toString().padStart(2,"0"),n=s.getMinutes().toString().padStart(2,"0");return`${i}:${n}`}catch{return String(e)}}_formatUpdated(t){try{return new Date(t).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}catch{return t}}_openMoreInfo(){const t=this._config?.entity;t&&this.dispatchEvent(new CustomEvent("hass-more-info",{bubbles:!0,composed:!0,detail:{entityId:t}}))}_onKeyActivate(t){(t.key==="Enter"||t.key===" ")&&(t.preventDefault(),this._openMoreInfo())}updated(){try{const t=this.renderRoot.querySelector(".list"),e=this.renderRoot.querySelector(".card-body"),s=this.renderRoot.querySelector("ha-card");if(!t||!e||!s)return;const i=t.getBoundingClientRect(),n=e.getBoundingClientRect(),r=s.getBoundingClientRect(),l=Math.max(0,n.top-r.top),a=Math.max(0,i.top-n.top),h=Math.max(0,l+a-2),u=-l;(h!==this._overlayHeight||u!==this._overlayTop)&&(this._overlayHeight=h,this._overlayTop=u,this.requestUpdate())}catch{}}render(){const t=this._getEntity();if(!this._config)return d;if(!t)return p`<ha-card header=${this._t("card.title")}>
        <div class="content error">${this._t("error.entity_not_found",{entity:this._config.entity})}</div>
      </ha-card>`;const e=this._config.show_name!==!1,s=e?t.attributes?.friendly_name||t.entity_id:void 0,i=this._getDepartures().slice(0,this._config.max_items??5);return p`
      <ha-card .header=${e?s??this._t("card.title"):void 0}>
        <div class="card-body">
          ${e?p`<div
                    class="header-overlay"
                    style="top: ${this._overlayTop}px; height: ${this._overlayHeight}px;"
                    role="button"
                    tabindex="0"
                    @click=${()=>this._openMoreInfo()}
                    @keydown=${n=>this._onKeyActivate(n)}
                  ></div>`:d}
        ${i.length===0?p`<div class="content empty">${this._t("empty.no_upcoming")}</div>`:p`<div class="list" role="list">
              ${i.map(n=>{const r=this._statusFor(n),l=this._formatTimeString(n),a=typeof n.minutes_until=="number"?n.minutes_until:void 0,h=this._modeLabel(n.transport_mode)??n.transport_mode,u=this._iconForMode(n.transport_mode),c=a!==void 0?a===0?this._t("label.now"):this._t("label.in_minutes",{minutes:a}):void 0;return p`
                  <div class="row" role="listitem">
                    <div class="line">
                      <span class="pill" role="button" tabindex="0"
                            @click=${()=>this._openMoreInfo()}
                            @keydown=${m=>this._onKeyActivate(m)}>
                        ${u?p`<ha-icon class="pill-icon" .icon=${u}></ha-icon>`:d}${n.line??""}
                      </span>
                    </div>
                    <div class="main">
                      <div class="dest">${n.destination??""}</div>
                      <div class="meta">
                        ${this._platformLabelFor(n)?p`<span class="platform">${this._platformLabelFor(n)}</span>`:d}
                        ${h?p`<span class="mode-text">${h}</span>`:d}
                        ${n.real_time?p`<span class="rt">RT</span>`:d}
                      </div>
                    </div>
                    <div class="right">
                      <div class="time">${l}</div>
                      ${c!==void 0||r?.label?p`<div class="in-status">
                              ${c?p`<span class="in">${c}</span>`:d}
                              ${c&&r?.label?p`<span class="sep"> - </span>`:d}
                              ${r?.label?p`<span class="status ${r.badge}">${r.label}</span>`:d}
                            </div>`:d}
                    </div>
                  </div>`})}
            </div>`}
        <div class="footer">
          ${t.attributes?.attribution?p`<span class="attr">${t.attributes.attribution}</span>`:d}
          ${t.attributes?.last_update?p`<span class="updated">${this._t("label.updated",{time:this._formatUpdated(t.attributes.last_update)})}</span>`:d}
        </div>
        </div>
      </ha-card>
    `}};W.styles=nt`
    ha-card {
      --pill-bg: var(--primary-color);
      --ok: var(--success-color, #0b8457);
      --delay: var(--warning-color, #b36b00);
      --cancel: var(--error-color, #c92a2a);
      /* Size controls for icon and line pill */
      --trafiklab-pill-font-size: 1.6em; /* ~1.6x larger text */
      --trafiklab-pill-icon-size: 1.2em; /* scale icon with text */
      --trafiklab-pill-icon-nudge: -0.05em; /* slight optical centering */
    }
    .card-body { position: relative; }
    .header-overlay { position: absolute; left: 0; right: 0; background: transparent; z-index: 2; }
    .content {
      padding: 12px 16px;
    }
    .error { color: var(--error-color); }
    .empty { color: var(--secondary-text-color); }
    .list { padding: 8px 8px 0; }
    .row {
      display: grid;
      grid-template-columns: auto 1fr auto;
      gap: 12px;
      align-items: center;
      padding: 8px;
      border-bottom: 1px solid var(--divider-color);
    }
    .row:last-child { border-bottom: none; }
    .card-header { padding: 16px; font-size: 1.1em; font-weight: 600; cursor: pointer; }
    .pill {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      min-width: 28px;
      padding: 4px 12px;
      border-radius: 999px;
      background: var(--pill-bg);
      color: var(--text-primary-color, white);
      font-weight: 600;
      line-height: 1;
      font-size: var(--trafiklab-pill-font-size, 2em);
      cursor: pointer;
    }
    .dest { font-weight: 600; font-size: 1.1em; }
    .meta { color: var(--secondary-text-color); font-size: 0.86em; display: flex; gap: 8px; }
    .pill-icon {
      --mdc-icon-size: var(--trafiklab-pill-icon-size, 1.25em);
      width: var(--trafiklab-pill-icon-size, 1.25em);
      height: var(--trafiklab-pill-icon-size, 1.25em);
      color: var(--text-primary-color, white);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transform: translateY(var(--trafiklab-pill-icon-nudge));
    }
    .right { text-align: right; }
    .time { font-weight: 600; font-size: 1.1em; }
    .in-status { color: var(--secondary-text-color); font-size: 0.9em; display: inline-flex; align-items: baseline; gap: 4px; }
    .status { font-size: 0.86em; }
    .status.ok { color: var(--ok); }
    .status.delay { color: var(--delay); }
    .status.cancel { color: var(--cancel); font-weight: 700; }
    .footer {
      display: flex;
      justify-content: space-between;
      padding: 8px 16px 12px;
      color: var(--secondary-text-color);
      font-size: 0.8em;
    }
  `;let I=W;customElements.define(q,I);window.customCards=window.customCards||[];window.customCards.push({type:q,name:"Trafiklab Timetable",description:"Shows upcoming departures from a Trafiklab timetable sensor",preview:!0});
//# sourceMappingURL=trafiklab-timetable-card.js.map
