const contenedorProductos = document.querySelector("#productosCalzado")

const obtenerProductos = async () => {
  try {
    const respuesta = await fetch("./productos.json")
    const datos = await respuesta.json()
    const productosCalzado = datos.productosCalzado

    productosCalzado.forEach((producto) => {
      const tarjetaProducto = document.createElement("div")
      tarjetaProducto.className = "producto"
      tarjetaProducto.innerHTML = `
        <img src="${producto.imagen}" alt="${producto.nombre}">
        <h3>${producto.nombre}</h3>
        <span>$ ${producto.precio}</span>
        <button class="boton" data-id="${producto.id}">Agregar al Carrito</button>
      `
      contenedorProductos.appendChild(tarjetaProducto)
    })

    agregarEventListeners()
  } catch (error) {
    console.log(error)
  }
}

const agregarEventListeners = () => {
  const botonesAgregarCarrito = document.querySelectorAll(".boton")

  botonesAgregarCarrito.forEach((boton) => {
    boton.addEventListener("click", agregarProductoAlCarrito)
  })
}

function agregarProductoAlCarrito(evento) {
  const boton = evento.target
  const productoSeleccionado = boton.parentNode

  agregarAlCarrito(productoSeleccionado)
  Toastify({
    text: 'Producto Agregado al Carrito',
    duration: 1500,
    newWindow: true,
    close: true,
    gravity: "top", 
    position: "center",
    backgroundColor: "#f4a749"
  }).showToast()
}

function agregarAlCarrito(productoSeleccionado) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || []

  const imagen = productoSeleccionado.querySelector("img").getAttribute("src")
  const nombre = productoSeleccionado.querySelector("h3").textContent
  const precio = productoSeleccionado.querySelector("span").textContent.replace("$ ", "")
  const id = productoSeleccionado.querySelector(".boton").dataset.id

  carrito.push({
    id,
    imagen,
    nombre,
    precio,
    cantidad: 1
  })

  localStorage.setItem("carrito", JSON.stringify(carrito))

  actualizarNumeroItemsCarrito()
}

function actualizarNumeroItemsCarrito() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || []
  const numeroItems = carrito.reduce((total, producto) => total + producto.cantidad, 0)

  const botonCarrito = document.querySelector(".boton-carrito")
  botonCarrito.innerHTML = `<i class="fas fa-shopping-cart"></i> (${numeroItems})`
}

obtenerProductos()