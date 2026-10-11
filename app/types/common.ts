import type { ButtonHTMLAttributes } from "react";
export interface IButton extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  action: () => void;
  heirarchy: "primary" | "secondary";
  length?: "full-width";
  isLoading?: boolean;
}

export interface IApiResponse {
  status: "success" | "failure";
  message: string;
  data: any | any[];
}

export type User = {
  id: string;
  emailId: string;
  role: "buyer" | "seller" | "admin";
  upiId?: string;
  hasOrders: boolean;
  wantToBecomeSeller: boolean;
};

export interface Artist extends User {
  username: string;
  profile_photo: string;
  description: string;
  socials: { instagram: string; x: string }[];
  wa_number: number;
}

export type HomePageArtifact = { id: string; slug: string; image: string };

export type GridArtifact = {
  id: string;
  slug: string;
  title: string;
  images: string[];
  amount: number;
  by_artist: string;
};

export type GridMember = {
  id: string;
  profile_photo: string;
  username: string;
};

export interface CacheEntry {
  data: any;
  timestamp: number;
}

type ArtistPaymentDetails = {
  username: string;
  email_id: string;
  upi_id: string;
  whatsapp_number?: number;
};

export interface DetailedArtifact extends GridArtifact {
  category: string[];
  description: string;
  artist: ArtistPaymentDetails;
  deliverable_file_formats: string[];
  // yes it contains one file but its zip file hence plural, might update column name it in future
  deliverable_files: string;
  is_published?: boolean;
}

export interface DetailedMember extends GridMember {
  description: string;
  socials: { instagram: string; x: string }[];
}

export type Order = {
  id: string;
  artifact: string;
  artifact_slug: string;
  artifact_image: string;
  artist_upi_id: string;
  artist_username: string;
  amount: string | number;
  utr: number;
  payment_status: string;
  created_at: string;
  updated_at: string;
  content_url?: string;
  row_colour: string;
  payment_status_info: string;
  payment_status_color: { bg_color: string; text_color: string };
  buyer_upi_id: string;
};
