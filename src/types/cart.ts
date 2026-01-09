export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  isSelected: boolean;
  imageUrl: string;
}

export interface OrderInfo {
  totalItems: number;
  totalPrice: number;
  address: string;
}

export interface CartState {
  items: CartItem[];
  orderInfo: OrderInfo;
}