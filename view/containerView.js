
import { Controller } from "../controller/controller";
import { CartView } from "./cartView/cartView";
// import { AddSubButton } from "./addandSubButton";
export class ContainerView{
    constructor(data){
        this.data = data;
        this.itemList = document.querySelector(".item-list")
        this.typeList = document.querySelector(".type-list")
        this.sectionTitle = document.getElementById('sectionTitle')
        this.cartCount = document.getElementById('cartCount')
        this.controller =  new Controller(this.data)
        this.elementList = this.controller.categories(this.data);
        this.cartView = new CartView(this.data);
        this.setupTheme();
        this.setupSearch();
        this.setupCartModal();
    }
    init(){
        this.renderItems(this.data);
        this.renderCategories(this.elementList);    
        
    }

    renderItems(data){
        this.itemList.innerHTML = ""
        data.forEach(element => {
        const itemDiv = document.createElement("div");                        
        itemDiv.classList.add("itemName");  
        itemDiv.innerHTML = `
            <div class="product-image-container">
                <img class="itemImage" src="${element.src}" alt="${element.name}">
                <div class="discount-badge">${Math.round((element.price - element.discount_price) / element.price * 100)}% OFF</div>
            </div>
            <div class="product-content">
                <div class="product-info">
                    <h3 class="product-title">${element.name}</h3>
                    <p class="product-unit">${element.unit}</p>
                    <div class="price-section">
                        <span class="current-price">₹${element.discount_price}</span>
                        <span class="original-price">₹${element.price}</span>
                    </div>
                </div>
                <div class="product-actions">
                    ${element.quantity === 0 ? 
                        `<button class="add-btn">Add</button>` :
                        `<div class="quantity-controls">
                            <button class="qty-btn subtract">−</button>
                            <span class="quantity-display">${element.quantity}</span>
                            <button class="qty-btn add">+</button>
                        </div>`
                    }
                </div>
            </div>
        `;
                                
        this.itemList.appendChild(itemDiv)                    
        this.bindEventOnItem(itemDiv,element);          
       });
       this.addButtonFunction(data);
       this.updateCartCount();
    } 
      
    renderCategories(data){
        // Add "All" category at the beginning
        const allCategory = document.createElement("div");
        allCategory.classList.add("typeName", "active");
        allCategory.innerHTML = `🛒 All`;
        this.typeList.appendChild(allCategory);
        this.bindEventOnCategory(allCategory, "All");
        
        // Add category icons
        const categoryIcons = {
            'Fresh Fruits': '🍎',
            'Fresh Vegetables': '🥕', 
            'leafy Herbs': '🌿',
            'Flowers': '🌸',
            'Exotic': '🥒',
            'Kitchen': '🥛',
            'House Hold': '🧽'
        };
        
        data.forEach((value)=>{
            const typeName = document.createElement("div");                    
            typeName.classList.add("typeName");
            const icon = categoryIcons[value] || '📦';
            typeName.innerHTML = `${icon} ${value}`;                                
            this.typeList.appendChild(typeName);        
            this.bindEventOnCategory(typeName, value);
        })
    }  

    bindEventOnItem(itemDiv,element){  
        const imageContainer = itemDiv.querySelector(".product-image-container");
        imageContainer.addEventListener("click",() =>{
                this.popUpDescription(element); 
                });  
    }

