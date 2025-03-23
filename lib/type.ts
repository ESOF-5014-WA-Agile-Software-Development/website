export interface Offer {
  key: number;
  id: number;
  seller: any;
  amount: string;
  pricePerUnit: string;
  isAvailable: any;
}

export interface Purchased {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  block_id: number;
  offer_id: number;
  seller: string;
  buyer: string;
  amount: number;
  timestamp: number;
}

export interface Prediction {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  capacity: number;
  storage: number;
  generation: number;
  consumption: number;
  saleable: number;
};