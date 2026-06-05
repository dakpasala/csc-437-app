import{c as l,g as h,h as i,s as m,d as c,a as v}from"./view-lW8DKznB.js";class w extends HTMLElement{constructor(){var s;super(),this.viewModel=l({username:"",password:"",error:void 0}).with(h(this),"username","password"),this.view=i`<form>
      <slot></slot>
      ${t=>t.error?i`<p class="error">${t.error}</p>`:""}
      <button type="submit">
        <slot name="submit-label">Login</slot>
      </button>
    </form>`,m(this).replace(this.viewModel.render(this.view)),(s=this.shadowRoot)==null||s.addEventListener("submit",t=>{this.submitLogin(t,this.getAttribute("api")||"#")})}submitLogin(s,t){s.preventDefault();const r=this.viewModel.toObject(),n="POST",a={"Content-Type":"application/json"},o=JSON.stringify(r);console.log("Posting login form:",t,o,s),this.viewModel.set("error",void 0),fetch(t,{method:n,headers:a,body:o}).then(e=>{if(e.status!==200&&e.status!==201){if(t.includes("register")&&e.status===409){this.viewModel.set("error","Username exists");return}if(t.includes("login")&&e.status===401){this.viewModel.set("error","Invalid username or password");return}this.viewModel.set("error",`Form submission failed: Status ${e.status}`);return}return e.json()}).then(e=>{if(!e)return;const{token:u}=e,d=new CustomEvent("auth:message",{bubbles:!0,composed:!0,detail:["auth/signin",{token:u,redirect:"/"}]});this.dispatchEvent(d)})}}c({"auth-provider":v.Provider,"login-form":w});
