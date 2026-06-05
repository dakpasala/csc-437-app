import{c,g as m,h as a,s as v,r as p,b as w,d as b,a as f}from"./view-9-Tk-Emq.js";const r=class r extends HTMLElement{constructor(){var e;super(),this.viewModel=c({username:"",password:"",error:void 0}).with(m(this),"username","password"),this.view=a`<form>
      <slot></slot>
      ${t=>t.error?a`<p class="error">${t.error}</p>`:""}
      <button type="submit">
        <slot name="submit-label">Login</slot>
      </button>
    </form>`,v(this).styles(p.styles,r.styles).replace(this.viewModel.render(this.view)),(e=this.shadowRoot)==null||e.addEventListener("submit",t=>{this.submitLogin(t,this.getAttribute("api")||"#")})}submitLogin(e,t){e.preventDefault();const n=this.viewModel.toObject(),d="POST",u={"Content-Type":"application/json"},i=JSON.stringify(n);console.log("Posting login form:",t,i,e),this.viewModel.set("error",void 0),fetch(t,{method:d,headers:u,body:i}).then(s=>{if(s.status!==200&&s.status!==201){if(t.includes("register")&&s.status===409){this.viewModel.set("error","Username exists");return}if(t.includes("login")&&s.status===401){this.viewModel.set("error","Invalid username or password");return}this.viewModel.set("error",`Form submission failed: Status ${s.status}`);return}return s.json()}).then(s=>{if(!s)return;const{token:l}=s,h=new CustomEvent("auth:message",{bubbles:!0,composed:!0,detail:["auth/signin",{token:l,redirect:"/"}]});this.dispatchEvent(h)})}};r.styles=w`
    form {
      display: grid;
      gap: 1rem;
    }

    button {
      width: fit-content;
      padding: 0.5rem 1rem;
      cursor: pointer;
    }

    .error {
      color: red;
      margin: 0;
    }
  `;let o=r;b({"auth-provider":f.Provider,"login-form":o});
