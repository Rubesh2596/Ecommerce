// This interface defines the structure of a product from the API
export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

// This interface extends the Product type to include a 'quantity' field for the cart
export interface CartItem extends Product {
  quantity: number;
}

