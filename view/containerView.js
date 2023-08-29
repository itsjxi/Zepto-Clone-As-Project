
import { Controller } from "../controller/controller";

export class ContainerView{
    constructor(data){
        this.data = data;
        this.itemList = document.querySelector(".item-list")
        this.typeList = document.querySelector(".type-list")
        console.log(this.itemList)
        this.controller =  new Controller(this.data)
        this.elementList = this.controller.categories(this.data);
        
    }
    init(){
        this.renderItems(this.data);
        this.renderCategories(this.elementList);
        this.addButtonFunction(this.data);
        
    }

    renderItems(data){
        this.itemList.innerHTML = ""
        console.log(data,"renderItem data")
        data.forEach(element => {
        const itemDiv = document.createElement("div");                        
        itemDiv.classList.add("itemName");  
        itemDiv.innerHTML += `
                                    <img class="itemImage" src="${element.src}" alt="${element.name}">
                                    <h3 style = " margin-bottom: 0px">${element.name}</h3>
                                    <p style = "color: gray; margin: 5px">${element.unit}</p>
                                    <div class="shortDescrip">
                                    <div class="itemPrice"><strong>₹ ${element.discount_price}</strong></div>
                                    <div class="addClass"><button>Add</button></div>
                                    </div>
                                `;
                                
        this.itemList.appendChild(itemDiv)                    
        this.bindEventOnItem(itemDiv,element);          
       });
    } 
      
    renderCategories(data){
        data.forEach((value)=>{
            const typeName = document.createElement("div");                    
            typeName.classList.add("typeName");                                
            typeName.textContent = value;                                
            this.typeList.appendChild(typeName);        
            this.bindEventOnCategory(typeName);
        })
       
    }  

    bindEventOnItem(itemDiv,element){  
        itemDiv.querySelector(".itemImage").addEventListener("click",() =>{
                this.itemList.innerHTML = '';
                this.popUpDescription(element);  
                });  
    }

    popUpDescription(element) {
        const itemDetails = document.createElement("div");
        itemDetails.classList.add("itemDetails");   
        itemDetails.innerHTML = `
            <img src="${element.src}">
            <h3>${element.name}</h3>
            <div>Price: ${(1 - element.discount_price / 100) * element.price} ₹ /<span style = "color: gray">${element.unit}</span></div>
            <div>MRP: ${element.price} ₹/<span style = "color: gray">${element.unit}</span></div>
            <div>${element.discount_price}% Off</div>
            <div>Country of Origin: ${element.countryoforigin}</div>
            <div class="addClass"><button >Add</button></div>
        `;
        this.itemList.appendChild(itemDetails);

    }

    bindEventOnCategory(typeName){
        typeName.addEventListener("click", (event)=> {   
            const categoryName = event.target.innerText;
            this.itemList.innerHTML = "";
            const heading = document.createElement("h2");
            heading.classList.add("itemHeading");
            heading.textContent= categoryName;
            this.itemList.appendChild(heading);
            const filteredData = this.controller.filterItems(categoryName);
            this.renderItems(filteredData); 
        });               
      } 
    
      addButtonFunction(data) {
        data.forEach((item) => {
            const addButton = document.querySelectorAll(".addClass");
            addButton.forEach((button) => {
                button.addEventListener("click", () => {
                    this.handleButtonClick(item, button,data);
                });
            });
        });
    }
    
    handleButtonClick(item, button,data) {
        const itemName = button.parentElement.parentElement.querySelector("h3").textContent;
        if (item.name === itemName) {
            if (item.quantity === 0) {
                item.quantity = 1;
                this.updateButtonDisplay(button, item.quantity);
            } else {
                const quantityDisplay = button.querySelector(".quantity");
                const add = button.querySelector(".add");
                add.addEventListener("click", (event) => {
                    event.stopPropagation();
                    item.quantity++;
                    quantityDisplay.textContent = item.quantity;
                    console.log(data, "lets see the quantity");
                });
    
                const subtract = button.querySelector(".subtract");
                subtract.addEventListener("click", (event) => {
                    event.stopPropagation();
                    if (item.quantity <= 1) {
                        this.resetButton(item,button);
                    } else {
                        item.quantity = Math.max(0, item.quantity - 1);
                        quantityDisplay.textContent = item.quantity;
                    }
                });
            }
        }
    }
    
    updateButtonDisplay(button, quantity) {
        button.style.display = "flex";
        button.innerHTML = `
            <div class="subtract" style="font-weight: bolder">-</div>
            <div class="quantity">${quantity}</div>
            <div class="add" style="font-weight: bolder">+</div>`;
    }
    
    resetButton(item,button){
        button.style.display = "flex";
        button.innerHTML = `<button>Add</button>`;
        button.querySelector("button").addEventListener("click", () => {
           this.handleButtonClick(item, button); 
        });
    }   
}