// ==========================================
// BILI STORE - SCRIPT.JS
// ==========================================

// ---------- Default Products ----------
const defaultProducts = [
    {
        id: 1,
        name: "Classic Watch",
        price: 2500,
        description: "A clean and stylish classic watch for everyday use.",
        image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800"
    },
    {
        id: 2,
        name: "Premium Sunglasses",
        price: 1800,
        description: "Stylish sunglasses with a modern premium look.",
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800"
    },
    {
        id: 3,
        name: "Leather Wallet",
        price: 1500,
        description: "Simple and elegant wallet made for everyday use.",
        image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800"
    }
];

// ---------- Store Settings ----------
const INSTAGRAM = "bilalabid793";
const SNAPCHAT = "bilal1235abid";
const EMAIL = "bilalabid1235@outlook.com";

// ---------- Local Storage ----------
const STORAGE_KEY = "biliStoreProducts";

function getProducts() {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (error) {
            console.error("Products data error:", error);
            return defaultProducts;
        }
    }

    return defaultProducts;
}

function saveProducts(products) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

// ---------- Global Products ----------
let products = getProducts();
let selectedProduct = null;


// ==========================================
// DISPLAY PRODUCTS
// ==========================================

function displayProducts(productList = products) {
    const grid = document.getElementById("productsGrid");

    if (!grid) {
        console.error("productsGrid not found.");
        return;
    }

    if (productList.length === 0) {
        grid.innerHTML = `
            <div class="no-products">
                <h3>No products found</h3>
                <p>Try another search or add a new product.</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = productList.map(product => `
        <div class="product-card" onclick="openProduct(${product.id})">
            
            <div class="product-image">
                <img 
                    src="${escapeHTML(product.image)}" 
                    alt="${escapeHTML(product.name)}"
                    onerror="this.src='https://via.placeholder.com/600x600?text=Bili+Store'"
                >
            </div>

            <div class="product-info">
                <h3>${escapeHTML(product.name)}</h3>

                <p class="product-description">
                    ${escapeHTML(product.description)}
                </p>

                <div class="product-bottom">
                    <span class="product-price">
                        Rs. ${Number(product.price).toLocaleString()}
                    </span>

                    <button 
                        type="button" 
                        class="view-btn"
                        onclick="event.stopPropagation(); openProduct(${product.id})"
                    >
                        View
                    </button>
                </div>
            </div>

        </div>
    `).join("");
}


// ==========================================
// SEARCH
// ==========================================

function setupSearch() {
    const searchInput = document.getElementById("searchInput");

    if (!searchInput) {
        return;
    }

    searchInput.addEventListener("input", function () {
        const searchText = this.value.toLowerCase().trim();

        const filtered = products.filter(product => {
            return (
                product.name.toLowerCase().includes(searchText) ||
                product.description.toLowerCase().includes(searchText)
            );
        });

        displayProducts(filtered);
    });
}


// ==========================================
// OPEN PRODUCT DETAILS
// ==========================================

function openProduct(id) {
    const product = products.find(item => item.id === id);

    if (!product) {
        console.error("Product not found:", id);
        return;
    }

    selectedProduct = product;

    const productModal = document.getElementById("productModal");

    if (!productModal) {
        console.error("productModal not found.");
        return;
    }

    const image = document.getElementById("modalProductImage");
    const name = document.getElementById("modalProductName");
    const description = document.getElementById("modalProductDescription");
    const price = document.getElementById("modalProductPrice");

    if (image) {
        image.src = product.image;
        image.alt = product.name;
    }

    if (name) {
        name.textContent = product.name;
    }

    if (description) {
        description.textContent = product.description;
    }

    if (price) {
        price.textContent = `Rs. ${Number(product.price).toLocaleString()}`;
    }

    productModal.classList.add("active");
    document.body.style.overflow = "hidden";
}


// ==========================================
// CLOSE PRODUCT DETAILS
// ==========================================

function closeProduct() {
    const productModal = document.getElementById("productModal");

    if (productModal) {
        productModal.classList.remove("active");
    }

    document.body.style.overflow = "";
    selectedProduct = null;
}


// ==========================================
// PRODUCT LINK
// ==========================================

function getProductLink(product) {
    const url = new URL(window.location.href);

    url.search = "";
    url.hash = "";

    url.searchParams.set("product", product.id);

    return url.toString();
}


// ==========================================
// PRODUCT MESSAGE
// ==========================================

function getProductMessage(product) {
    const link = getProductLink(product);

    return `Hi Bilal! I am interested in this product:

Product: ${product.name}
Price: Rs. ${Number(product.price).toLocaleString()}

Product Link:
${link}`;
}


// ==========================================
// INSTAGRAM
// ==========================================

function contactInstagram() {
    if (!selectedProduct) {
        return;
    }

    const message = getProductMessage(selectedProduct);

    const url = `https://www.instagram.com/direct/new/?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");
}


// ==========================================
// SNAPCHAT
// ==========================================

function contactSnapchat() {
    if (!selectedProduct) {
        return;
    }

    const username = SNAPCHAT;

    const url = `https://www.snapchat.com/add/${username}`;

    window.open(url, "_blank");
}


// ==========================================
// EMAIL / OUTLOOK
// ==========================================

function contactEmail() {
    if (!selectedProduct) {
        return;
    }

    const subject = `Product Inquiry - ${selectedProduct.name}`;

    const body = getProductMessage(selectedProduct);

    const mailto =
        `mailto:${EMAIL}` +
        `?subject=${encodeURIComponent(subject)}` +
        `&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
}


// ==========================================
// COPY PRODUCT LINK
// ==========================================

async function copyProductLink() {
    if (!selectedProduct) {
        return;
    }

    const link = getProductLink(selectedProduct);

    try {
        await navigator.clipboard.writeText(link);

        alert("Product link copied!");
    } catch (error) {
        // Fallback
        const textArea = document.createElement("textarea");

        textArea.value = link;
        document.body.appendChild(textArea);

        textArea.select();
        document.execCommand("copy");

        textArea.remove();

        alert("Product link copied!");
    }
}


// ==========================================
// ADMIN MODAL - OPEN
// ==========================================

function openAdmin() {
    const adminModal = document.getElementById("adminModal");

    if (!adminModal) {
        console.error("adminModal not found.");
        return;
    }

    adminModal.classList.add("active");
    document.body.style.overflow = "hidden";
}


// ==========================================
// ADMIN MODAL - CLOSE
// ==========================================

function closeAdmin() {
    const adminModal = document.getElementById("adminModal");

    if (adminModal) {
        adminModal.classList.remove("active");
    }

    document.body.style.overflow = "";
}


// ==========================================
// IMAGE PREVIEW
// ==========================================

function setupImagePreview() {
    const imageInput = document.getElementById("productImage");
    const preview = document.getElementById("imagePreview");

    if (!imageInput || !preview) {
        return;
    }

    imageInput.addEventListener("change", function () {
        const file = this.files[0];

        if (!file) {
            preview.innerHTML = "";
            return;
        }

        if (!file.type.startsWith("image/")) {
            alert("Please select an image file.");
            this.value = "";
            preview.innerHTML = "";
            return;
        }

        const reader = new FileReader();

        reader.onload = function (event) {
            preview.innerHTML = `
                <img 
                    src="${event.target.result}" 
                    alt="Image Preview"
                    style="max-width: 200px; max-height: 200px; border-radius: 10px;"
                >
            `;
        };

        reader.readAsDataURL(file);
    });
}


// ==========================================
// ADD PRODUCT FORM
// ==========================================

function setupProductForm() {
    const form = document.getElementById("productForm");

    if (!form) {
        console.error("productForm not found.");
        return;
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const nameInput = document.getElementById("productName");
        const priceInput = document.getElementById("productPrice");
        const descriptionInput = document.getElementById("productDescription");
        const imageInput = document.getElementById("productImage");

        const name = nameInput ? nameInput.value.trim() : "";
        const price = priceInput ? priceInput.value.trim() : "";
        const description = descriptionInput
            ? descriptionInput.value.trim()
            : "";

        if (!name) {
            alert("Please enter product name.");
            return;
        }

        if (!price) {
            alert("Please enter product price.");
            return;
        }

        if (!description) {
            alert("Please enter product description.");
            return;
        }

        if (!imageInput || !imageInput.files[0]) {
            alert("Please select a product image.");
            return;
        }

        const file = imageInput.files[0];

        const reader = new FileReader();

        reader.onload = function (event) {
            const newProduct = {
                id: Date.now(),
                name: name,
                price: Number(price),
                description: description,
                image: event.target.result
            };

            products.push(newProduct);

            saveProducts(products);

            displayProducts(products);

            form.reset();

            const preview = document.getElementById("imagePreview");

            if (preview) {
                preview.innerHTML = "";
            }

            closeAdmin();

            alert("Product added successfully!");
        };

        reader.onerror = function () {
            alert("Could not read the selected image.");
        };

        reader.readAsDataURL(file);
    });
}


// ==========================================
// DELETE PRODUCT
// ==========================================

function deleteProduct(id) {
    const product = products.find(item => item.id === id);

    if (!product) {
        return;
    }

    const confirmDelete = confirm(
        `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmDelete) {
        return;
    }

    products = products.filter(item => item.id !== id);

    saveProducts(products);

    displayProducts(products);

    closeProduct();

    alert("Product deleted.");
}


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHTML(value) {
    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ==========================================
// MODAL BACKDROP CLICK
// ==========================================

function setupModalClicks() {
    const productModal = document.getElementById("productModal");
    const adminModal = document.getElementById("adminModal");

    if (productModal) {
        productModal.addEventListener("click", function (event) {
            if (event.target === productModal) {
                closeProduct();
            }
        });
    }

    if (adminModal) {
        adminModal.addEventListener("click", function (event) {
            if (event.target === adminModal) {
                closeAdmin();
            }
        });
    }
}


// ==========================================
// ESC KEY
// ==========================================

function setupEscapeKey() {
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeProduct();
            closeAdmin();
        }
    });
}


// ==========================================
// OPEN PRODUCT FROM URL
// ==========================================

function openProductFromURL() {
    const params = new URLSearchParams(window.location.search);

    const productId = params.get("product");

    if (!productId) {
        return;
    }

    const product = products.find(
        item => String(item.id) === String(productId)
    );

    if (product) {
        openProduct(product.id);
    }
}


// ==========================================
// PAGE START
// ==========================================

document.addEventListener("DOMContentLoaded", function () {
    console.log("Bili Store JavaScript loaded successfully.");

    products = getProducts();

    displayProducts(products);

    setupSearch();

    setupImagePreview();

    setupProductForm();

    setupModalClicks();

    setupEscapeKey();

    openProductFromURL();
});