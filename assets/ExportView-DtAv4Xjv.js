import{_ as J,i as B,r as p,c as f,a as v,b as e,F as k,g as w,k as c,t as m,w as E,l as D,p as R,x as M,f as g,o as b,n as P}from"./index-DVd1QcJV.js";import{u as z}from"./useContrastChecker-DLFRbeCJ.js";function A(){return{generateCSSVariables:(l,n="color")=>{let t=`:root {
`;return l.forEach((i,a)=>{t+=`  --${n}-${a+1}: ${i};
`}),t+=`}

`,t+=`/* Использование */
`,t+=`.element {
`,t+=`  background-color: var(--${n}-1);
`,t+=`  color: var(--${n}-2);
`,t+="}",t},generateSCSSVariables:(l,n="color")=>{let t=`// SCSS переменные
`;return l.forEach((i,a)=>{t+=`$${n}-${a+1}: ${i};
`}),t+=`
// Использование
`,t+=`.element {
`,t+=`  background-color: $${n}-1;
`,t+=`  color: $${n}-2;
`,t+="}",t},generateTailwindConfig:(l,n="palette")=>{let t=`// tailwind.config.js
`;return t+=`module.exports = {
`,t+=`  theme: {
`,t+=`    extend: {
`,t+=`      colors: {
`,t+=`        '${n}': {
`,l.forEach((i,a)=>{t+=`          '${a+1}': '${i}',
`}),t+=`        }
`,t+=`      }
`,t+=`    }
`,t+=`  }
`,t+=`}

`,t+=`/* Использование в HTML */
`,t+="<!-- bg-palette-1 text-palette-2 -->",t},generateJSON:(l,n="palette")=>{const t={name:n,colors:l,generatedAt:new Date().toISOString()};return JSON.stringify(t,null,2)},generateUtilityCSS:(l,n="color")=>{let t=`/* Utility classes for color palette */

`;return l.forEach((i,a)=>{t+=`.bg-${n}-${a+1} {
`,t+=`  background-color: ${i} !important;
`,t+=`}

`}),l.forEach((i,a)=>{t+=`.text-${n}-${a+1} {
`,t+=`  color: ${i} !important;
`,t+=`}

`}),l.forEach((i,a)=>{t+=`.border-${n}-${a+1} {
`,t+=`  border-color: ${i} !important;
`,t+=`}

`}),t},generateShareableLink:l=>{const n=l.join("-").replace(/#/g,"");return`${window.location.origin}/palette/${n}`},copyToClipboard:async l=>{try{return await navigator.clipboard.writeText(l),!0}catch(n){return console.error("Failed to copy:",n),!1}}}}const H={class:"export-view"},q={class:"export-container"},G={class:"palette-preview-section"},K={class:"palette-display"},Q={class:"color-label"},W={class:"format-selection"},X={class:"format-grid"},Y=["onClick"],Z={class:"format-icon"},ee={class:"format-name"},te={class:"code-editor-section"},oe={class:"editor-header"},ne={class:"code-editor"},se={class:"editor-options"},le={class:"option-group"},ae={class:"option-group"},re={for:"includeComments"},ie={class:"ui-preview-section"},ce={class:"ui-components"},de={class:"ui-component"},ue={class:"component-preview"},pe={class:"ui-component"},ve={class:"component-preview"},be={class:"ui-component"},me={class:"component-preview"},ge={class:"ui-form"},Ce={class:"sharing-section"},Se={class:"sharing-options"},_e={class:"share-link"},he=["value"],ye={__name:"ExportView",setup(L){const{colors:r}=B(),{getAccessibleTextColor:S}=z(),{generateCSSVariables:_,generateSCSSVariables:$,generateTailwindConfig:x,generateJSON:V,generateUtilityCSS:l,generateShareableLink:n,copyToClipboard:t}=A(),i=p([{id:"css",name:"CSS Variables",icon:"🎨"},{id:"scss",name:"SCSS Variables",icon:"💅"},{id:"tailwind",name:"Tailwind Config",icon:"🎯"},{id:"json",name:"JSON",icon:"📊"},{id:"utility",name:"Utility CSS",icon:"⚡"}]),a=p("css"),u=p("color"),T=p(!0),h=p(null);p(null),p(!1);const j=f(()=>{const d=i.value.find(o=>o.id===a.value);return d?d.name:"CSS Variables"}),y=f(()=>{switch(a.value){case"css":return _(r.value,u.value);case"scss":return $(r.value,u.value);case"tailwind":return x(r.value,u.value);case"json":return V(r.value,"Color Palette");case"utility":return l(r.value,u.value);default:return _(r.value,u.value)}}),U=f(()=>n(r.value)),F=d=>{a.value=d},N=async()=>{await t(y.value)&&alert("Код скопирован в буфер обмена!")},O=()=>{const d=new Blob([y.value],{type:"text/plain"}),o=URL.createObjectURL(d),s=document.createElement("a");s.href=o,s.download=`palette-${new Date().getTime()}.${a.value==="json"?"json":"css"}`,document.body.appendChild(s),s.click(),document.body.removeChild(s),URL.revokeObjectURL(o)},I=async()=>{h.value&&(h.value.select(),await t(U.value)&&alert("Ссылка скопирована в буфер обмена!"))};return(d,o)=>(b(),v("div",H,[o[13]||(o[13]=e("div",{class:"export-header"},[e("h1",null,"📤 Экспорт палитры"),e("p",null,"Экспортируйте вашу палитру в различные форматы для использования в проектах")],-1)),e("div",q,[e("div",G,[o[2]||(o[2]=e("h2",null,"Текущая палитра",-1)),e("div",K,[(b(!0),v(k,null,w(c(r),(s,C)=>(b(),v("div",{key:C,class:"preview-color",style:g({backgroundColor:s})},[e("span",Q,m(s),1)],4))),128))])]),e("div",W,[o[3]||(o[3]=e("h2",null,"Форматы экспорта",-1)),e("div",X,[(b(!0),v(k,null,w(i.value,s=>(b(),v("button",{key:s.id,class:P(["format-btn",{active:a.value===s.id}]),onClick:C=>F(s.id)},[e("span",Z,m(s.icon),1),e("span",ee,m(s.name),1)],10,Y))),128))])]),e("div",te,[e("div",oe,[e("h3",null,m(j.value)+" код",1),e("div",{class:"editor-actions"},[e("button",{class:"action-btn",onClick:N}," 📋 Копировать "),e("button",{class:"action-btn",onClick:O}," 💾 Скачать ")])]),e("div",ne,[e("pre",null,[e("code",null,m(y.value),1)])]),e("div",se,[e("div",le,[o[4]||(o[4]=e("label",{for:"prefix"},"Префикс переменных:",-1)),E(e("input",{id:"prefix",type:"text","onUpdate:modelValue":o[0]||(o[0]=s=>u.value=s),class:"prefix-input",placeholder:"color"},null,512),[[D,u.value]])]),e("div",ae,[e("label",re,[E(e("input",{id:"includeComments",type:"checkbox","onUpdate:modelValue":o[1]||(o[1]=s=>T.value=s)},null,512),[[M,T.value]]),o[5]||(o[5]=R(" Включать комментарии ",-1))])])])]),e("div",ie,[o[11]||(o[11]=e("h2",null,"Превью UI компонентов",-1)),e("div",ce,[e("div",de,[o[6]||(o[6]=e("h4",null,"Кнопки",-1)),e("div",ue,[(b(!0),v(k,null,w(c(r).slice(0,3),(s,C)=>(b(),v("button",{key:C,class:"ui-button",style:g({backgroundColor:s,color:c(S)(s)})}," Кнопка "+m(C+1),5))),128))])]),e("div",pe,[o[9]||(o[9]=e("h4",null,"Карточки",-1)),e("div",ve,[e("div",{class:"ui-card",style:g({borderTopColor:c(r)[0]})},[o[7]||(o[7]=e("h5",null,"Заголовок карточки",-1)),o[8]||(o[8]=e("p",null,"Пример текста в карточке с использованием цветов палитры",-1)),e("button",{class:"card-action",style:g({backgroundColor:c(r)[1],color:c(S)(c(r)[1])})}," Действие ",4)],4)])]),e("div",be,[o[10]||(o[10]=e("h4",null,"Формы",-1)),e("div",me,[e("div",ge,[e("input",{type:"text",placeholder:"Введите текст",class:"form-input",style:g({borderColor:c(r)[2]})},null,4),e("button",{class:"form-button",style:g({backgroundColor:c(r)[3],color:c(S)(c(r)[3])})}," Отправить ",4)])])])])]),e("div",Ce,[o[12]||(o[12]=e("h2",null,"Поделиться палитрой",-1)),e("div",Se,[e("div",_e,[e("input",{type:"text",value:U.value,readonly:"",class:"link-input",ref_key:"linkInput",ref:h},null,8,he),e("button",{class:"copy-link-btn",onClick:I}," 📋 Копировать ссылку ")])])])])]))}},we=J(ye,[["__scopeId","data-v-ddfdeb98"]]);export{we as default};
