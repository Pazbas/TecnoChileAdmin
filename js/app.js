


function inicializarTiendaBootstrap(){
  cargarCategorias();
  renderProductos(getProductos());
  configurarFiltros();
  renderCarrito();
}

function renderProductos(lista) {
    const div = document.querySelector("#productos");
    div.innerHTML = "";

    const carrito = getCarrito();

    lista.forEach(p => {
        const cantidad = carrito[p.id] || 0;

        div.innerHTML += `
        <div class="col-lg-2 col-md-4 col-sm-6">
            <div class="card producto-card shadow-sm h-100">

                <img src="img/producto${p.id}.jpg" class="card-img-top">

                <div class="card-body d-flex flex-column">
                    <h6 class="card-title">${p.nombre}</h6>
                    <p class="text-muted small">${p.descripcion}</p>
                    <p class="fw-bold">$${p.precio}</p>

                    <div class="d-flex justify-content-between align-items-center mt-auto">
                        <button class="btn btn-danger btn-sm" onclick="quitarDelCarrito(${p.id})">−</button>
                        <span class="fw-bold">${cantidad}</span>
                        <button class="btn btn-success btn-sm" onclick="agregarCarrito(${p.id})">+</button>
                    </div>
                </div>

            </div>
        </div>
        `;
    });
}


function renderCarrito(){
  const lista = document.querySelector("#carritoLista");
  const badge = document.querySelector("#carritoCantidad");
  if(!lista) return;

  lista.innerHTML = "";
  const carrito = getCarrito();
  let total = 0;

  badge.textContent = carrito.length;

  carrito.forEach(id=>{
    const p = getProductos().find(prod => prod.id === id);
    if(p){
      total += p.precio;
      lista.innerHTML += `
        <li class="list-group-item d-flex justify-content-between">
          ${p.nombre} - $${p.precio}
          <button class="btn btn-sm btn-danger" onclick="quitarDelCarrito(${id})">X</button>
        </li>
      `;
    }
  });

  document.querySelector("#totalCarrito").textContent = total;
}

function quitarDelCarrito(id){
  let carrito = getCarrito();
  const index = carrito.indexOf(id);
  if(index !== -1) carrito.splice(index, 1);
  saveCarrito(carrito);
  renderCarrito();
}



if (!localStorage.getItem("productos")) {
  const productosIniciales = [
    {id:1,nombre:"Teclado",descripcion:"Teclado mecánico",precio:50,categoria:"Periféricos",etiqueta:"mecánico",cantidad:10},
    {id:2,nombre:"Mouse",descripcion:"Mouse gamer",precio:30,categoria:"Periféricos",etiqueta:"gamer",cantidad:12},
    {id:3,nombre:"Monitor",descripcion:"Monitor 24''",precio:120,categoria:"Pantallas",etiqueta:"fullhd",cantidad:5},
    {id:4,nombre:"Silla",descripcion:"Silla ergonómica",precio:200,categoria:"Muebles",etiqueta:"ergonomía",cantidad:7},
    {id:5,nombre:"Auriculares",descripcion:"Bluetooth",precio:40,categoria:"Audio",etiqueta:"inalámbrico",cantidad:8},
    {id:6,nombre:"Parlante",descripcion:"Parlante portátil",precio:35,categoria:"Audio",etiqueta:"bass",cantidad:9},
    {id:7,nombre:"Notebook",descripcion:"8GB RAM",precio:450,categoria:"Computadores",etiqueta:"laptop",cantidad:4},
    {id:8,nombre:"Tablet",descripcion:"10 pulgadas",precio:150,categoria:"Tablets",etiqueta:"android",cantidad:6},
    {id:9,nombre:"Impresora",descripcion:"Multifunción",precio:90,categoria:"Impresoras",etiqueta:"wifi",cantidad:3}
  ];

  localStorage.setItem("productos", JSON.stringify(productosIniciales));
}

const getProductos = () => JSON.parse(localStorage.getItem("productos"));
const saveProductos = (p) => localStorage.setItem("productos", JSON.stringify(p));




function inicializarTienda(){
  cargarCategorias();
  renderProductos(getProductos());
  configurarFiltros();
  renderCarrito();
}

function cargarCategorias(){
  const cats = [...new Set(getProductos().map(p=>p.categoria))];
  const sel = document.querySelector("#filtroCategoria");
  cats.forEach(c=>{
    let opt = document.createElement("option");
    opt.value = c; opt.textContent = c;
    sel.appendChild(opt);
  });
}

function configurarFiltros(){
  document.querySelector("#filtroCategoria").onchange = aplicarFiltros;
  document.querySelector("#filtroPrecio").oninput = ()=>{
    document.querySelector("#precioVal").textContent =
      document.querySelector("#filtroPrecio").value;
    aplicarFiltros();
  };
  document.querySelector("#filtroTexto").oninput = aplicarFiltros;
}

