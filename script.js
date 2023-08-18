const productApi = 'https://node-app-rust.vercel.app/products';
let productsCardGroup = document.getElementById('products-card-group');
let nextBtn = document.getElementById('next-btn');
let prevBtn = document.getElementById('prev-btn');
let btnGroup = document.getElementById('btn-group');
let loader = document.getElementById('loader');
let recordInfo = document.getElementById('record-info');
let searchInput = document.getElementById('search');
let searchBtn = document.getElementById('search-btn');

let currentPage = 1;
const itemsPerPage = 8;

// fetching data to get length of total product
fetch(productApi).then(function(responce){
    return responce.json();
}).then(function(result){
    let len = result.products.length;
    nextBtn.addEventListener('click',function(){
        nextData(len);
    })
    
}).catch(function(error){
    console.log('cant fetch length');
})

function displayData(data){
    console.log(data.products)
    productsCardGroup.innerHTML = ''; // Clear previous content
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // display data acoording to pagination
    for(let i = startIndex; i < endIndex && i < data.products.length; i++){
        // console.log(data.products[i].image.src);
        let productCards = document.createElement('div');
        productCards.className = 'product-card';
        let productImage = document.createElement('img');
        let productTitle = document.createElement('p');
        productTitle.className = 'product-title';
        let productPrice = document.createElement('p');
        productPrice.className = 'product-price';
        let rupeeDiv = document.createElement('div');
        rupeeDiv.className = 'indian-rupee';
        let rupeeIcon = document.createElement('i');
        rupeeIcon.className = "fa-solid fa-indian-rupee-sign";
        let productDetail = document.createElement('div');
        let addToCart = document.createElement('button');
        addToCart.textContent = 'Add To Cart';
        addToCart.className = 'btn btn-warning';
        productDetail.className = 'product-detail';
        
        productDetail.appendChild(productTitle);
        productDetail.appendChild(rupeeDiv); 
        rupeeDiv.appendChild(rupeeIcon);
        rupeeDiv.appendChild(productPrice);

        productCards.appendChild(productImage);
        productCards.appendChild(productDetail);
        productCards.appendChild(addToCart);
        productsCardGroup.appendChild(productCards);
        productTitle.textContent = data.products[i].title;
        productPrice.textContent = data.products[i].variants[0].price;
        productImage.src = data.products[i].image.src;
    }
    console.log(productsCardGroup);
    let total_page = Math.ceil(data.products.length/itemsPerPage)
    // for pagination btn
    for(let i = 1; i <= total_page; i++){
        if(document.getElementsByClassName('num-btn').length < total_page){
            let number_btn = document.createElement('button');
            number_btn.className = 'num-btn btn btn-warning';
            number_btn.textContent = i;
            number_btn.addEventListener('click',function(){
                pageData(i);
            })
            btnGroup.insertBefore(number_btn,btnGroup.lastElementChild);
            
        }
    }
    // showing record information
    // recordInfo.textContent = `Showing ${startIndex} - ${endIndex} out of ${data.products.length}`;


    
    loader.style.display = 'none';
    btnGroup.style.display = 'block';
}



async function fetchProductData(){
    btnGroup.style.display = 'none';
    loader.style.display = 'flex';
    await fetch(productApi).then(function(responce){
        return responce.json();
    }).then(function(result){
        displayData(result);
        searchBtn.addEventListener('click', function() {
            let searchTerm = searchInput.value.toLowerCase();
            if (searchTerm.trim() === ""){
                // Display all products since the search input is empty
                displayData(result);
            } else {
                // Filter and display products based on the search term
                let filteredProducts = result.products.filter(product =>
                    product.title.toLowerCase().includes(searchTerm)
                );
                if(filteredProducts.length == 0){
                    productsCardGroup.textContent = 'Product not found';
                } else{
                    displayData({ products: filteredProducts });
                }
                
            }     
        });
    }).catch(function(error){
        console.log('Cant fetch data');
    })
}

fetchProductData();

//next btn


 prevBtn.addEventListener('click',function(){
    nextBtn.style.display = 'inline-block';
    if(currentPage > 1){
        searchInput.value = '';
        currentPage--;
        fetchProductData();
    }
    else{
        searchInput.value = '';
        prevBtn.style.display = 'none';
    } 
 })


 function nextData(len){
    let total_page = len / itemsPerPage;
    console.log(total_page);
    prevBtn.style.display = 'inline-block';
    if(currentPage < total_page){
        currentPage++;
        searchInput.value = '';
        fetchProductData();
    }
    else{
        searchInput.value = '';
        nextBtn.style.display = 'none';
    }
 }

 function pageData(index){
    prevBtn.style.display = 'inline-block';
    nextBtn.style.display = 'inline-block';
    currentPage = index;
    searchInput.value = '';
    fetchProductData();
 }


