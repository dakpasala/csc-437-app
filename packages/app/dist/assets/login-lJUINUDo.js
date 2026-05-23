import{c as h,g as m,h as d,s as l,d as c,a as b}from"./view-lW8DKznB.js";class p extends HTMLElement{constructor(){var t;super(),this.viewModel=h({username:"",password:""}).with(m(this),"username","password"),this.view=d`<form>
      <slot></slot>
      <button type="submit">
        <slot name="submit-label">Login</slot>
      </button>
    </form>`,l(this).replace(this.viewModel.render(this.view)),(t=this.shadowRoot)==null||t.addEventListener("submit",e=>{this.submitLogin(e,this.getAttribute("api")||"#")})}submitLogin(t,e){t.preventDefault();const i=this.viewModel.toObject(),n="POST",a={"Content-Type":"application/json"},o=JSON.stringify(i);console.log("Posting login form:",e,o,t),fetch(e,{method:n,headers:a,body:o}).then(s=>{if(s.status!==200)throw`Form submission failed: Status ${s.status}`;return s.json()}).then(s=>{const{token:r}=s,u=new CustomEvent("auth:message",{bubbles:!0,composed:!0,detail:["auth/signin",{token:r,redirect:"/"}]});this.dispatchEvent(u)})}}c({"auth-provider":b.Provider,"login-form":p});
