(function(e){function t(t){for(var i,o,s=t[0],a=t[1],l=t[2],d=0,b=[];d<s.length;d++)o=s[d],Object.prototype.hasOwnProperty.call(r,o)&&r[o]&&b.push(r[o][0]),r[o]=0;for(i in a)Object.prototype.hasOwnProperty.call(a,i)&&(e[i]=a[i]);u&&u(t);while(b.length)b.shift()();return c.push.apply(c,l||[]),n()}function n(){for(var e,t=0;t<c.length;t++){for(var n=c[t],i=!0,s=1;s<n.length;s++){var a=n[s];0!==r[a]&&(i=!1)}i&&(c.splice(t--,1),e=o(o.s=n[0]))}return e}var i={},r={app:0},c=[];function o(t){if(i[t])return i[t].exports;var n=i[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,o),n.l=!0,n.exports}o.m=e,o.c=i,o.d=function(e,t,n){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},o.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,t){if(1&t&&(e=o(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)o.d(n,i,function(t){return e[t]}.bind(null,i));return n},o.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="/";var s=window["webpackJsonp"]=window["webpackJsonp"]||[],a=s.push.bind(s);s.push=t,s=s.slice();for(var l=0;l<s.length;l++)t(s[l]);var u=a;c.push([0,"chunk-vendors"]),n()})({0:function(e,t,n){e.exports=n("56d7")},"0043":function(e,t,n){"use strict";n("a4d3"),n("e01a"),n("b0c0");var i=n("7a23"),r={class:"symbol"},c={class:"code"};function o(e,t,n,o,s,a){return Object(i["j"])(),Object(i["c"])("div",{class:["instruction",a.classObject],style:a.boardLocationStyle,draggable:n.draggable,onDragstart:t[2]||(t[2]=function(){return a.dragstart&&a.dragstart.apply(a,arguments)}),title:n.description},[n.userPlaced?(Object(i["j"])(),Object(i["c"])("button",{key:0,onClick:t[1]||(t[1]=function(){return a.deleteMe&&a.deleteMe.apply(a,arguments)}),class:"delete"},"✖")):Object(i["d"])("",!0),Object(i["f"])("div",r,Object(i["q"])(n.symbol),1),Object(i["f"])("div",c,Object(i["q"])(n.name),1)],46,["draggable","title"])}var s={name:"Instruction",props:{symbol:String,name:String,description:String,unlocked:Boolean,x:{required:!1,default:null},y:{required:!1,default:null},draggable:Boolean,userPlaced:Boolean,canBeDeleted:Boolean,deleteMethod:Function,instructionClass:{type:String,default:"A"}},methods:{dragstart:function(e){e.dataTransfer.setData("text",this.name)},deleteMe:function(){this.deleteMethod&&this.deleteMethod()}},computed:{boardLocationStyle:function(){return null!==this.x&&null!==this.y?{"grid-column":this.x,"grid-row":this.y}:{}},classObject:function(){var e={unlocked:this.unlocked,draggable:this.draggable,userPlaced:this.userPlaced};return e["field-style-".concat(this.instructionClass)]=!0,e}}};n("16ea");s.render=o;t["a"]=s},"0d5c":function(e,t,n){},"0ec0":function(e,t,n){"use strict";n.r(t);n("b0c0");var i=n("7a23");function r(e,t,n,r,c,o){var s=Object(i["o"])("Board");return Object(i["j"])(),Object(i["c"])(s,{cols:7,rows:7,gridObjects:c.gridObjects,finishLevel:o.finishLevel,levelCode:e.$options.name},null,8,["gridObjects","finishLevel","levelCode"])}var c=n("5530"),o=n("91ea"),s={name:"Level0002",displayName:"Level 0002 - And It Goes Down",description:"In this level we have to place one arrow",unlocksLevels:["Level0003"],unlocksInstructions:["LEFT"],data:function(){return{gridObjects:[Object(c["a"])({x:3,y:3},this.$store.state.instructions["STRT"]),Object(c["a"])({x:7,y:5},this.$store.state.instructions["FINI"])]}},components:{Board:o["a"]},methods:{finishLevel:function(){this.$store.commit("unlockInstruction","LEFT"),this.$store.commit("completeLevel","Level0002"),this.$store.commit("unlockLevel","Level0003"),this.$store.commit("openMenu"),alert("you won")}}};s.render=r;t["default"]=s},"11cc":function(e,t,n){"use strict";n("a171")},"151c":function(e,t,n){"use strict";n.r(t);n("b0c0");var i=n("7a23");function r(e,t,n,r,c,o){var s=Object(i["o"])("Board");return Object(i["j"])(),Object(i["c"])(s,{cols:7,rows:7,gridObjects:c.gridObjects,finishLevel:o.finishLevel,levelCode:e.$options.name},null,8,["gridObjects","finishLevel","levelCode"])}var c=n("5530"),o=n("91ea"),s={name:"Level0003",displayName:"Level 0003 - Round And Round",description:"In this level we have to go all the way round",unlocksLevels:["Level0004"],unlocksInstructions:["UPWD","RGHT"],data:function(){return{gridObjects:[Object(c["a"])({x:3,y:3},this.$store.state.instructions["STRT"]),Object(c["a"])({x:1,y:7},this.$store.state.instructions["FINI"])]}},components:{Board:o["a"]},methods:{finishLevel:function(){this.$store.commit("unlockInstruction","UPWD"),this.$store.commit("unlockInstruction","RGHT"),this.$store.commit("completeLevel","Level0003"),this.$store.commit("unlockLevel","Level0004"),this.$store.commit("openMenu"),alert("you won")}}};s.render=r;t["default"]=s},"16ea":function(e,t,n){"use strict";n("c976")},"1d02":function(e,t,n){e.exports=n.p+"img/flappy2.ffbdbe41.png"},"26d5":function(e){e.exports=JSON.parse('{"no-instructions-available":"There are no instructions available.","factory-reset-link":"RESET THE GAME - FACTORY RESET","factory-reset-alert":"ARE YOU SURE YOU WANT TO WIPE ALL YOUR PROGRESS?","factory-reset-done":"Ok, everything is wiped. Reloading from scratch.","menu":"Menu"}')},"2ea8":function(e,t,n){"use strict";n.r(t);n("b0c0");var i=n("7a23");function r(e,t,n,r,c,o){var s=Object(i["o"])("Board");return Object(i["j"])(),Object(i["c"])(s,{cols:7,rows:7,gridObjects:c.gridObjects,finishLevel:o.finishLevel,levelCode:e.$options.name},null,8,["gridObjects","finishLevel","levelCode"])}var c=n("5530"),o=n("91ea"),s={name:"Level0001",displayName:"Level 0001 - And So It Begins",description:"In this level we don't have to build anything yet",unlocksLevels:["Level0002"],unlocksInstructions:["DOWN"],data:function(){return{gridObjects:[Object(c["a"])({x:3,y:3},this.$store.state.instructions["STRT"]),Object(c["a"])({x:7,y:3},this.$store.state.instructions["FINI"])]}},components:{Board:o["a"]},methods:{finishLevel:function(){this.$store.commit("unlockInstruction","DOWN"),this.$store.commit("completeLevel","Level0001"),this.$store.commit("unlockLevel","Level0002"),this.$store.commit("openMenu"),alert("you won")}}};s.render=r;t["default"]=s},"2ed8":function(e,t,n){"use strict";n("b0c0");var i=n("7a23"),r={key:0,class:"instruction-grid"},c={key:1};function o(e,t,n,o,s,a){var l=Object(i["o"])("Instruction");return a.filteredInstructions.length>0?(Object(i["j"])(),Object(i["c"])("div",r,[(Object(i["j"])(!0),Object(i["c"])(i["a"],null,Object(i["n"])(a.filteredInstructions,(function(e){return Object(i["j"])(),Object(i["c"])(l,Object(i["i"])({key:e.name},e,{draggable:n.draggable}),null,16,["draggable"])})),128))])):(Object(i["j"])(),Object(i["c"])("p",c,[Object(i["f"])("em",null,Object(i["q"])(e.$t("no-instructions-available")),1)]))}n("07ac");var s=n("5530"),a=n("5502"),l=n("0043"),u={name:"InstructionList",components:{Instruction:l["a"]},props:{draggable:Boolean,unlockedOnly:Boolean},computed:Object(s["a"])(Object(s["a"])({},Object(a["b"])(["instructions"])),{},{filteredInstructions:function(){for(var e=[],t=0,n=Object.values(this.instructions);t<n.length;t++){var i=n[t];this.unlockedOnly&&!i.unlocked||e.push(i)}return e}})};n("f0ce");u.render=o;t["a"]=u},"3d62":function(e,t,n){var i={"./Level0001.vue":"2ea8","./Level0002.vue":"0ec0","./Level0003.vue":"151c","./Level0004.vue":"ed49","./Level0005.vue":"5054","./Level0006.vue":"d420"};function r(e){var t=c(e);return n(t)}function c(e){if(!n.o(i,e)){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}return i[e]}r.keys=function(){return Object.keys(i)},r.resolve=c,e.exports=r,r.id="3d62"},5054:function(e,t,n){"use strict";n.r(t);n("b0c0");var i=n("7a23");function r(e,t,n,r,c,o){var s=Object(i["o"])("Board");return Object(i["j"])(),Object(i["c"])(s,{cols:7,rows:7,gridObjects:c.gridObjects,finishLevel:o.finishLevel,levelCode:e.$options.name},null,8,["gridObjects","finishLevel","levelCode"])}var c=n("5530"),o=n("91ea"),s={name:"Level0005",displayName:"Level 0005 - You Only Live Once",description:"In this level we introduce randomness, you have to escape it!",unlocksLevels:["Level0006"],unlocksInstructions:["YOLO"],data:function(){return{gridObjects:[Object(c["a"])({x:1,y:4},this.$store.state.instructions["STRT"]),Object(c["a"])({x:4,y:4},this.$store.state.instructions["YOLO"]),Object(c["a"])({x:2,y:4},this.$store.state.instructions["RGHT"]),Object(c["a"])({x:6,y:4},this.$store.state.instructions["LEFT"]),Object(c["a"])({x:4,y:6},this.$store.state.instructions["UPWD"]),Object(c["a"])({x:4,y:2},this.$store.state.instructions["DOWN"]),Object(c["a"])({x:7,y:4},this.$store.state.instructions["FINI"])]}},components:{Board:o["a"]},methods:{finishLevel:function(){alert("For now, this is the end of stacky bird!"),this.$store.commit("completeLevel","Level0005"),this.$store.commit("unlockLevel","Level0006"),this.$store.commit("openMenu")}}};s.render=r;t["default"]=s},"50eb":function(e,t,n){e.exports=n.p+"img/flappy1.064d0f8f.png"},"56d7":function(e,t,n){"use strict";n.r(t);n("4160"),n("b0c0"),n("4fad"),n("d3b7"),n("ac1f"),n("5319"),n("1276"),n("159b"),n("ddb0");var i=n("3835"),r=(n("e260"),n("e6cf"),n("cca6"),n("a79d"),n("7a23"));function c(e,t,n,i,c,o){var s=Object(r["o"])("MainMenu");return"menu"===e.appMode?(Object(r["j"])(),Object(r["c"])(s,{key:0})):(Object(r["j"])(),Object(r["c"])(Object(r["p"])(e.level),{key:1}))}var o=n("5502"),s={class:"instruction-grid-container fixedwidth"},a=Object(r["f"])("h1",null,"Stacky Bird",-1),l=Object(r["f"])("p",null,"This is Stacky Bird, a game to learn programming as well as a revolutionary programming language by itself.",-1),u=Object(r["f"])("h2",null,"Levels",-1),d=Object(r["f"])("p",null,"Complete these levels to unlock new instructions. Later on, you can come back and improve your solutions! Click a level to start playing.",-1),b=Object(r["f"])("h2",null,"Instruction Blocks",-1),f=Object(r["f"])("p",null,"The following blocks are available in your solutions. If they are greyed out, you still have to unlock them. Hover over the instructions to see what they do.",-1),p=Object(r["f"])("h2",null,"Completed Levels",-1);function h(e,t,n,i,c,o){var h=Object(r["o"])("LevelList"),v=Object(r["o"])("InstructionList");return Object(r["j"])(),Object(r["c"])("div",s,[a,l,u,d,Object(r["f"])(h,{hideFinished:"",hideNotReachable:""}),b,f,Object(r["f"])(v),p,Object(r["f"])(h,{hideUnfinished:"",hideNotReachable:""}),Object(r["f"])("a",{href:"#",style:{"text-decoration":"underline",display:"block","margin-top":"200px",color:"black"},onClick:t[1]||(t[1]=function(){return o.factoryReset&&o.factoryReset.apply(o,arguments)})},Object(r["q"])(e.$t("factory-reset-link")),1)])}var v=n("2ed8"),O=(n("a4d3"),n("e01a"),{class:"levels"}),j={class:"code"},m={class:"description"},y=Object(r["f"])("br",null,null,-1),g={class:"unlocks"};function k(e,t,n,i,c,o){var s=Object(r["o"])("Instruction");return Object(r["j"])(),Object(r["c"])("ul",O,[(Object(r["j"])(!0),Object(r["c"])(r["a"],null,Object(r["n"])(o.filteredLevels,(function(t,n){return Object(r["j"])(),Object(r["c"])("li",{key:n,class:["level",{completed:t.completed}],onClick:function(t){return e.$store.commit("openLevel",n)}},[Object(r["f"])("div",j,Object(r["q"])(t.component.name.replace(/Level/,"")),1),Object(r["f"])("div",m,[Object(r["f"])("b",null,Object(r["q"])(t.component.displayName),1),y,Object(r["e"])(" "+Object(r["q"])(t.component.description),1)]),Object(r["f"])("div",g,[(Object(r["j"])(!0),Object(r["c"])(r["a"],null,Object(r["n"])(t.component.unlocksInstructions,(function(t){return Object(r["j"])(),Object(r["c"])(s,Object(r["i"])({key:t},e.$store.state.instructions[t],{unlocked:""}),null,16)})),128))])],10,["onClick"])})),128))])}var L=n("5530"),x=n("0043"),I={name:"LevelList",components:{Instruction:x["a"]},props:{hideFinished:Boolean,hideUnfinished:Boolean,hideNotReachable:Boolean},computed:Object(L["a"])(Object(L["a"])({},Object(o["b"])(["levels"])),{},{filteredLevels:function(){for(var e={},t=0,n=Object.entries(this.levels);t<n.length;t++){var r=Object(i["a"])(n[t],2),c=r[0],o=r[1];this.hideFinished&&o.completed||(!o.completed&&this.hideUnfinished||!o.unlocked&&this.hideNotReachable||(e[c]=o))}return e}})};n("9482");I.render=k;var w=I,C={name:"MainMenu",components:{InstructionList:v["a"],LevelList:w},computed:Object(o["b"])(["instructions","levels"]),methods:{factoryReset:function(){confirm(this.$t("factory-reset-alert"))&&(alert(this.$t("factory-reset-done")),localStorage.clear(),window.location.reload())}}};n("a7b2");C.render=h;var $=C,B={name:"App",components:{MainMenu:$},computed:Object(o["b"])(["appMode","level"])};n("8c4c");B.render=c;var S=B,T=(n("c975"),n("07ac"),Object(o["a"])({state:{appMode:"menu",instructions:{},levels:{},level:null},mutations:{registerInstruction:function(e,t){if(t.name in e.instructions)throw new Error("instruction ".concat(t.name," is already registered"));var n=localStorage.getItem("unlockedInstructions")||[];t.unlocked=n.indexOf(t.name)>-1,e.instructions[t.name]=t},unlockInstruction:function(e,t){if(!(t in e.instructions))throw new Error("instruction ".concat(t," not found, can not unlock"));e.instructions[t].unlocked=!0;for(var n=[],i=0,r=Object.values(e.instructions);i<r.length;i++){var c=r[i];c.unlocked&&n.push(c.name)}localStorage.setItem("unlockedInstructions",n)},openLevel:function(e,t){e.appMode="level",e.level=e.levels[t].component},openMenu:function(e){e.appMode="menu",e.level=null},registerLevelComponent:function(e,t){var n=t.levelName,i=t.levelComponent;if(n in e.levels)throw new Error("level ".concat(n," is already registered"));var r=localStorage.getItem("unlockedLevels")||["Level0001"],c=localStorage.getItem("completedLevels")||[];e.levels[n]={name:n,component:i,unlocked:r.indexOf(n)>-1,completed:c.indexOf(n)>-1}},unlockLevel:function(e,t){if(!(t in e.levels))throw new Error("level ".concat(t," not found, can not unlock"));e.levels[t].unlocked=!0;for(var n=[],i=0,r=Object.values(e.levels);i<r.length;i++){var c=r[i];c.unlocked&&n.push(c.name)}localStorage.setItem("unlockedLevels",n)},completeLevel:function(e,t){if(!(t in e.levels))throw new Error("level ".concat(t," not found, can not unlock"));e.levels[t].completed=!0;for(var n=[],i=0,r=Object.values(e.levels);i<r.length;i++){var c=r[i];c.completed&&n.push(c.name)}localStorage.setItem("completedLevels",n)}},getters:{},actions:{},modules:{}})),R=n("8103"),M=n.n(R),D=n("bba4"),E=n.n(D),N={STRT:{symbol:"○",description:"Initial position of the bird, bird starts going to the right.",execute:function(){}},FINI:{symbol:"◍",description:"Finishes this round",execute:function(e){e.finish()}},UPWD:{symbol:"▲",description:"Go UP",execute:function(e){e.bird.direction="up"}},DOWN:{symbol:"▼",description:"Go DOWN",execute:function(e){e.bird.direction="down"}},LEFT:{symbol:"◀",description:"Go LEFT",execute:function(e){e.bird.direction="left"}},RGHT:{symbol:"▶",description:"Go RIGHT",execute:function(e){e.bird.direction="right"}},REVR:{symbol:"↺",description:"Revert the direction of the bird",execute:function(e){var t={up:"down",left:"right",right:"left",down:"up"};e.bird.direction=t[e.bird.direction]},instructionClass:"B"},READ:{symbol:"⌬",description:"Read a number input onto the stack",execute:function(e){e.stack.push(Math.floor(10*Math.random()))},instructionClass:"C"},DUP1:{symbol:"ↀ",description:"Duplicate the last number on the stack",execute:function(e){if(e.stack.length<1)return e.dieBird();var t=e.stack.pop();e.stack.push(t),e.stack.push(t)},instructionClass:"D"},SWAP:{symbol:"⎌",description:"Swap the top two numbers on the stack",execute:function(e){if(e.stack.length<2)return e.dieBird();var t=e.stack.pop(),n=e.stack.pop();e.stack.push(t),e.stack.push(n)},instructionClass:"B"},YOLO:{symbol:"※",description:"Go into a random direction",execute:function(e){var t=["up","down","left","right"];e.bird.direction=t[Math.floor(4*Math.random())]},instructionClass:"D"},EMPT:{symbol:"⌿",description:"Check if the stack is empty",execute:function(e){e.stack.length>0?e.stack.push(0):e.stack.push(1)},instructionClass:"F"},VOID:{symbol:"⌽",description:"Clear the top item on the stack",execute:function(e){if(e.stack.length<1)return e.dieBird();e.stack.pop()},instructionClass:"F"},CLER:{symbol:"⌀",description:"Clear the stack",execute:function(e){e.stack=[]},instructionClass:"G"},SIZE:{symbol:"⍗",description:"Return the amount of items on the stack",execute:function(e){e.stack.push(e.stack.length)},instructionClass:"G"},PLUS:{symbol:"⊕",description:"Add the top two numbers on the stack",execute:function(e){if(e.stack.length<2)return e.dieBird();var t=e.stack.pop(),n=e.stack.pop();e.stack.push(n+t)},instructionClass:"B"},MINU:{symbol:"⊖",description:"Subtract the top item from the stack from the number below",execute:function(e){if(e.stack.length<2)return e.dieBird();var t=e.stack.pop(),n=e.stack.pop();e.stack.push(n-t)},instructionClass:"B"},SUMA:{symbol:"∑",description:"Sum all the items on the stack",execute:function(e){var t=0;while(e.stack.length>0)t+=e.stack.pop();e.stack.push(t)},instructionClass:"G"},BLCK:{symbol:"█",description:"Don't hit this block, it will kill you",execute:function(e){return e.dieBird()},instructionClass:"Z"},GEQ1:{symbol:"⌥",description:"Go right if the number is 1 or greater, if not, go down",execute:function(e){if(e.stack.length<1)return e.dieBird();var t=e.stack.pop();e.bird.direction=t<=0?"down":"right"},instructionClass:"C"}},P={},F=n("a065");F.keys().forEach((function(e){P[e.replace(/.json/,"").replace(/\.\//,"")]=F(e)}));var A="en";function U(e){return P[A][e]}for(var G=0,K=Object.entries(N);G<K.length;G++){var q=Object(i["a"])(K[G],2),W=q[0],_=q[1];_.name=W,T.commit("registerInstruction",_)}var Y=n("3d62");Y.keys().forEach((function(e){var t=Y(e),n=M()(E()(e.split("/").pop().replace(/\.\w+$/,"")));T.commit("registerLevelComponent",{levelName:n,levelComponent:Object(r["h"])(t.default||t)})}));var H=Object(r["b"])(S);H.mixin({methods:{$t:U}}),H.use(T).mount("#app")},"70d8":function(e,t,n){},"8c4c":function(e,t,n){"use strict";n("70d8")},"91ea":function(e,t,n){"use strict";n("a4d3"),n("e01a");var i=n("7a23"),r=n("50eb"),c=n.n(r),o=n("1d02"),s=n.n(o),a=Object(i["t"])("data-v-07983ca8");Object(i["l"])("data-v-07983ca8");var l={class:"instruction-grid-container"},u={class:"menu-container"},d=Object(i["f"])("h2",null,"Available Instruction Blocks",-1),b=Object(i["f"])("p",null,"Drag to the board below.",-1),f={key:1},p=Object(i["f"])("p",null,"To get started, hit STEP or PLAY in the menu.",-1),h={class:"stack"},v={key:0,src:c.a},O={key:1,src:s.a};Object(i["k"])();var j=a((function(e,t,n,r,c,o){var s=Object(i["o"])("InstructionList"),a=Object(i["o"])("Instruction");return Object(i["j"])(),Object(i["c"])("div",l,[Object(i["f"])("h2",null,Object(i["q"])(e.$t("menu")),1),Object(i["f"])("div",u,[Object(i["f"])("div",{onClick:t[1]||(t[1]=function(t){return e.$store.commit("openMenu")})},"BACK"),Object(i["f"])("div",{onClick:t[2]||(t[2]=function(){return o.clear&&o.clear.apply(o,arguments)})},"CLER"),Object(i["f"])("div",{onClick:t[3]||(t[3]=function(){return o.reset&&o.reset.apply(o,arguments)})},"RSET"),Object(i["f"])("div",{onClick:t[4]||(t[4]=function(e){return!c.birdIsMoving&&o.step()}),class:{disabled:c.birdIsMoving}},"STEP",2),Object(i["f"])("div",{onClick:t[5]||(t[5]=function(){return o.play&&o.play.apply(o,arguments)}),class:{disabled:c.playing}},"PLAY",2),Object(i["f"])("div",{onClick:t[6]||(t[6]=function(e){return c.playing=!1}),class:{disabled:!c.playing}},"STOP",2)]),d,b,Object(i["f"])(s,{draggable:"",unlockedOnly:""}),n.levelCode?(Object(i["j"])(),Object(i["c"])(i["a"],{key:0},[Object(i["f"])("h2",null,Object(i["q"])(o.levelDetails.component.displayName),1),Object(i["f"])("p",null,Object(i["q"])(o.levelDetails.component.description),1)],64)):(Object(i["j"])(),Object(i["c"])("h2",f,"Board")),p,Object(i["f"])("div",{class:"board",style:o.boardStyle},[(Object(i["j"])(!0),Object(i["c"])(i["a"],null,Object(i["n"])(n.cols,(function(e){return Object(i["j"])(),Object(i["c"])(i["a"],{key:e},[(Object(i["j"])(!0),Object(i["c"])(i["a"],null,Object(i["n"])(n.rows,(function(n){return Object(i["j"])(),Object(i["c"])("div",{key:n,class:"field",style:{"grid-column":e,"grid-row":n},onDrop:function(t){return o.drop(e,n,t)},onDragover:t[7]||(t[7]=function(){return o.allowDrop&&o.allowDrop.apply(o,arguments)})},null,44,["onDrop"])})),128))],64)})),128)),null!==c.bird.x&&null!==c.bird.y?(Object(i["j"])(),Object(i["c"])("div",{key:0,class:["field thebird",c.birdClasses],style:o.birdStyle},[Object(i["f"])("ul",h,[(Object(i["j"])(!0),Object(i["c"])(i["a"],null,Object(i["n"])(c.stack,(function(e,t){return Object(i["j"])(),Object(i["c"])("li",{key:t,class:"field-style-F"},Object(i["q"])(e),1)})),128))]),c.bird.flappingImage?(Object(i["j"])(),Object(i["c"])("img",v)):(Object(i["j"])(),Object(i["c"])("img",O))],6)):Object(i["d"])("",!0),(Object(i["j"])(!0),Object(i["c"])(i["a"],null,Object(i["n"])(o.boardObjects,(function(e,t){return Object(i["j"])(),Object(i["c"])(a,Object(i["i"])({key:t},e,{deleteMethod:function(){return o.deletePlacedInstruction(e)}}),null,16,["deleteMethod"])})),128))],4)])})),m=(n("99af"),n("a434"),n("b0c0"),n("a9e3"),n("d3b7"),n("b85c")),y=(n("96cf"),n("1da1")),g=n("5530"),k=n("5502"),L=n("0043"),x=n("2ed8"),I=100,w=function(e){return new Promise((function(t){return setTimeout(t,e)}))},C={name:"Board",props:{cols:Number,rows:Number,gridObjects:Array,finishLevel:Function,levelCode:String},components:{Instruction:L["a"],InstructionList:x["a"]},data:function(){return{birdIsMoving:!1,playing:!1,bird:{x:null,y:null,flappingImage:!0,direction:"right"},birdClasses:[],flappingInterval:null,placedObjects:[],stack:[]}},computed:Object(g["a"])(Object(g["a"])({},Object(k["b"])(["instructions"])),{},{boardStyle:function(){return{"grid-template-columns":"repeat(".concat(this.cols,", 107px)"),"grid-template-rows":"repeat(".concat(this.rows,", 107px)")}},birdStyle:function(){return{"grid-column":this.bird.x,"grid-row":this.bird.y,display:"grid"}},boardObjects:function(){return this.gridObjects.concat(this.placedObjects)},levelDetails:function(){return this.levelCode?this.$store.state.levels[this.levelCode]:{}}}),methods:{drop:function(e,t,n){n.preventDefault(),this.placedObjects.push(Object(g["a"])({x:e,y:t,userPlaced:!0},this.$store.state.instructions[n.dataTransfer.getData("text")])),this.saveBoardToLocalStorage()},allowDrop:function(e){e.preventDefault()},deletePlacedInstruction:function(e){this.placedObjects.splice(e),this.saveBoardToLocalStorage()},moveBird:function(){var e=this;return Object(y["a"])(regeneratorRuntime.mark((function t(){var n,r,c,o;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(e.birdIsMoving=!0,n=0,r=0,"up"!==e.bird.direction){t.next=7;break}r=-1,t.next=20;break;case 7:if("down"!==e.bird.direction){t.next=11;break}r=1,t.next=20;break;case 11:if("left"!==e.bird.direction){t.next=15;break}n=-1,t.next=20;break;case 15:if("right"!==e.bird.direction){t.next=19;break}n=1,t.next=20;break;case 19:throw new Error("invalid direction of bird ".concat(e.bird.direction));case 20:if(c=e.bird.x+n,o=e.bird.y+r,e.birdClasses.length=0,e.birdClasses.push(Object(i["r"])(e.bird.direction)),!(c<=0||o<=0||c>e.cols||o>e.rows)){t.next=29;break}return t.next=27,e.dieBird();case 27:t.next=33;break;case 29:return t.next=31,w(1*I);case 31:e.bird.x+=n,e.bird.y+=r;case 33:case"end":return t.stop()}}),t)})))()},dieBird:function(){var e=this;return Object(y["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return clearInterval(e.flappingInterval),t.next=3,w(.5*I);case 3:return e.birdClasses.push("dead"),t.next=6,w(4*I);case 6:e.reset();case 7:case"end":return t.stop()}}),t)})))()},finish:function(){this.finishLevel()},play:function(){var e=this;return Object(y["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:e.playing=!0;case 1:if(!e.playing){t.next=6;break}return t.next=4,e.step();case 4:t.next=1;break;case 6:case"end":return t.stop()}}),t)})))()},step:function(){var e=this;return Object(y["a"])(regeneratorRuntime.mark((function t(){var n,i,r,c,o,s,a;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(!e.birdIsMoving){t.next=3;break}return console.error("can not step while still stepping"),t.abrupt("return");case 3:if(e.birdIsMoving=!0,null!==e.bird.x&&null!==e.bird.y){t.next=10;break}n=Object(m["a"])(e.boardObjects);try{for(n.s();!(i=n.n()).done;)r=i.value,"STRT"===r.name&&(e.bird.x=r.x,e.bird.y=r.y)}catch(l){n.e(l)}finally{n.f()}e.flappingInterval=setInterval((function(){e.bird.flappingImage=!e.bird.flappingImage}),I),t.next=36;break;case 10:return t.next=12,e.moveBird();case 12:return t.next=14,w(1*I);case 14:c=null,o=Object(m["a"])(e.boardObjects),t.prev=16,o.s();case 18:if((s=o.n()).done){t.next=25;break}if(a=s.value,a.x!==e.bird.x||a.y!==e.bird.y){t.next=23;break}return c=a,t.abrupt("break",25);case 23:t.next=18;break;case 25:t.next=30;break;case 27:t.prev=27,t.t0=t["catch"](16),o.e(t.t0);case 30:return t.prev=30,o.f(),t.finish(30);case 33:if(!c){t.next=36;break}return t.next=36,c.execute(e);case 36:e.birdIsMoving=!1;case 37:case"end":return t.stop()}}),t,null,[[16,27,30,33]])})))()},reset:function(){this.birdIsMoving=!1,this.playing=!1,this.bird.x=null,this.bird.y=null,this.bird.flappingImage=!0,this.bird.direction="right",this.birdClasses=[],this.flappingInterval=null,this.stack=[],clearInterval(this.flappingInterval)},clear:function(){this.placedObjects=[],this.reset()},saveBoardToLocalStorage:function(){if(this.levelCode){var e,t=[],n=Object(m["a"])(this.placedObjects);try{for(n.s();!(e=n.n()).done;){var i=e.value;t.push({x:i.x,y:i.y,code:i.name})}}catch(r){n.e(r)}finally{n.f()}localStorage.setItem(this.levelCode,JSON.stringify(t))}}},mounted:function(){if(this.clear(),this.levelCode){var e,t=JSON.parse(localStorage.getItem(this.levelCode)||"[]"),n=Object(m["a"])(t);try{for(n.s();!(e=n.n()).done;){var i=e.value;this.placedObjects.push(Object(g["a"])({x:i.x,y:i.y,userPlaced:!0},this.$store.state.instructions[i.code]))}}catch(r){n.e(r)}finally{n.f()}}},beforeUnmount:function(){clearInterval(this.flappingInterval)}};n("11cc");C.render=j,C.__scopeId="data-v-07983ca8";t["a"]=C},9482:function(e,t,n){"use strict";n("a935")},9590:function(e,t,n){},a065:function(e,t,n){var i={"./en.json":"26d5"};function r(e){var t=c(e);return n(t)}function c(e){if(!n.o(i,e)){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}return i[e]}r.keys=function(){return Object.keys(i)},r.resolve=c,e.exports=r,r.id="a065"},a171:function(e,t,n){},a7b2:function(e,t,n){"use strict";n("0d5c")},a935:function(e,t,n){},c976:function(e,t,n){},d420:function(e,t,n){"use strict";n.r(t);n("b0c0");var i=n("7a23");function r(e,t,n,r,c,o){var s=Object(i["o"])("Board");return Object(i["j"])(),Object(i["c"])(s,{cols:7,rows:7,gridObjects:c.gridObjects,finishLevel:o.finishLevel,levelCode:e.$options.name},null,8,["gridObjects","finishLevel","levelCode"])}var c=n("5530"),o=n("91ea"),s={name:"Level0006",displayName:"Level 0006 - Survive The Maze",description:"Get your way around the maze",unlocksLevels:["Level0007"],unlocksInstructions:[],data:function(){return{gridObjects:[Object(c["a"])({x:1,y:1},this.$store.state.instructions["STRT"]),Object(c["a"])({x:1,y:2},this.$store.state.instructions["BLCK"]),Object(c["a"])({x:3,y:1},this.$store.state.instructions["BLCK"]),Object(c["a"])({x:3,y:2},this.$store.state.instructions["BLCK"]),Object(c["a"])({x:2,y:4},this.$store.state.instructions["BLCK"]),Object(c["a"])({x:3,y:4},this.$store.state.instructions["BLCK"]),Object(c["a"])({x:4,y:4},this.$store.state.instructions["BLCK"]),Object(c["a"])({x:5,y:4},this.$store.state.instructions["BLCK"]),Object(c["a"])({x:5,y:3},this.$store.state.instructions["BLCK"]),Object(c["a"])({x:5,y:2},this.$store.state.instructions["BLCK"]),Object(c["a"])({x:6,y:2},this.$store.state.instructions["BLCK"]),Object(c["a"])({x:7,y:4},this.$store.state.instructions["BLCK"]),Object(c["a"])({x:7,y:6},this.$store.state.instructions["BLCK"]),Object(c["a"])({x:6,y:6},this.$store.state.instructions["BLCK"]),Object(c["a"])({x:2,y:5},this.$store.state.instructions["BLCK"]),Object(c["a"])({x:4,y:7},this.$store.state.instructions["BLCK"]),Object(c["a"])({x:2,y:6},this.$store.state.instructions["BLCK"]),Object(c["a"])({x:5,y:5},this.$store.state.instructions["BLCK"]),Object(c["a"])({x:7,y:7},this.$store.state.instructions["FINI"])]}},components:{Board:o["a"]},methods:{finishLevel:function(){alert("For now, this is the end of stacky bird!")}}};s.render=r;t["default"]=s},ed49:function(e,t,n){"use strict";n.r(t);n("b0c0");var i=n("7a23");function r(e,t,n,r,c,o){var s=Object(i["o"])("Board");return Object(i["j"])(),Object(i["c"])(s,{cols:7,rows:7,gridObjects:c.gridObjects,finishLevel:o.finishLevel,levelCode:e.$options.name},null,8,["gridObjects","finishLevel","levelCode"])}var c=n("5530"),o=n("91ea"),s={name:"Level0004",displayName:"Level 0004 - Do The Work",description:"In this level we have to pick up some numbers and deliver them to the finish line",unlocksLevels:["Level0005"],unlocksInstructions:["READ"],data:function(){return{gridObjects:[Object(c["a"])({x:1,y:3},this.$store.state.instructions["STRT"]),Object(c["a"])({x:2,y:3},this.$store.state.instructions["READ"]),Object(c["a"])({x:7,y:7},this.$store.state.instructions["FINI"])]}},components:{Board:o["a"]},methods:{finishLevel:function(){this.$store.commit("unlockInstruction","READ"),this.$store.commit("completeLevel","Level0004"),this.$store.commit("unlockLevel","Level0005"),this.$store.commit("openMenu"),alert("you won")}}};s.render=r;t["default"]=s},f0ce:function(e,t,n){"use strict";n("9590")}});
//# sourceMappingURL=app.ae31b15e.js.map