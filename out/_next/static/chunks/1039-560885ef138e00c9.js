"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[1039],{51039:function(e,s,t){t.d(s,{w:function(){return C}});var i=t(85893),l=t(41664),a=t.n(l),n=t(11163),r=t(60155),c=t(67294),d=t(66835),o=t(2917),x=t(94720),h=t(33090),m=t(57169),u=t(2),j=t(97449),f=t(69077),p=t(81997);let g=()=>{let{createBoardModalOpen:e,setCreateBoardModalOpen:s}=(0,o.m)(),{setLoadCreateBoardTransaction:t}=(0,o.m)(),[l,a]=(0,c.useState)(""),[r,g]=(0,c.useState)(""),b=(0,n.useRouter)(),v=(0,x.p)(),{data:N,status:y,writeAsync:w}=(0,f.GG)({address:"0x".concat("bb19cbB272cDb3867adAD194ACA58005D419306a"),abi:j.Mt,functionName:"createBoard"});(0,c.useEffect)(()=>{a(""),g("")},[e]);let C=async()=>{if(!l||r&&r.length>50){if(!l){z("Board Name ist empty!","");return}r.length>50&&z("Description is longer than 50 Characters!","");return}await w({args:[l,r]}).then(()=>{s(!1),window.location.href.includes("profile")||b.push("/profile"),t(!0)}).catch(e=>{s(!1),z("Transaction rejected")})};function z(e,s){v({position:"top",render:()=>(0,i.jsx)(p.F,{text:e,imageHash:s})})}return(0,i.jsxs)(d.Z,{isOpen:e,closeModal:()=>s(!1),title:"Add new Board",height:"h-[95%]",children:[(0,i.jsx)("div",{className:"absolute top-3 right-3",children:(0,i.jsx)("button",{className:"px-4 py-2 transition-colors text-white bg-red-600 disabled:!bg-transparent disabled:!text-gray-400 rounded-3xl",disabled:(null==l?void 0:l.length)===0,onClick:()=>C(),children:"Create"})}),(0,i.jsxs)("div",{className:"flex flex-col gap-4",children:[(0,i.jsxs)("div",{children:[(0,i.jsx)("p",{children:"Board Name"}),(0,i.jsx)(h.I,{variant:"unstyled",placeholder:"Add",defaultValue:l,onChange:e=>a(e.target.value)})]}),(0,i.jsxs)("div",{children:[(0,i.jsx)("p",{children:"Board Description"}),(0,i.jsx)(m.g,{variant:"unstyled",placeholder:"Add what you board is about",size:"lg",defaultValue:r,onChange:e=>g(e.target.value)})]}),(0,i.jsxs)("div",{children:[(0,i.jsx)("p",{children:"Collaborators"}),(0,i.jsx)(h.I,{variant:"unstyled",placeholder:"Collaborators"})]}),(0,i.jsxs)("div",{children:[(0,i.jsx)("p",{children:"Privacy"}),(0,i.jsxs)("div",{className:"flex justify-between item-center",children:[(0,i.jsxs)("div",{children:[(0,i.jsx)("p",{className:"font-bold",children:"Make this board secret"}),(0,i.jsx)("p",{className:"text-gray-400 text-s",children:"Only you and collaborators will see this board"})]}),(0,i.jsx)("div",{className:"mt-1",children:(0,i.jsx)(u.r,{size:"md"})})]})]})]})]})};var b=t(39119),v=t(63750),N=t(5434),y=t(69274);let w=()=>{let{setCreateBoardModalOpen:e,navbarModalOpen:s,setNavbarModalOpen:t,setCreatePinModalOpen:l}=(0,o.m)();return(0,i.jsx)(d.Z,{isOpen:s,closeModal:()=>t(!1),title:"Start creating now",height:"h-[22%]",children:(0,i.jsxs)("div",{className:"flex justify-evenly",children:[(0,i.jsxs)("div",{className:"flex flex-col items-center justify-center",children:[(0,i.jsx)("div",{className:"flex items-center justify-center w-16 h-16 bg-[#7f7d82] rounded-xl",children:(0,i.jsx)(y.irL,{size:30})}),(0,i.jsx)("div",{className:"mt-2 text-sm text-white",children:"Idea Pin"})]}),(0,i.jsxs)("div",{className:"flex flex-col items-center justify-center",onClick:()=>l(!0),children:[(0,i.jsx)("div",{className:"flex items-center justify-center w-16 h-16 m-auto bg-[#7f7d82] rounded-xl",children:(0,i.jsx)(v.nAq,{size:30})}),(0,i.jsx)("div",{className:"mt-2 text-sm text-white ",children:"Pin"})]}),(0,i.jsxs)("div",{className:"flex flex-col items-center justify-center",onClick:()=>e(!0),children:[(0,i.jsx)("div",{className:"flex items-center justify-center w-16 h-16 bg-[#7f7d82] fflex rounded-xl",children:(0,i.jsx)(N.v6F,{size:30})}),(0,i.jsx)("div",{className:"mt-2 text-sm text-white",children:"Board"})]})]})})},C=()=>{let{setNavbarModalOpen:e,loadDeleteBoardTransaction:s,navbarModalOpen:t}=(0,o.m)(),l=(0,n.useRouter)();return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsxs)("div",{className:"fixed inset-x-0 bottom-0 flex justify-between bg-black ".concat(s?"z-20":""),children:[(0,i.jsx)(a(),{href:"/home",className:"flex justify-center w-full px-3 py-5 ml-10 align-center",children:(0,i.jsx)("div",{className:"text-2xl",children:(0,i.jsx)(r.wB6,{size:25,color:"/home"===l.pathname?"white":"grey"})})}),(0,i.jsx)(a(),{href:"/search",className:"flex justify-center w-full px-3 py-5 align-center",children:(0,i.jsx)("div",{className:"text-2xl",children:(0,i.jsx)(r.eaK,{size:25,color:""===l.pathname?"white":"grey"})})}),(0,i.jsx)(a(),{href:"",className:"flex justify-center w-full px-3 py-5 align-center",onClick:()=>e(!0),children:(0,i.jsx)("div",{className:"text-2xl",children:(0,i.jsx)(r.xcL,{size:30,color:t?"white":"grey"})})}),(0,i.jsx)(a(),{href:"",className:"flex justify-center w-full px-3 py-5 align-center",children:(0,i.jsx)("div",{className:"text-2xl",children:(0,i.jsx)(r.jJE,{size:25,color:""===l.pathname?"white":"grey"})})}),(0,i.jsx)(a(),{href:"/profile",className:"flex justify-center w-full px-3 py-5 mr-10 align-center",children:(0,i.jsx)("div",{className:"text-2xl",children:(0,i.jsx)(r.zZ9,{size:26,color:"/profile"===l.pathname?"white":"grey"})})})]}),(0,i.jsx)(w,{}),(0,i.jsx)(g,{}),(0,i.jsx)(b.Z,{})]})}},39119:function(e,s,t){t.d(s,{Z:function(){return A}});var i=t(85893),l=t(67294),a=t(66835),n=t(2917),r=t(94720),c=t(33090),d=t(57169),o=t(11978),x=t(73804),h=t(47296),m=t(69077),u=t(80549),j=t(22338),f=t(61329),p=t(57747),g=t(55281),b=t(17745),v=t(60155),N=t(8193);function y(e){let{handleUpload:s,isLoading:t}=e;return(0,i.jsx)(j.W,{children:(0,i.jsx)(f.o,{width:"50",ratio:1,children:(0,i.jsx)(p.xu,{borderColor:"gray.300",borderStyle:"dashed",borderWidth:"2px",rounded:"md",shadow:"sm",role:"group",transition:"all 150ms ease-in-out",_hover:{shadow:"md"},as:b.E.div,initial:"rest",animate:"rest",whileHover:"hover",children:(0,i.jsxs)(p.xu,{position:"relative",height:"100%",width:"100%",children:[(0,i.jsx)(p.xu,{position:"absolute",top:"0",left:"0",height:"100%",width:"100%",display:"flex",flexDirection:"column",children:(0,i.jsxs)(g.K,{height:"100%",width:"100%",display:"flex",alignItems:"center",justify:"center",spacing:"4",children:[(0,i.jsx)(p.xu,{height:"12",width:"12",position:"relative"}),t?(0,i.jsxs)("div",{className:"flex flex-col items-center m-auto",children:[(0,i.jsx)(N.xz6,{size:50,className:"animate-spin"}),(0,i.jsx)("h2",{className:"mt-4 text-lg font-bold",children:"Uploading..."})]}):(0,i.jsxs)("div",{className:"flex flex-col items-center m-auto",children:[(0,i.jsx)(v.v8B,{size:50,className:"animate-bounce"}),(0,i.jsx)("h2",{className:"mt-4 text-base",children:"Upload Image here"})]})]})}),(0,i.jsx)(c.I,{type:"file",height:"100%",width:"100%",position:"absolute",top:"0",left:"0",opacity:"0","aria-hidden":"true",accept:"image/*",onChange:e=>s(e.target.files?e.target.files[0]:null)})]})})})})}var w=t(95410),C=t(81997),z=t(25675),k=t.n(z);let B=e=>{let{boardId:s}=e,[t,j]=(0,l.useState)(""),[f,p]=(0,l.useState)(""),[g,b]=(0,l.useState)(0),[N,z]=(0,l.useState)(""),{allBoards:B,setAllBoards:A,createPinModalOpen:S,setCreatePinModalOpen:I,createdPin:D,setCreatedPin:F}=(0,n.m)(),H=(0,u.g)(),P=(0,r.p)(),[M,E]=(0,l.useState)(!1),[T,V]=(0,l.useState)(!1),{data:Z,status:G,writeAsync:_}=(0,m.GG)({address:"0x".concat("55706B2c62cbdda9317343A7290F0bD54e70cCf3"),abi:h.Mt,functionName:"createPin"});(0,l.useEffect)(()=>{if(0===B.length){let e=(0,w.MR)();A(e)}},[B.length]);let O=async()=>{let e=s||g;if(!t||f&&f.length>50||!N||!e){if(!t){K("Title is empty!","");return}if(!N){K("Image is empty!","");return}if(f&&f.length>50){K("Description is longer than 50 Characters!","");return}e||K("No Board selected!","");return}await _({args:[t,f,N,e]}).then(()=>{I(!1),V(!1);let s=B.find(s=>s.id===Number(e));s&&F({boardName:s.name,imageHash:N}),U(),P({position:"top",render:()=>(0,i.jsx)(C.F,{text:"The Pin is being created..."})})}).catch(e=>{I(!1),V(!1),U(),K("Transaction rejected")})};function U(){j(""),p(""),b(0),z("")}let L=async e=>{if(!e)return;E(!0);let s=await H.add(e);E(!1),z(s.path)},R=()=>{I(!1),V(!1),U()};function K(e,s){P({position:"top",render:()=>(0,i.jsx)(C.F,{text:e,imageHash:s})})}return(0,i.jsx)(i.Fragment,{children:(0,i.jsxs)(a.Z,{isOpen:S,closeModal:()=>R(),title:"Add new Pin",height:"h-[95%]",children:[(0,i.jsx)("div",{className:"absolute top-3 right-3",children:s?(0,i.jsx)("button",{className:"px-4 py-2 text-white transition-colors bg-red-600 rounded-3xl",onClick:O,children:"Create"}):(0,i.jsx)("button",{className:"px-4 py-2 text-white transition-colors bg-red-600 rounded-3xl",onClick:()=>V(!0),children:"Next"})}),(0,i.jsxs)("div",{className:"flex flex-col gap-4",children:[N?(0,i.jsx)(k(),{src:"https://web3-pinterest.infura-ipfs.io/ipfs/".concat(N),className:"object-cover m-auto w-80 h-80 rounded-2xl",alt:"Pin Image",width:100,height:100}):(0,i.jsx)(y,{handleUpload:L,isLoading:M}),(0,i.jsxs)("div",{className:"flex flex-col mx-4",children:[(0,i.jsxs)("div",{className:"mt-4",children:[(0,i.jsx)("p",{className:"text-lg font-semibold",children:"Title"}),(0,i.jsx)(c.I,{variant:"unstyled",placeholder:"Give your Pin a Title",size:"lg",defaultValue:t,onChange:e=>j(e.target.value)})]}),(0,i.jsxs)("div",{className:"mt-6",children:[(0,i.jsx)("p",{className:"text-lg font-semibold",children:"Description"}),(0,i.jsx)(d.g,{variant:"unstyled",placeholder:"Say more about this Pin",size:"lg",defaultValue:f,onChange:e=>p(e.target.value)})]})]})]}),!s&&(0,i.jsx)(o.M,{direction:"right",in:T,style:{zIndex:20},children:(0,i.jsxs)("div",{className:"fixed bottom-0 left-0 right-0 p-4 bg-zinc-800 rounded-t-[40px] z-10 h-full",children:[(0,i.jsxs)("div",{className:"flex items-center justify-between gap-24 flex-cols",children:[(0,i.jsx)("button",{className:"text-white",onClick:()=>V(!1),children:(0,i.jsx)(v.dUf,{size:30})}),(0,i.jsx)("button",{className:"px-4 py-2 text-white transition-colors bg-red-600 rounded-3xl",onClick:O,children:"Create"})]}),(0,i.jsx)("div",{className:"flex items-center gap-24 mt-4",children:(0,i.jsx)("h2",{className:"text-base text-white",children:"Your Boards"})}),(0,i.jsx)(x.aV,{children:B.map(e=>{var s;return(0,i.jsx)(x.HC,{onClick:()=>b(Number(e.id)),children:(0,i.jsxs)("div",{className:"flex items-center h-16",children:[""!=e.boardCoverHash?(0,i.jsx)(k(),{className:"w-14 h-14 rounded-xl",src:"https://web3-pinterest.infura-ipfs.io/ipfs/".concat(e.boardCoverHash),alt:"board",width:100,height:100}):(0,i.jsx)(i.Fragment,{children:(null===(s=e.pins)||void 0===s?void 0:s.length)>0&&e.pins[0].imageHash?(0,i.jsx)(k(),{className:"w-14 h-14 rounded-xl",src:"https://web3-pinterest.infura-ipfs.io/ipfs/".concat(e.pins[0].imageHash),alt:"board",width:100,height:100}):(0,i.jsx)("div",{className:"bg-gray-200 w-14 h-14 rounded-xl"})}),(0,i.jsx)("div",{className:"justify-center ml-4",children:(0,i.jsx)("h2",{className:"text-lg font-bold",children:e.name})}),e.id===g&&(0,i.jsx)(v.VQF,{size:30,className:"absolute right-6"})]})},Number(e.id))})})]})})]})})};var A=B}}]);