function aplicarFiltros(){
  const cat = document.querySelector("#filtroCategoria").value.toLowerCase();
  const precio = Number(document.querySelector("#filtroPrecio").value);
  const texto = document.querySelector("#filtroTexto").value.toLowerCase();

  let filtrados = getProductos().filter(p=>{
    return (!cat || p.categoria.toLowerCase() === cat) &&
           (p.precio <= precio) &&
           (
             p.nombre.toLowerCase().includes(texto) ||
             p.descripcion.toLowerCase().includes(texto) ||
             p.categoria.toLowerCase().includes(texto) ||
             p.etiqueta.toLowerCase().includes(texto)
           );
  });

  renderProductos(filtrados);
}

function renderProductos(lista){
  const div = document.querySelector("#productos");
  div.innerHTML = "";
  lista.forEach(p=>{
    div.innerHTML += `
      <div class="producto">
        <h3>${p.nombre}</h3>
        <p>${p.descripcion}</p>
        <p>Categoría: ${p.categoria}</p>
        <p>Precio: $${p.precio}</p>
        <button onclick="agregarCarrito(${p.id})">Agregar al carrito</button>
      </div>`;
  });
}



if(!localStorage.getItem("carrito")) localStorage.setItem("carrito","[]");

const getCarrito = ()=> JSON.parse(localStorage.getItem("carrito"));
const saveCarrito = (c)=> localStorage.setItem("carrito",JSON.stringify(c));

function agregarCarrito(id){
  const carrito = getCarrito();
  carrito.push(id);
  saveCarrito(carrito);
  renderCarrito();
}

function renderCarrito(){
  const lista = document.querySelector("#carritoLista");
  const badge = document.querySelector("#carritoCantidad");
  let carrito = getCarrito();
  let productos = getProductos();

  lista.innerHTML = "";
  let total = 0;

  badge.textContent = carrito.length;

  carrito.forEach(id=>{
    const p = productos.find(x=>x.id === id);
    if(p){
      total += p.precio;
      lista.innerHTML += `
        <li class="list-group-item d-flex justify-content-between align-items-center">
          ${p.nombre} - $${p.precio}
          <button class="btn btn-sm btn-danger" onclick="quitarDelCarrito(${id})">X</button>
        </li>
      `;
    }
  });

  document.querySelector("#totalCarrito").textContent = total;
}


function quitarDelCarrito(id){
  let carrito = getCarrito();
  const index = carrito.indexOf(id);
  if(index !== -1){
    carrito.splice(index,1);
  }
  saveCarrito(carrito);
  renderCarrito();
}



function cargarAdminLista(){
  const tbody = document.querySelector("#adminLista");
  tbody.innerHTML = "";
  getProductos().forEach(p=>{
    tbody.innerHTML += `
      <tr>
        <td>${p.nombre}</td>
        <td>${p.descripcion}</td>
        <td>$${p.precio}</td>
        <td>${p.categoria}</td>
        <td>${p.cantidad}</td>
        <td>
          <a href="admin_edit.html?id=${p.id}">Editar</a>
          <a href="#" onclick="eliminarProducto(${p.id})">Borrar</a>
        </td>
      </tr>`;
  });
}

function crearProducto(form){
  const productos = getProductos();
  const nuevo = {
    id: Date.now(),
    nombre: form.get("nombre"),
    descripcion: form.get("descripcion"),
    precio: Number(form.get("precio")),
    categoria: form.get("categoria"),
    etiqueta: form.get("etiqueta"),
    cantidad: Number(form.get("cantidad"))
  };

  productos.push(nuevo);
  saveProductos(productos);
  window.location.href = "admin.html";
}

function cargarProductoEditar(){
  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get("id"));
  const producto = getProductos().find(x=>x.id === id);

  const form = document.querySelector("#formEditar");
  for (let campo in producto){
    if(form[campo]) form[campo].value = producto[campo];
  }
}

function actualizarProducto(form){
  const id = Number(form.get("id"));
  const productos = getProductos();
  const p = productos.find(x=>x.id === id);

  p.nombre = form.get("nombre");
  p.descripcion = form.get("descripcion");
  p.precio = Number(form.get("precio"));
  p.categoria = form.get("categoria");
  p.etiqueta = form.get("etiqueta");
  p.cantidad = Number(form.get("cantidad"));

  saveProductos(productos);
  window.location.href = "admin.html";
}

function eliminarProducto(id){
  let productos = getProductos().filter(p=>p.id !== id);
  saveProductos(productos);
  window.location.reload();
}

function buscarDesdeNavbar(){
  const texto = document.querySelector("#searchNavbar").value;
  document.querySelector("#filtroTexto").value = texto;
  aplicarFiltros();
}

