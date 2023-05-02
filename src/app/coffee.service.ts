import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})


export class CoffeeService {
  private pricesUrl = 'assets/data/prices.json'; //http://localhost:3000/prices- URL for prices JSON
  private ordersUrl = 'assets/data/orders.json'; // URL for orders JSON
  private paymentsUrl = 'assets/data/payments.json'; // URL for payments JSON
  OrderTotals = {};
  //   The OrderTotals type is an object where the keys are the usernames and the values are the total cost of the orders for each user.
    
  constructor(private http: HttpClient) {
    console.log(`${this.pricesUrl} is true printed`);
   }

  // Load the list of prices
  getPrices() {
    return this.http.get(this.pricesUrl);
  }

  // Load the orders
  getOrders() {
    return this.http.get(this.ordersUrl);
  }

  // Load the payments
  getPayments() {
    return this.http.get(this.paymentsUrl);
  }

  // Helper function to calculate the total cost of an order
  calculateOrderCostold(_order: any) {
    // Implementation of the helper function goes here
    // private baseUrl = 'http://example.com/api'; // Replace with your API base URL

    // constructor(private http: HttpClient) { }
  
    // getPrices(): Observable<Prices> {
    //   const url = `${this.baseUrl}/prices`;
    //   return this.http.get<Prices>(url);
    // }
  
    // getOrders(): Observable<Order[]> {
    //   const url = `${this.baseUrl}/orders`;
    //   return this.http.get<Order[]>(url);
    // }
  
    // getPayments(): Observable<Payment[]> {
    //   const url = `${this.baseUrl}/payments`;
    //   return this.http.get<Payment[]>(url);
    // }
  
  }
  calculateOrderCost(order: Order, price: Prices) {
   // const orderTotals: OrderTotals = {};
  
    // Loop through each order
    // orders.forEach((order: Order) => {
      const size = order.size;
      const cost = price.prices;
      //const size = 'huge';
    
     // const cost ={large: 5, huge: 5.5, mega: 6, ultra: 7};
      const actualPrice = cost[size];
      const user: string = order.user;
  console.log('cost-----price',price.prices)
      // Add the price of the beverage to the user's order total
    //   if (actualPrice && user) {
    //     if (orderTotals[user]) {
    //       orderTotals[user] += actualPrice;
    //     } else {
    //       orderTotals[user] = actualPrice;
    //     }
    //   }
    // });
    console.log('actualPrice-----',actualPrice)
    return actualPrice;
  }
//   Note: OrderTotals is a custom type that represents an object containing the total cost of orders for each user. It is defined as follows:

//   type OrderTotals = { [user: string]: number };
//   The OrderTotals type is an object where the keys are the usernames and the values are the total cost of the orders for each user.
  
// private baseUrl = 'http://example.com/api'; // Replace with your API base URL

// constructor(private http: HttpClient) { }

// getPrices(): Observable<Prices> {
//   const url = `${this.baseUrl}/prices`;
//   return this.http.get<Prices>(url);
// }

// getOrders(): Observable<Order[]> {
//   const url = `${this.baseUrl}/orders`;
//   return this.http.get<Order[]>(url);
// }
    
  

  // Main function to process the data and return the results
  processData() {
    // Implementation of the main function goes here
    let results = {
      orderTotals: {},
      paymentTotals: {},
      balances: {}
    };
    let pricesdata = this.getPrices();
    console.log('pricesdata----------',pricesdata);
  return forkJoin([
    this.getPrices(),
    this.getOrders(),
    this.getPayments()
  ]).pipe(
    map(([prices, orders, payments]) => {
      // Calculate the total cost of each user's orders
      console.log('prices----------',prices);
      console.log('orders----------',orders);
      let orderTotals:OrderTotals = {};
      Object.values(orders).forEach((order: any) => {
        const user = order.user;
        const drink = order.drink;
        const size = order.size;
        const price = Object.values(prices).find(elem => {return elem.drink_name === drink});
        console.log('order--filter--------',order);
        console.log('price--filter--------',price);
        const cost = this.calculateOrderCost(order, price);
        if (!orderTotals[user]) {
          orderTotals[user] = 0;
        }
          orderTotals[user] += cost;
      });

      // Calculate the total payment for each user
      const paymentTotals:PaymentTotals = {};
      Object.values(payments).forEach((payment: any) => {
        const user = payment.user;
        const amount = payment.amount;
        if (!paymentTotals[user]) {
          paymentTotals[user] = 0;
        }
        paymentTotals[user] += amount;
      });
    
      // Calculate what each user now owes
      const balances : Balances= {};
      for (const user in orderTotals) {
        if (orderTotals.hasOwnProperty(user)) {
          const orderTotal = orderTotals[user];
          const paymentTotal = paymentTotals[user] || 0;
          balances[user] = orderTotal - paymentTotal;
        }
      }
    
      // Construct the results object
      results['orderTotals'] = orderTotals;
      results['paymentTotals'] = paymentTotals;
      results['balances'] = balances;
      return results;
    })
  );
    
  }



}

export interface Prices {
    drink_name: string;
    prices: Cost;
  }
  
  export interface Cost {
    // small?: number;
    // medium?: number;
    // large?: number;
    // huge?:number;
    // mega?:number;
    // ultra?:number;
    [size: string]: number;
  }
  
  export interface Order {
    user: string;
    drink: string;
    size: string;
  }
  
  export interface Payment {
    user: string;
    amount: number;
  }

  export interface OrderTotals {
    [user: string]: number;
  }

  export interface PaymentTotals {
    [user: string]: number;
  }

  export interface Balances {
    [user: string]: number;
  }