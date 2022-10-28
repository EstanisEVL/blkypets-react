import React, { useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { DateTime } from 'luxon';
import Contexts from '../../utils/context/Contexts';

const MySwal = withReactContent(Swal);

const CartContext = ({ children }) => {
  const [ cart, setCart ] = useState([]);
  
  const isInCart = ( id ) => cart.find(product => product.id === id) ? true : false;

  // Agregar un producto al carrito:
  // No acepta duplicados.
  // Acumula cantidades.
  const addItem = ( item, quantity ) => {
    if(isInCart(item.id)){
      setCart(cart.map(product => {
        return product.id === item.id ? { ...product, quantity: product.quantity + quantity} : product;
      }));
    }else{
      setCart([...cart, {...item, quantity}]);
    };
  };
  // Remover un producto del carrito:
  const removeItem = ( id ) => {
    setCart(cart.filter(product => product.id !== id));
    return MySwal.fire({
      title: '¡Producto eliminado del carrito!',
      icon: 'warning',
      confirmButtonText: 'ACEPTAR'
    });
  };
  // Limpiar carrito:
  const clear = () => setCart([]);
  // Precio total:
  const fullPrice = () => {
    return cart.reduce((previous, current) => previous + current.quantity * current.price, 0);
  }
  // Cambiar estado de la orden:
  const setOrderState = () => {
    return 'generada';
  }
  // Asignar fecha de la orden:
  const setOrderDate = () => {
    const now = DateTime.now()
    return now.toLocaleString(DateTime.DATETIME_FULL);
  }

  // Total de productos en el cartWidget:
  const productsTotal = () => cart.reduce((acc, selectedProduct) => acc + selectedProduct.quantity, 0);

  return(
    <Contexts.cartContext.Provider value={{
      isInCart,
      addItem,
      removeItem,
      clear,
      fullPrice,
      setOrderState,
      setOrderDate,
      productsTotal,
      cart,
      }}>
        { children }
    </Contexts.cartContext.Provider>
  );
};

export default CartContext;