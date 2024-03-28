// import React from 'react'

// const CheckoutPage = () => {
//   return (
//     <div className='cart-page-details'>
//         <div className='cart-page-cost'>
//             <div style={{ width: '100%' }}>

//                 <h3 style={{ color: '##002F8E', margin: '0', marginBottom: '1.2rem' }}>CART</h3>
//                 <div className='cart-items-list'>
//                     {cartState.items.map((item, index) => (
//                         <div key={index} className='cart-item'>
//                             <div
//                                 style={{ display: 'flex' }}
//                             >
//                                 <div
//                                     style={{
//                                         display: 'flex',
//                                         flexDirection: 'column',
//                                         justifyContent: 'center',
//                                         alignItems: 'center',
//                                         background: "#E8EFFA",
//                                         padding: '0.5rem',
//                                         marginRight: '0.5rem',
//                                     }}
//                                 >
//                                     <img
//                                         src={item.matched_img}
//                                         alt="Product"
//                                         style={{
//                                             width: '85px'
//                                         }} />
//                                 </div>
//                                 <div
//                                     style={{
//                                         display: 'flex',
//                                         flexDirection: 'column',
//                                         justifyContent: 'flex-start',
//                                         alignItems: 'flex-start'
//                                     }}
//                                 >
//                                     <Text strong style={{ fontSize: '1.5rem' }}>{item.name}
//                                         {/* - {item.fact} */}
//                                     </Text>
//                                     <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
//                                         <Button
//                                             style={{
//                                                 borderRadius: '50%',
//                                                 display: 'flex',
//                                                 alignItems: 'center',
//                                                 justifyContent: 'center',
//                                                 background: '#90A0B7',
//                                                 color: 'white',
//                                                 padding: '0.5rem'
//                                             }}
//                                             onClick={() => {
//                                                 // Example function to handle decrementing item units
//                                                 const updatedItems = cartState.items.map((cartItem) =>
//                                                     cartItem.upc === item.upc ? { ...cartItem, numUnits: Math.max(cartItem.numUnits - 1, 0) } : cartItem
//                                                 ).filter((cartItem) => cartItem.numUnits > 0);
//                                                 setCartState(calculateTotals(updatedItems));
//                                             }}><svg xmlns="http://www.w3.org/2000/svg" width="11" height="3" viewBox="0 0 11 3" fill="none">
//                                                 <path d="M9.81299 1.5H1.13007" stroke="white" stroke-width="2" stroke-linecap="round" />
//                                             </svg></Button>
//                                         &nbsp; &nbsp;
//                                         <Text style={{ fontSize: '2rem' }}>{item.numUnits}</Text>
//                                         &nbsp; &nbsp;
//                                         <Button
//                                             style={{
//                                                 borderRadius: '50%',
//                                                 display: 'flex',
//                                                 alignItems: 'center',
//                                                 justifyContent: 'center',
//                                                 background: '#90A0B7',
//                                                 color: 'white',
//                                                 padding: '0.5rem'
//                                             }}
//                                             onClick={() => {
//                                                 // Example function to handle incrementing item units
//                                                 const updatedItems = cartState.items.map((cartItem) =>
//                                                     cartItem.upc === item.upc ? { ...cartItem, numUnits: cartItem.numUnits + 1 } : cartItem
//                                                 );
//                                                 setCartState(calculateTotals(updatedItems));
//                                             }}><svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 11 11" fill="none">
//                                                 <path d="M9.95876 5.5377H1.17285" stroke="white" stroke-width="2" stroke-linecap="round" />
//                                                 <path d="M5.56586 9.93939V1.1362" stroke="white" stroke-width="2" stroke-linecap="round" />
//                                             </svg></Button>

//                                     </div>
//                                 </div>
//                             </div>
//                             <div
//                                 style={{
//                                     display: 'flex',
//                                     flexDirection: 'column',
//                                     justifyContent: 'space-between',
//                                     alignItems: 'flex-end'
//                                 }}
//                             >
//                                 <div
//                                     onClick={() => {
//                                         // Flow to remove the current detected item from the cart list
//                                         const updatedItems = cartState.items.filter((cartItem) => cartItem.upc !== item.upc);
//                                         setCartState(calculateTotals(updatedItems));

//                                     }}
//                                 >
//                                     <svg xmlns="http://www.w3.org/2000/svg" width="10" height="32" viewBox="0 0 31 32" fill="none">
//                                         <path d="M23.249 23.7523L7.75367 8.25695" stroke="#4F4F4F" stroke-width="3" stroke-linecap="round" />
//                                         <path d="M7.77145 23.7581L23.2642 8.26544" stroke="#4F4F4F" stroke-width="3" stroke-linecap="round" />
//                                     </svg>
//                                 </div>
//                                 <Text style={{ fontSize: '1.5rem' }} strong>${(item.numUnits * item.perUnitCost).toFixed(2)}</Text>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>

//             {<div style={{
//                 justifySelf: 'flex-end',
//                 width: '100%',
//                 display: 'flex',
//                 flexDirection: 'column',
//                 padding: '1rem',
//             }}>
//                 <p
//                     style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
//                 ><span>Subtotal</span><span style={{ fontWeight: 'bold' }}>${cartState.subtotal.toFixed(2)} </span></p>
//                 <p
//                     style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
//                 ><span>Tax</span><span style={{ fontWeight: 'bold' }}>${cartState.tax.toFixed(2)} </span></p>
//                 <div
//                     style={{ width: '100%', height: '1px', background: '#E0E0E0' }}
//                 ></div>
//                 <p
//                     style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
//                 ><span>Total</span><span style={{ fontWeight: 'bold' }}>${cartState.total.toFixed(2)} </span></p>
//             </div>}
//         </div>
//         <Button type="primary" block style={{ width: '100%', fontWeight: 'bold', height: '3rem' }}>Finish and Pay</Button>
//     </div>
//   )
// }

// export default CheckoutPage
export { }