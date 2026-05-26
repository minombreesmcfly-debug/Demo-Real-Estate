export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  imageUrl: string;
  videoUrl?: string;
  features: string[];
  isPinned?: boolean;
  agentId?: string;
  agentName?: string;
  createdAt?: any;
}

export interface Booking {
  id: string;
  propertyId: string;
  propertyName: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  dateTime: string;
  status: 'Pendiente' | 'Contactado' | 'Visita Realizada' | 'Cancelado';
  agentId?: string;
  agentName?: string;
  createdAt?: any;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  photoUrl?: string;
  zone?: string;
  createdAt?: any;
}

export interface DemoSettings {
  id: string;
  primaryColor: string;
  coverText: string;
  contactPhone: string;
  contactEmail: string;
  instagramUrl: string;
  twitterUrl: string;
}
