_N_E=(window.webpackJsonp_N_E=window.webpackJsonp_N_E||[]).push([[12],{"/a9y":function(e,t,n){"use strict";var r=n("lwsE"),i=n("W8MJ"),l=n("7W2i"),a=n("a1gu"),o=n("Nsbk");function s(e){var t=function(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=o(e);if(t){var i=o(this).constructor;n=Reflect.construct(r,arguments,i)}else n=r.apply(this,arguments);return a(this,n)}}var c=n("TqRt");t.__esModule=!0,t.default=void 0;var u=c(n("q1tI")),d=c(n("8Kt/")),f={400:"Bad Request",404:"This page could not be found",405:"Method Not Allowed",500:"Internal Server Error"};function h(e){var t=e.res,n=e.err;return{statusCode:t&&t.statusCode?t.statusCode:n?n.statusCode:404}}var p=function(e){l(n,e);var t=s(n);function n(){return r(this,n),t.apply(this,arguments)}return i(n,[{key:"render",value:function(){var e=this.props.statusCode,t=this.props.title||f[e]||"An unexpected error has occurred";return u.default.createElement("div",{style:g.error},u.default.createElement(d.default,null,u.default.createElement("title",null,e,": ",t)),u.default.createElement("div",null,u.default.createElement("style",{dangerouslySetInnerHTML:{__html:"body { margin: 0 }"}}),e?u.default.createElement("h1",{style:g.h1},e):null,u.default.createElement("div",{style:g.desc},u.default.createElement("h2",{style:g.h2},t,"."))))}}]),n}(u.default.Component);t.default=p,p.displayName="ErrorPage",p.getInitialProps=h,p.origGetInitialProps=h;var g={error:{color:"#000",background:"#fff",fontFamily:'-apple-system, BlinkMacSystemFont, Roboto, "Segoe UI", "Fira Sans", Avenir, "Helvetica Neue", "Lucida Grande", sans-serif',height:"100vh",textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"},desc:{display:"inline-block",textAlign:"left",lineHeight:"49px",height:"49px",verticalAlign:"middle"},h1:{display:"inline-block",borderRight:"1px solid rgba(0, 0, 0,.3)",margin:0,marginRight:"20px",padding:"10px 23px 10px 0",fontSize:"24px",fontWeight:500,verticalAlign:"top"},h2:{fontSize:"14px",fontWeight:"normal",lineHeight:"inherit",margin:0,padding:0}}},"2/nU":function(e,t,n){"use strict";n.r(t),n.d(t,"__N_SSG",(function(){return d}));var r=n("nKUr"),i=n("g4pe"),l=n.n(i),a=n("20a2"),o=n("eomm"),s=n.n(o),c=(n("q1tI"),n("aQu0")),u=n("Ydd2"),d=!0;t.default=function(e){var t=e.post,n=e.allPosts,i=Object(a.useRouter)();return i.isFallback||null!==t&&void 0!==t&&t.slug?Object(r.jsx)("div",{children:Object(r.jsx)(u.a,{allPosts:n,children:i.isFallback?Object(r.jsx)(c.a,{as:"h1",children:"Loading..."}):Object(r.jsxs)(r.Fragment,{children:[Object(r.jsxs)(l.a,{children:[Object(r.jsxs)("title",{children:["Star Trek: Legends Wiki - ",t.title]}),Object(r.jsx)("link",{rel:"icon",href:"/favicon.ico"})]}),Object(r.jsx)(c.a,{as:"h1",children:t.title}),Object(r.jsx)("div",{dangerouslySetInnerHTML:{__html:t.content}})]})})}):Object(r.jsx)(s.a,{statusCode:404})}},eomm:function(e,t,n){e.exports=n("/a9y")},kno2:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/wiki/[slug]",function(){return n("2/nU")}])}},[["kno2",0,2,1,3]]]);