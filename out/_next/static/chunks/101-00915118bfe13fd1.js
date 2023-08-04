"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[101],{62616:function(e,s,t){function i(e){let s=JSON.stringify(e,(e,s)=>"bigint"==typeof s?Number(s):s);window.sessionStorage.setItem("user",s)}function a(){let e=window.sessionStorage.getItem("user");return e?JSON.parse(e):{}}function l(){window.sessionStorage.setItem("user","")}t.d(s,{ds:function(){return i},p8:function(){return l},qj:function(){return a}})},50101:function(e,s,t){t.d(s,{x:function(){return O}});var i=t(85893),a=t(60155),l=t(51649),n=t(11163),r=t(2917),d=t(66835),c=t(94720),o=t(73804),x=t(79602),h=t(81997);let u=e=>{let{isBoard:s,isSavedPin:t}=e,{editModalOpen:a,setEditModalOpen:l}=(0,r.m)(),{setEditBoardModalOpen:u,setEditPinModalOpen:m,setDownloadPin:f,setEditProfileModalOpen:j}=(0,r.m)(),p=(0,n.useRouter)(),b=(0,c.p)();async function g(){await (0,x.zP)(),l(!1),v("Logged out successfully",""),p.push("/")}function v(e,s){b({position:"top",render:()=>(0,i.jsx)(h.F,{text:e,imageHash:s})})}return(0,i.jsx)(d.Z,{isOpen:a,isAlternative:!0,closeModal:()=>l(!1),title:s?"Board Options":"More Options",height:"h-[38%]",children:(0,i.jsx)(o.aV,{children:s||t?(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(o.HC,{onClick:function(){s?u(!0):t&&m(!0)},children:(0,i.jsx)("p",{className:"mb-4 text-lg font-bold",children:s?"Edit Board":"Edit Pin"})}),(0,i.jsx)(o.HC,{onClick:function(){s?v("Merge function doesn't exist yet"):t&&(f(!0),l(!1))},children:(0,i.jsx)("p",{className:"mb-4 text-lg font-bold",children:s?"Merge":"Download Image"})}),(0,i.jsx)(o.HC,{children:(0,i.jsx)("p",{className:"mb-4 text-lg font-bold",children:s?"Share":"Copy Link"})}),s&&(0,i.jsx)(o.HC,{children:(0,i.jsx)("p",{className:"mb-4 text-lg font-bold",children:"Archive"})})]}):(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(o.HC,{onClick:()=>j(!0),children:(0,i.jsx)("p",{className:"mb-4 text-lg font-bold",children:"Edit Profile"})}),(0,i.jsx)(o.HC,{onClick:g,children:(0,i.jsx)("p",{className:"mb-4 text-lg font-bold",children:"Logout"})}),(0,i.jsx)(o.HC,{children:(0,i.jsx)("p",{className:"mb-4 text-lg font-bold",children:"Copy profile link"})})]})})})};var m=t(67294),f=t(33090),j=t(57169),p=t(2),b=t(11978),g=t(71457),v=t(14225),N=t(97449),w=t(47296),y=t(69077);let C=e=>{let{isOpen:s,isBoard:t,closeModal:a,board:l,pin:d,isOwner:o,savedPinBoardId:x}=e,{setDeleteModalOpen:u,setEditBoardModalOpen:m,setLoadDeleteBoardTransaction:f,setDeletePinModalOpen:j,setEditPinModalOpen:p}=(0,r.m)(),b=(0,n.useRouter)(),C=(0,c.p)(),{data:z,status:A,writeAsync:S}=(0,y.GG)({address:"0x".concat("55706B2c62cbdda9317343A7290F0bD54e70cCf3"),abi:w.Mt,functionName:"deletePin"}),{data:k,status:D,writeAsync:B}=(0,y.GG)({address:"0x".concat("bb19cbB272cDb3867adAD194ACA58005D419306a"),abi:N.Mt,functionName:"deleteSavedPin"}),{data:H,status:P,writeAsync:F}=(0,y.GG)({address:"0x".concat("bb19cbB272cDb3867adAD194ACA58005D419306a"),abi:N.Mt,functionName:"deleteBoard"}),I=async()=>{l?(u(!1),m(!1),await F({args:[l.id]}),f(Number(l.id)),E("Board deleting..."),b.push("/profile")):E("Board not found.")},M=async()=>{d&&o?await S({args:[d.id]}).then(()=>{E("Pin deleting..."),j(!1),p(!1),b.back()}).catch(()=>{E("Transaction rejected"),j(!1),p(!1)}):d&&!o?await B({args:[d.id,x]}).then(()=>{E("Pin deleting..."),j(!1),p(!1),b.back()}).catch(()=>{E("Transaction rejected"),j(!1),p(!1)}):E("Pin not found.")};function E(e,s){C({position:"top",render:()=>(0,i.jsx)(h.F,{text:e,imageHash:s})})}return(0,i.jsx)("div",{className:"z-50",children:s&&(0,i.jsx)(g.Z,{action:a,children:(0,i.jsxs)("div",{className:"fixed bottom-0 left-0 right-0 p-4 bg-zinc-800 rounded-t-[40px] z-[14] h-[20%]",children:[(0,i.jsx)("div",{children:(0,i.jsx)("h2",{className:"text-xl text-white",children:t?"Delete this board and all of its Pins?":"Are you sure?"})}),(0,i.jsxs)("div",{className:"flex justify-evenly",children:[(0,i.jsx)(v.z,{colorScheme:"secondary",borderRadius:"50px",variant:"solid",onClick:a,children:"Cancel"}),(0,i.jsx)(v.z,{colorScheme:"primary",borderRadius:"50px",variant:"solid",onClick:t?()=>I():()=>M(),children:t?"Delete forever":"Delete"})]})]})})})};var z=t(79352),A=t(25675),S=t.n(A);let k=e=>{let{board:s,pins:t}=e,{editBoardModalOpen:l,setEditBoardModalOpen:n,deleteModalOpen:o,setDeleteModalOpen:x}=(0,r.m)(),[u,g]=(0,m.useState)(""),[v,w]=(0,m.useState)(""),[A,k]=(0,m.useState)(""),[D,B]=(0,m.useState)(!1),H=(0,c.p)(),{data:P,status:F,writeAsync:I}=(0,y.GG)({address:"0x".concat("bb19cbB272cDb3867adAD194ACA58005D419306a"),abi:N.Mt,functionName:"editBoard"});(0,m.useEffect)(()=>{if(s){var e,t;g(s.name),w(null!==(e=s.description)&&void 0!==e?e:""),k(null!==(t=s.boardCoverHash)&&void 0!==t?t:"")}},[s,l]);let M=async()=>{if(!u||v&&v.length>50){if(!u){E("Board Name is empty!","");return}v.length>50&&E("Description is longer than 50 Characters!","");return}await I({args:[null==s?void 0:s.id,u,v,A]}).then(()=>{n(!1),E(u+" editing...","")}).catch(e=>{n(!1),E("Transaction rejected")})};function E(e,s){H({position:"top",render:()=>(0,i.jsx)(h.F,{text:e,imageHash:s})})}return(0,i.jsxs)(i.Fragment,{children:[o&&(0,i.jsx)("div",{className:"absolute top-0 w-full h-full z-[12] bg-zinc-800 opacity-70"}),(0,i.jsxs)(d.Z,{isOpen:l,closeModal:()=>n(!1),title:"Edit Board",height:"h-[99%]",children:[(0,i.jsx)("div",{className:"absolute top-3 right-3",children:(0,i.jsx)("button",{className:"px-4 py-2 transition-colors text-white bg-red-600 disabled:!bg-transparent disabled:!text-gray-400 rounded-3xl",disabled:(null==u?void 0:u.length)===0,onClick:()=>M(),children:"Done"})}),(0,i.jsxs)("div",{className:"flex flex-col gap-4",children:[(0,i.jsxs)("div",{children:[(0,i.jsx)("p",{className:"mb-2",children:"Board cover"}),A?(0,i.jsxs)("div",{onClick:()=>B(!0),children:[(0,i.jsx)(S(),{src:"https://web3-pinterest.infura-ipfs.io/ipfs/".concat(A),className:"object-cover w-40 h-40 rounded-2xl",alt:"Board cover",width:100,height:100}),(0,i.jsx)(z.Yyj,{size:23,className:"absolute left-36 top-60",color:"white"})]}):(0,i.jsx)("div",{className:"flex items-center justify-center w-40 h-40 mt-2 border-2 border-white border-dashed rounded-3xl",onClick:()=>B(!0),children:(0,i.jsx)(a.xcL,{size:30})})]}),(0,i.jsxs)("div",{children:[(0,i.jsx)("p",{children:"Board name"}),(0,i.jsx)(f.I,{variant:"unstyled",placeholder:"Add",defaultValue:u,onChange:e=>g(e.target.value)})]}),(0,i.jsxs)("div",{children:[(0,i.jsx)("p",{children:"Description"}),(0,i.jsx)(j.g,{variant:"unstyled",placeholder:"Add what you board is about",size:"lg",defaultValue:v,onChange:e=>w(e.target.value)})]}),(0,i.jsxs)("div",{children:[(0,i.jsx)("p",{children:"Collaborators"}),(0,i.jsx)(f.I,{variant:"unstyled",placeholder:"Collaborators"})]}),(0,i.jsxs)("div",{children:[(0,i.jsx)("p",{children:"Settings"}),(0,i.jsxs)("div",{className:"flex flex-col justify-between item-center",children:[(0,i.jsxs)("div",{className:"flex flex-row",children:[(0,i.jsxs)("div",{children:[(0,i.jsx)("p",{className:"font-bold",children:"Make this board secret"}),(0,i.jsx)("p",{className:"text-gray-400 text-s",children:"Only you and collaborators will see this board"})]}),(0,i.jsx)("div",{className:"mt-1",children:(0,i.jsx)(p.r,{size:"md"})})]}),(0,i.jsxs)("div",{className:"flex flex-row",children:[(0,i.jsxs)("div",{children:[(0,i.jsx)("p",{className:"font-bold",children:"Personalisation"}),(0,i.jsx)("p",{className:"text-gray-400 text-s",children:"Show Pins inspired by this board in your home feed"})]}),(0,i.jsx)("div",{className:"mt-1",children:(0,i.jsx)(p.r,{size:"md"})})]})]})]}),(0,i.jsxs)("div",{children:[(0,i.jsx)("p",{children:"Actions"}),(0,i.jsx)("div",{className:"flex justify-between item-center",onClick:()=>x(!0),children:(0,i.jsxs)("div",{children:[(0,i.jsx)("p",{className:"font-bold",children:"Delete Board"}),(0,i.jsx)("p",{className:"text-gray-400 text-s",children:"Delete this board and all of its Pins forever. You can not undo this."})]})})]})]}),(0,i.jsxs)(b.M,{direction:"right",in:D,style:{zIndex:20},children:[(0,i.jsx)("div",{className:"fixed bottom-0 left-0 right-0 p-4 bg-zinc-800 rounded-t-[40px] h-full",children:(0,i.jsxs)("div",{className:"flex items-center gap-24",children:[(0,i.jsx)("button",{className:"text-white",onClick:()=>B(!1),children:(0,i.jsx)(a.dUf,{size:30})}),(0,i.jsx)("h2",{className:"text-base font-bold text-white",children:"Set Board Cover"})]})}),(0,i.jsx)("div",{className:"grid grid-cols-3 gap-2 px-4 relative top-[50px] mt-2",children:null==t?void 0:t.map(e=>(0,i.jsx)("div",{onClick:()=>{k(e.imageHash),B(!1)},children:(0,i.jsx)(S(),{src:"https://web3-pinterest.infura-ipfs.io/ipfs/".concat(e.imageHash),alt:e.title,className:"object-cover w-full rounded-2xl max-h-52",width:100,height:100})},e.id))})]})]}),(0,i.jsx)(C,{isOpen:o,closeModal:()=>x(!1),isBoard:!0,board:s})]})};var D=t(95410);let B=e=>{var s,t;let{pin:l}=e,{address:x,isConnected:u}=(0,y.mA)(),{allBoards:p,setAllBoards:g,editPinModalOpen:v,setEditPinModalOpen:z,deletePinModalOpen:A,setDeletePinModalOpen:k}=(0,r.m)(),[B,H]=(0,m.useState)(""),[P,F]=(0,m.useState)(""),[I,M]=(0,m.useState)(""),[E,G]=(0,m.useState)(""),[O,V]=(0,m.useState)(!1),T=(0,n.useRouter)(),[R,U]=(0,m.useState)(!1),[Z,q]=(0,m.useState)(null),L=(0,c.p)(),{data:Q,status:_,writeAsync:Y}=(0,y.GG)({address:"0x".concat("bb19cbB272cDb3867adAD194ACA58005D419306a"),abi:N.Mt,functionName:"editSavedPin"}),{data:J,status:W,writeAsync:K}=(0,y.GG)({address:"0x".concat("55706B2c62cbdda9317343A7290F0bD54e70cCf3"),abi:w.Mt,functionName:"editCreatedPin"});async function X(){if(!B||P&&P.length>50){if(!B){es("Title is empty!","");return}P&&P.length>50&&es("Description is longer than 50 Characters!","");return}l?await K({args:[l.id,B,P,""!=E?E:I]}).then(()=>{z(!1),es("Pin "+B+" editing...",""),G(""),""!=E&&T.push("/profile")}).catch(e=>{z(!1),es("Transaction rejected")}):es("Pin not found!")}(0,m.useEffect)(()=>{var e,s,t;let{boardId:i}=T.query;if(0===p.length){let e=(0,D.MR)();g(e)}if(l&&l.owner===x){if(V(!0),H(l.title),F(null!==(e=l.description)&&void 0!==e?e:""),M(Number(l.boardId)),l.boardId&&!E){let e=p.find(e=>e.id===Number(l.boardId));q(e)}}else if(V(!1),M(Number(i)),i&&!E){let e=p.find(e=>e.id===Number(i));q(e)}},[l,x,_,W,E,T.query]);let $=async()=>{l?""!==E&&await Y({args:[l.id,I,E]}).then(()=>{z(!1),es("Pin editing..."),G(""),T.push("/profile")}).catch(e=>{z(!1),es("Transaction rejected")}):es("Pin not found!")},ee=e=>{G(Number(e.id)),U(!1),q(e)};function es(e,s){L({position:"top",render:()=>(0,i.jsx)(h.F,{text:e,imageHash:s})})}return(0,i.jsxs)(i.Fragment,{children:[A&&(0,i.jsx)("div",{className:"absolute top-0 w-full h-full z-[12] bg-zinc-800 opacity-70"}),(0,i.jsxs)(d.Z,{isOpen:v,closeModal:()=>z(!1),title:"Edit Pin",height:"h-[99%]",children:[(0,i.jsx)("div",{className:"absolute top-3 right-3",children:(0,i.jsx)("button",{className:"px-4 py-2 transition-colors text-white bg-red-600 disabled:!bg-transparent disabled:!text-gray-400 rounded-3xl",disabled:O&&(null==B?void 0:B.length)===0||!O&&(""!==E?I===E:""===E),onClick:O?()=>X():()=>$(),children:"Done"})}),(0,i.jsxs)("div",{className:"flex flex-col gap-4",children:[(0,i.jsx)("div",{children:(0,i.jsx)(S(),{src:"https://web3-pinterest.infura-ipfs.io/ipfs/".concat(null==l?void 0:l.imageHash),alt:null!==(t=null==l?void 0:l.title)&&void 0!==t?t:"Pin Image",className:"object-cover m-auto w-80 h-80 rounded-2xl",width:100,height:100})}),O&&(0,i.jsxs)("div",{className:"flex flex-col mx-4",children:[(0,i.jsxs)("div",{className:"mt-4",children:[(0,i.jsx)("p",{className:"text-lg font-semibold",children:"Title"}),(0,i.jsx)(f.I,{variant:"unstyled",placeholder:"Add",defaultValue:B,size:"lg",onChange:e=>H(e.target.value)})]}),(0,i.jsxs)("div",{className:"mt-4",children:[(0,i.jsx)("p",{className:"text-lg font-semibold",children:"Description"}),(0,i.jsx)(j.g,{variant:"unstyled",placeholder:"Add what you board is about",size:"lg",defaultValue:P,onChange:e=>F(e.target.value)})]})]}),(0,i.jsx)("div",{className:"flex flex-col mx-4 mb-[-0.5rem]",children:(0,i.jsx)("p",{className:"text-sm font-semibold",children:"Board"})}),(0,i.jsx)("div",{className:"flex items-center mx-4 border-white",onClick:()=>U(!0),children:Z?(0,i.jsxs)(i.Fragment,{children:[""!=Z.boardCoverHash?(0,i.jsx)(S(),{className:"w-12 h-12 rounded-xl",src:"https://web3-pinterest.infura-ipfs.io/ipfs/".concat(Z.boardCoverHash),alt:"board",width:100,height:100}):(0,i.jsx)(i.Fragment,{children:(null===(s=Z.pins)||void 0===s?void 0:s.length)>0&&Z.pins[0].imageHash?(0,i.jsx)(S(),{className:"w-12 h-12 rounded-xl",src:"https://web3-pinterest.infura-ipfs.io/ipfs/".concat(Z.pins[0].imageHash),alt:"board",width:100,height:100}):(0,i.jsx)("div",{className:"w-12 h-12 bg-gray-200 rounded-xl"})}),(0,i.jsx)("h2",{className:"ml-4 text-lg font-bold",children:Z.name}),(0,i.jsx)(a.mzm,{size:30,className:"absolute right-5"})]}):(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)("div",{className:"w-12 h-12 bg-gray-200 rounded-xl"}),(0,i.jsx)("h2",{className:"ml-4 text-lg font-bold",children:"Choose Board"}),(0,i.jsx)(a.mzm,{size:30,className:"absolute right-5"})]})}),(0,i.jsx)("div",{className:"flex mt-6 ml-4",onClick:()=>k(!0),children:(0,i.jsx)("p",{className:"text-lg font-bold",children:"Delete this Pin"})})]}),(0,i.jsx)(b.M,{direction:"right",in:R,style:{zIndex:20},children:(0,i.jsxs)("div",{className:"fixed bottom-0 left-0 right-0 p-4 bg-zinc-800 rounded-t-[40px] z-10 h-full",children:[(0,i.jsx)("div",{className:"flex items-center justify-between gap-24 flex-cols",children:(0,i.jsx)("button",{className:"text-white",onClick:()=>U(!1),children:(0,i.jsx)(a.dUf,{size:30})})}),(0,i.jsx)("div",{className:"flex items-center gap-24 mt-4",children:(0,i.jsx)("h2",{className:"text-base text-white",children:"Your Boards"})}),(0,i.jsx)(o.aV,{children:p.map(e=>{var s;return(0,i.jsx)(o.HC,{onClick:()=>ee(e),children:(0,i.jsxs)("div",{className:"flex items-center h-16",children:[""!=e.boardCoverHash?(0,i.jsx)(S(),{className:"w-14 h-14 rounded-xl",src:"https://web3-pinterest.infura-ipfs.io/ipfs/".concat(e.boardCoverHash),alt:"board",width:100,height:100}):(0,i.jsx)(i.Fragment,{children:(null===(s=e.pins)||void 0===s?void 0:s.length)>0&&e.pins[0].imageHash?(0,i.jsx)(S(),{className:"w-14 h-14 rounded-xl",src:"https://web3-pinterest.infura-ipfs.io/ipfs/".concat(e.pins[0].imageHash),alt:"board",width:100,height:100}):(0,i.jsx)("div",{className:"bg-gray-200 w-14 h-14 rounded-xl"})}),(0,i.jsx)("div",{className:"justify-center ml-4",children:(0,i.jsx)("h2",{className:"text-lg font-bold",children:e.name})}),E&&E===Number(e.id)||!E&&Number(e.id)===I?(0,i.jsx)(a.VQF,{size:30,className:"absolute right-6"}):""]})},Number(e.id))})})]})})]}),(0,i.jsx)(C,{isOpen:A,closeModal:()=>k(!1),isBoard:!1,pin:l,isOwner:O,savedPinBoardId:I})]})},H=()=>{let{filterBoardModalOpen:e,setFilterBoardModalOpen:s,boardView:t,setBoardView:l}=(0,r.m)();function n(e){l(e),s(!1)}return(0,i.jsx)(d.Z,{modalId:"filter-board-modal",isOpen:e,closeModal:()=>s(!1),title:"Set view as",height:"h-[30%]",children:(0,i.jsxs)(o.aV,{children:[(0,i.jsxs)(o.HC,{className:"flex flex-row justify-between",onClick:()=>n("wide"),children:[(0,i.jsx)("p",{className:"mb-4 text-lg font-bold",children:"Wide"}),"wide"===t&&(0,i.jsx)(a.VQF,{size:30})]}),(0,i.jsxs)(o.HC,{className:"flex flex-row justify-between",onClick:()=>n("default"),children:[(0,i.jsx)("p",{className:"mb-4 text-lg font-bold",children:"Default"}),"default"===t&&(0,i.jsx)(a.VQF,{size:30})]}),(0,i.jsxs)(o.HC,{className:"flex flex-row justify-between",onClick:()=>n("compact"),children:[(0,i.jsx)("p",{className:"mb-4 text-lg font-bold",children:"Compact"}),"compact"===t&&(0,i.jsx)(a.VQF,{size:30})]})]})})};var P=t(80549),F=t(8193),I=t(98531);let M=e=>{let{isOpen:s,closeModal:t,handleDeleteProfile:a}=e;return(0,i.jsx)(i.Fragment,{children:s&&(0,i.jsx)(g.Z,{action:t,children:(0,i.jsxs)("div",{className:"fixed bottom-0 left-0 right-0 p-4 bg-zinc-800 rounded-t-[40px] z-[18] h-[20%]",children:[(0,i.jsx)("div",{children:(0,i.jsx)("h2",{className:"text-xl text-white",children:"Are you sure?"})}),(0,i.jsxs)("div",{className:"flex justify-evenly",children:[(0,i.jsx)(v.z,{colorScheme:"secondary",borderRadius:"50px",variant:"solid",onClick:t,children:"Cancel"}),(0,i.jsx)(v.z,{colorScheme:"primary",borderRadius:"50px",variant:"solid",onClick:a,children:"Delete"})]})]})})})};var E=t(62616);let G=()=>{let{user:e,setUser:s,editProfileModalOpen:t,setEditProfileModalOpen:l,deleteProfile:o,setDeleteProfile:x}=(0,r.m)(),{address:u}=(0,y.mA)(),[p,b]=(0,m.useState)(!1),[g,v]=(0,m.useState)(""),[C,z]=(0,m.useState)(""),[A,k]=(0,m.useState)(""),[D,B]=(0,m.useState)(""),[H,G]=(0,m.useState)(!1),[O,V]=(0,m.useState)(!1),T=(0,P.g)(),R=(0,c.p)();(0,n.useRouter)();let{data:U,status:Z,writeAsync:q}=(0,y.GG)({address:"0x".concat("9ff82F92B2D3859278EedE1C5e2BF04a9b0E80e9"),abi:I.Mt,functionName:"editUser",onSuccess(){ei("Profile edited!","")}}),{data:L,status:Q,writeAsync:_}=(0,y.GG)({address:"0x".concat("9ff82F92B2D3859278EedE1C5e2BF04a9b0E80e9"),abi:I.Mt,functionName:"deleteUser"}),{data:Y,status:J,writeAsync:W}=(0,y.GG)({address:"0x".concat("bb19cbB272cDb3867adAD194ACA58005D419306a"),abi:N.Mt,functionName:"deleteAllBoardsFromUser"}),{data:K,status:X,writeAsync:$}=(0,y.GG)({address:"0x".concat("55706B2c62cbdda9317343A7290F0bD54e70cCf3"),abi:w.Mt,functionName:"deleteAllPinsFromUser"});(0,m.useEffect)(()=>{e||s((0,E.qj)()),g||C||A||D?b(!0):b(!1)},[e,g,C,A,D]);let ee=async()=>{if(p){if(C.length>300){ei("Bio must be less than 300 characters","");return}if(e){var t,i,a,n,r,d;let c=null!==(i=null!==(t=e.userAddress)&&void 0!==t?t:u)&&void 0!==i?i:"",o=""!=g?g:null!==(a=e.name)&&void 0!==a?a:"",x=""!=C?C:null!==(n=e.bio)&&void 0!==n?n:"",h=""!=A?A.replace(/\s/g,""):null!==(r=e.username)&&void 0!==r?r:"",m=""!=D?D:null!==(d=e.profileImageHash)&&void 0!==d?d:"";ei("Profile editing...",""),await q({args:[e.id,o,h,m,x]}).then(()=>{var t,i,a,n;e&&s({id:e.id,userAddress:c,name:o,username:h,profileImageHash:m,bio:x,followers:null!==(t=e.followers)&&void 0!==t?t:[],following:null!==(i=e.following)&&void 0!==i?i:[]}),e&&(0,E.ds)({id:e.id,userAddress:c,name:o,username:h,profileImageHash:m,bio:x,followers:null!==(a=e.followers)&&void 0!==a?a:[],following:null!==(n=e.following)&&void 0!==n?n:[]}),l(!1)}).catch(e=>{l(!1),ei("Transaction rejected")})}else ei("User not found")}},es=async e=>{if(!e)return;G(!0);let s=await T.add(e);G(!1),B(s.path)},et=async()=>{V(!1),l(!1),e?(await W().then(()=>{ei("Boards from Profile deleting...","")}).catch(e=>{ei("Transaction rejected")}),await $().then(()=>{ei("Pins from Profile deleting...","")}).catch(e=>{ei("Transaction rejected")}),await _({args:[e.id]}).then(()=>{ei("Profile deleting...",""),x(e.userAddress)}).catch(e=>{ei("Transaction rejected")})):ei("User not found","")};function ei(e,s){R({position:"top",render:()=>(0,i.jsx)(h.F,{text:e,imageHash:s})})}return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsxs)(d.Z,{isOpen:t,closeModal:function(){l(!1),v(""),z(""),k(""),B("")},title:"Edit Profile",height:"h-[99%]",children:[(0,i.jsx)("div",{className:"absolute top-3 right-3",children:(0,i.jsx)("button",{className:"px-4 py-2 transition-colors text-white bg-red-600 disabled:!bg-transparent disabled:!text-gray-400 rounded-3xl",disabled:!p,onClick:()=>ee(),children:"Done"})}),(0,i.jsxs)("div",{className:"flex flex-col gap-4",children:[(0,i.jsx)("div",{children:(null==e?void 0:e.profileImageHash)||D?(0,i.jsxs)("div",{className:"flex flex-col items-center ",children:[(0,i.jsx)(S(),{src:"https://web3-pinterest.infura-ipfs.io/ipfs/".concat(!D&&(null==e?void 0:e.profileImageHash)?null==e?void 0:e.profileImageHash:D),className:"object-cover w-40 h-40 rounded-full",alt:"Profile Image",width:100,height:100}),(0,i.jsxs)("div",{children:[(0,i.jsx)("button",{className:"w-20 px-4 py-2 mt-4 text-white transition-colors bg-gray-500 rounded-2xl",children:"Edit"}),(0,i.jsx)(f.I,{type:"file",height:"60px",width:"120px",position:"absolute",left:"33%",top:"30%",opacity:"0","aria-hidden":"true",accept:"image/*",onChange:e=>es(e.target.files?e.target.files[0]:null)})]})]}):(0,i.jsx)("div",{className:"flex items-center justify-center w-40 h-40 m-auto mt-4 mb-6 border-2 border-white border-dashed rounded-full",children:H?(0,i.jsx)("div",{className:"flex flex-col items-center m-auto",children:(0,i.jsx)(F.xz6,{size:40,className:"animate-spin"})}):(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(a.xcL,{size:30}),(0,i.jsx)(f.I,{type:"file",height:"180px",width:"180px",position:"absolute",top:"10%",left:"30%",opacity:"0","aria-hidden":"true",accept:"image/*",onChange:e=>es(e.target.files?e.target.files[0]:null)})]})})}),(0,i.jsxs)("div",{className:"mt-4 mb-2",children:[(0,i.jsx)("p",{className:"text-lg",children:"Username"}),(0,i.jsx)(f.I,{variant:"unstyled",placeholder:"Enter your name",fontSize:"lg",defaultValue:!A&&(null==e?void 0:e.username)?e.username:A,onChange:e=>k(e.target.value)})]}),(0,i.jsxs)("div",{className:"mb-2",children:[(0,i.jsx)("p",{className:"text-lg",children:"Name"}),(0,i.jsx)(f.I,{variant:"unstyled",placeholder:"Enter your name",fontSize:"lg",defaultValue:!g&&(null==e?void 0:e.name)?e.name:g,onChange:e=>v(e.target.value)})]}),(0,i.jsxs)("div",{children:[(0,i.jsx)("p",{className:"text-lg",children:"About"}),(0,i.jsx)(j.g,{variant:"unstyled",placeholder:"Tell your story",size:"lg",defaultValue:!C&&(null==e?void 0:e.bio)?e.bio:C,fontSize:"lg",onChange:e=>z(e.target.value)})]})]}),(0,i.jsx)("div",{className:"flex justify-center mt-40",children:(0,i.jsx)("button",{className:"px-4 py-2 text-white transition-colors bg-gray-600 rounded-3xl",onClick:()=>V(!0),children:"Delete Profile"})})]}),(0,i.jsx)(M,{isOpen:O,closeModal:()=>V(!1),handleDeleteProfile:et})]})},O=e=>{let{isBoard:s,isSavedPin:t,isProfile:d,title:c,showTitle:o,board:x,pin:h,hideBackButton:f,pins:j}=e,{setEditModalOpen:p,setFilterBoardModalOpen:b,createPinModalOpen:g}=(0,r.m)(),[v,N]=(0,m.useState)(!1),w=(0,n.useRouter)();return(0,m.useEffect)(()=>{c&&c.length>17&&N(!0)},[c]),(0,i.jsxs)(i.Fragment,{children:[(0,i.jsxs)("div",{className:"fixed inset-x-0 top-0 grid grid-cols-3 ".concat(s?"bg-black":"bg-transparent"," h-[50px] pt-3 px-2 z-10"),children:[!f&&(0,i.jsx)("div",{className:"text-2xl ".concat(s?"":"pt-[0.5rem] pr-[0.5rem]"),onClick:()=>g?null:w.back(),children:!g&&(0,i.jsx)(a.dUf,{})}),f&&(0,i.jsx)("div",{}),(0,i.jsx)("div",{className:"text-center ".concat(v?"mt-[-0.5rem]":""),children:o&&c?c:""}),(0,i.jsxs)("div",{className:"flex justify-end gap-6 ".concat(s?"":"pt-[0.5rem] pr-[0.5rem]"," "),children:[s&&(0,i.jsx)("div",{className:"text-2xl",onClick:()=>g?null:b(!0),children:!g&&(0,i.jsx)(a.FpS,{})}),(0,i.jsx)("div",{className:"text-2xl",onClick:()=>g?null:p(!0),children:!g&&(s||t||d)&&(0,i.jsx)(l.mZq,{})})]})]}),(0,i.jsx)(u,{isBoard:s,isSavedPin:t}),(0,i.jsx)(k,{board:null!=x?x:null,pins:null!=j?j:null}),(0,i.jsx)(B,{pin:null!=h?h:null}),(0,i.jsx)(H,{}),(0,i.jsx)(G,{})]})}}}]);