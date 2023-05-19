const agregarProductoAlCarrito = (producto) => {
  let carrito = obtenerCarritoDelLocalStorage()
  carrito.push(producto)
  guardarCarritoEnLocalStorage(carrito)
}

const guardarCarritoEnLocalStorage = (carrito) => {
  localStorage.setItem("carrito", JSON.stringify(carrito))
}

const obtenerCarritoDelLocalStorage = () => {
  return JSON.parse(localStorage.getItem("carrito")) || []
}

const mostrarProductosEnCarrito = () => {
  const carrito = obtenerCarritoDelLocalStorage()
  const contenedorCarrito = document.querySelector("#carritoProductos")

  contenedorCarrito.innerHTML = ""

  carrito.forEach((producto) => {
    const tarjetaProducto = crearTarjetaProducto(producto)
    contenedorCarrito.appendChild(tarjetaProducto)
  })

  agregarEventListenersCarrito()
}

const crearTarjetaProducto = (producto) => {
  const tarjetaProducto = document.createElement("div")
  tarjetaProducto.className = "producto"
  tarjetaProducto.innerHTML = `
    <img src="${producto.imagen}" alt="${producto.nombre}">
    <h3>${producto.nombre}</h3>
    <span>$ ${producto.precio}</span>
    <button class="boton-eliminar" data-id="${producto.id}">Eliminar del Carrito</button>
  `
  const botonBorrar = tarjetaProducto.querySelector(".boton-eliminar")
  botonBorrar.addEventListener("click", () => {
    eliminarProductoDelCarrito(producto.id)
    tarjetaProducto.remove()
  })

  return tarjetaProducto
}

const agregarEventListenersCarrito = () => {
  const botonesEliminarCarrito = document.querySelectorAll(".boton-eliminar")

  botonesEliminarCarrito.forEach((boton) => {
    boton.addEventListener("click", (event) => {
      const idProducto = +event.target.dataset.id
      eliminarProductoDelCarrito(idProducto)
    })
  })
}

const eliminarProductoDelCarrito = (idProducto) => {
  let carrito = obtenerCarritoDelLocalStorage()
  carrito = carrito.filter((producto) => producto.id !== idProducto)

  guardarCarritoEnLocalStorage(carrito)

  actualizarNumeroItemsCarrito()
}

const actualizarNumeroItemsCarrito = () => {
  const carrito = obtenerCarritoDelLocalStorage()
  const numeroItems = carrito.reduce(
    (total, producto) => total + producto.cantidad,
    0
  )

  const botonCarrito = document.querySelector(".boton-carrito")
  botonCarrito.innerHTML = `<i class="fas fa-shopping-cart"></i> (${numeroItems})`
}

mostrarProductosEnCarrito()

const calcularPrecioTotalCarrito = () => {
  const carrito = obtenerCarritoDelLocalStorage()
  const precioTotal = carrito.reduce((total, producto) => {
    const precioProducto = producto.precio * producto.cantidad
    return total + precioProducto
  }, 0)

  return precioTotal
}

const finalizarCompra = document.querySelector("#finalizarCompra")
finalizarCompra.addEventListener("click", () => {
  const precioTotal = calcularPrecioTotalCarrito()
  const mensaje = `El valor total de tu compra es de: $ ${precioTotal}`

  Swal.fire({
    title: "Compraste Correctamente!",
    text: mensaje,
    icon: "success",
    position: "top",
    showConfirmButton: true,
    confirmButtonText: "Ok!",
    showCancelButton: true,
    cancelButtonText: "Salir",
    timer: 30000,
    width: 500,
    color: "#fff",
    background: "#000",
    backdrop: "#rgba(0, 0, 0, 0.8)",
  }).then((resultado) => {
    if (resultado.isConfirmed) {
      Swal.fire({
        title: "Pedido Confirmado.",
      })
    }
    if (resultado.isDismissed) {
      Swal.fire({
        title: "Pedido NO Confirmado.",
      })
    }
  })
})