    popUpDescription(element) {
        // Create modal overlay
        const overlay = document.createElement("div");
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 16px;
        `;
        
        const itemDetails = document.createElement("div");
        itemDetails.id = "itemDetails";
        itemDetails.innerHTML = `
            <img src="${element.src}" alt="${element.name}">
            <div>
                <h3>${element.name}</h3>
                <div>Price: ₹${element.discount_price} / ${element.unit}</div>
                <div>MRP: ₹${element.price} / ${element.unit}</div>
                <div>${Math.round((element.price - element.discount_price) / element.price * 100)}% Off</div>
                <div>Country of Origin: ${element.countryoforigin}</div>
                <div class="addClass" style="margin-top: 16px;">
                    ${element.quantity === 0 ? 
                        `<div class="add">Add to Cart</div>` :
                        `<div class="quantityDiv">
                            <div class="subtract">-</div>
                            <div class="quantity">${element.quantity}</div>
                            <div class="add">+</div>
                        </div>`
                    }
                </div>
            </div>
        `;
        
        overlay.appendChild(itemDetails);
        document.body.appendChild(overlay);
        
        // Close on overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
                this.renderItems(this.data);
            }
        });
        
        this.addButtonFunction([element]);
    }

    bindEventOnCategory(typeName, categoryName){
        typeName.addEventListener("click", (event)=> {   
            // Remove active class from all categories
            document.querySelectorAll('.typeName').forEach(cat => cat.classList.remove('active'));
            // Add active class to clicked category
            typeName.classList.add('active');
            
            // Update section title
            this.sectionTitle.textContent = categoryName === 'All' ? 'All Products' : categoryName;
            
            const filteredData = categoryName === 'All' ? this.data : this.controller.filterItems(categoryName);
            this.renderItems(filteredData); 
        });               
      } 
    
      addButtonFunction(data) {
        const addButtonList = document.querySelectorAll(".add, .add-btn");
        addButtonList.forEach((addButton) => {
            addButton.addEventListener("click", () => {
                const itemName = addButton.closest(".itemName").querySelector(".product-title").textContent;
                const selectedItem = Array.isArray(data) ? 
                    data.find(item => item.name === itemName) :
                    this.data.find(item => item.name === itemName);
                
                if (selectedItem) {
                    selectedItem.quantity = (selectedItem.quantity || 0) + 1;
                    this.updateCartCount();
                    
                    // Check if we're in popup mode
                    if (document.getElementById('itemDetails')) {
                        // Update popup
                        const popup = document.getElementById('itemDetails');
                        const quantityDiv = popup.querySelector('.addClass');
                        quantityDiv.innerHTML = `
                            <div class="quantityDiv">
                                <div class="subtract">-</div>
                                <div class="quantity">${selectedItem.quantity}</div>
                                <div class="add">+</div>
                            </div>
                        `;
                        this.addButtonFunction([selectedItem]);
                        this.quantityManager([selectedItem]);
                    } else {
                        // Update main view
                        this.renderItems(this.data);
                        this.quantityManager(this.data);
                    }
                }
            });
        });
        return data;
    }
    quantityManager(data) {
        const quantityControls = document.querySelectorAll(".quantity-controls, .quantityDiv");
        
        quantityControls.forEach((control) => {
            const addButton = control.querySelector(".add, .qty-btn:last-child");
            const subButton = control.querySelector(".subtract, .qty-btn:first-child");
            const quantity = control.querySelector(".quantity, .quantity-display");
            const itemName = control.closest(".itemName").querySelector(".product-title, h3").textContent;
    
            if (subButton) {
                subButton.addEventListener("click", () => {
                    const selectedItem = data.find(item => item.name === itemName);
                    
                    if (selectedItem && selectedItem.quantity > 0) {
                        selectedItem.quantity -= 1;
                        this.updateCartCount();
                        if (selectedItem.quantity < 1) {
                            this.renderItems(this.data);
                        } else {
                            quantity.textContent = selectedItem.quantity;
                        }
                    }
                });
            }
        });
    }
    
    updateCartCount() {
        const totalItems = this.data.reduce((sum, item) => sum + (item.quantity || 0), 0);
        this.cartCount.textContent = totalItems;
        this.cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
    
    setupTheme() {
        const themeToggle = document.getElementById('themeToggle');
        const savedTheme = localStorage.getItem('quickkart-theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = savedTheme || (prefersDark ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', theme);
        
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('quickkart-theme', newTheme);
        });
    }
    
    setupSearch() {
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            if (query.trim()) {
                const filteredData = this.data.filter(item => 
                    item.name.toLowerCase().includes(query) ||
                    item.type.toLowerCase().includes(query)
                );
                this.sectionTitle.textContent = `Search: "${e.target.value}"`;
                this.renderItems(filteredData);
            } else {
                this.sectionTitle.textContent = 'All Products';
                this.renderItems(this.data);
            }
        });
    }
    
    setupCartModal() {
        const cartButton = document.getElementById('cartButton');
        const cartModal = document.getElementById('cartModal');
        const closeCart = document.getElementById('closeCart');
        
        cartButton.addEventListener('click', () => {
            this.openCartModal();
        });
        
        closeCart.addEventListener('click', () => {
            cartModal.style.display = 'none';
        });
        
        cartModal.addEventListener('click', (e) => {
            if (e.target === cartModal) {
                cartModal.style.display = 'none';
            }
        });
    }
    
    openCartModal() {
        const cartItems = this.data.filter(item => item.quantity > 0);
        const cartItemsContainer = document.getElementById('cartItems');
        const cartFooter = document.getElementById('cartFooter');
        const cartModal = document.getElementById('cartModal');
        
        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <div class="empty-cart-icon">🛒</div>
                    <p>Your cart is empty</p>
                </div>
            `;
            cartFooter.innerHTML = '';
        } else {
            cartItemsContainer.innerHTML = cartItems.map(item => `
                <div class="cart-item">
                    <img src="${item.src}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-details">${item.unit}</div>
                        <div class="cart-item-price">₹${item.discount_price} × ${item.quantity}</div>
                    </div>
                    <div class="quantityDiv">
                        <div class="subtract" data-name="${item.name}">-</div>
                        <div class="quantity">${item.quantity}</div>
                        <div class="add" data-name="${item.name}">+</div>
                    </div>
                </div>
            `).join('');
            
            const subtotal = cartItems.reduce((sum, item) => sum + (item.discount_price * item.quantity), 0);
            const tax = subtotal * 0.18;
            const total = subtotal + tax;
            
            cartFooter.innerHTML = `
                <div class="total-row">
                    <span>Subtotal:</span>
                    <span>₹${subtotal.toFixed(2)}</span>
                </div>
                <div class="total-row">
                    <span>Tax (18%):</span>
                    <span>₹${tax.toFixed(2)}</span>
                </div>
                <div class="total-row final">
                    <span>Total:</span>
                    <span>₹${total.toFixed(2)}</span>
                </div>
                <button class="checkout-button">Proceed to Checkout</button>
            `;
            
            // Add event listeners for cart quantity controls
            cartItemsContainer.querySelectorAll('.subtract, .add').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const itemName = e.target.dataset.name;
                    const item = this.data.find(i => i.name === itemName);
                    if (item) {
                        if (e.target.classList.contains('subtract')) {
                            item.quantity = Math.max(0, item.quantity - 1);
                        } else {
                            item.quantity += 1;
                        }
                        this.updateCartCount();
                        this.renderItems(this.data); // Update main screen
                        this.openCartModal(); // Refresh cart display
                    }
                });
            });
        }
        
        cartModal.style.display = 'flex';
    }
}