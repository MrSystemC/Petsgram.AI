import React from 'react';

export enum UserRole {
  OWNER = 'OWNER',
  VET = 'VET',
  FARMER = 'FARMER',
  SCIENTIST = 'SCIENTIST',
  ECO_ACTIVIST = 'ECO_ACTIVIST'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isError?: boolean;
}

export interface FeatureCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  CHAT = 'CHAT',
  DIAGNOSTICS = 'DIAGNOSTICS',
  COMMUNITY = 'COMMUNITY'
}