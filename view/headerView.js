import { ContainerView } from "./containerView";
import { Controller } from "../controller/controller";
import { Model } from "../model/model";
export class HeaderView{
    constructor(data){
        this.data =  data;
       this.header = document.querySelector(".header");
       this.headerMainContent();
       this.logo =  document.getElementById("logo");
       this.loginButton =  document.getElementById("logIn");
       this.logInPopUp()
       this.bindEventOnLogo(); 
       this.loginPopUp = document.querySelector(".popUp");
       this.bindEventOnLogIn();
       this.submitButton = document.querySelector("button[type='submit']");
       this.searchInput = document.querySelector('input');
       this.searchedItems();
       this.ContainerView = new ContainerView(this.data)
       this.controller =  new Controller(this.data)
    }

  headerMainContent(){
    this.header.innerHTML = `<div id="logo"><img src="https://www.zeptonow.com/images/logo.svg" alt=""></div>
                                 <div class = "inputSection">
                                    <div><i class = "fa fa-search"></i></div>
                                    <input type="text" class="inputName" placeholder="Search for products" >
                                </div>
                                <button id = "logIn">Login</button>
                                <button id ="cartButton" class = "cart">Cart</button>`;
                              
  }  
   

  logInPopUp(){
    const logInPopUp = document.createElement("div");
    logInPopUp.classList.add("popUp");
    logInPopUp.innerHTML = `    <div class = "loginPopUp">
                                        <h3>Login</h3>
                                        <div>
                                            <form>
                                            <label for="email">Email:</label>
                                            <input type="email" id="email" required placeholder="Enter your Mail ID">
                                        </div>
                                        <div>
                                            <label for="password">Password:</label>
                                            <input type="password" id="password" required placeholder="Password">
                                        </div>
                                        <button id = "submit" type="submit">Submit</button>
                                        </form>
                                </div>`;
    this.header.appendChild(logInPopUp)                            

  }

  bindEventOnLogIn(){
    this.loginButton.addEventListener("click", ()=> {
        this.loginPopUp.style.display = "flex";
        console.log(this.submitButton)
      }); 
      document.querySelector("button[type='submit']").addEventListener("click", ()=> {
        this.loginPopUp.style.display = "none";
      });

  }
  bindEventOnLogo(){
   this.logo.addEventListener("click",()=>{
     window.location.reload();
   })
  }

  searchedItems() {
    let searchTerm = "";
    this.searchInput.addEventListener('keydown', (event) => {
        if (event.keyCode === 13) {
            searchTerm = event.target.value;
            console.log(searchTerm);
            let searchitem = this.controller.dataOfSearchedItems(searchTerm);
            console.log(searchitem)
            this.ContainerView.renderItems(searchitem)
        }
    });
}
}