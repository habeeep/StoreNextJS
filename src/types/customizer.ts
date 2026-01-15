export interface CustomizationResponse {
  id: string;
  title: string;
  customizationName: string;
  isActive: boolean;
}

export interface CustomizerState {
  title: string;
  theme: string;
  background: string;
  font: string;
  loading: boolean;
  error: string | null;
}
