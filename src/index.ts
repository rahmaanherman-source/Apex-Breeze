/**
 * Apex-Bridge — Entry Module
 *
 * Bootstraps the ApiBridgeManager with a default e-commerce endpoint
 * configuration and starts the local server on port 3000.
 *
 * All traffic is constrained to 127.0.0.1 (loopback) by the zero-trust
 * routing layer; no external network access is required or permitted.
 */

import { ApiBridgeManager } from './bridge/ApiBridgeManager';
import { EcommerceEndpointConfig } from './database/HandshakeController';

const BRIDGE_PORT = Number(process.env.BRIDGE_PORT ?? 3000);

const endpointConfig: EcommerceEndpointConfig = {
  baseUrl: process.env.ECOMMERCE_BASE_URL ?? 'https://store.example.local',
  apiKey: process.env.ECOMMERCE_API_KEY ?? '',
  catalogPath: '/catalog',
  assetPath: '/assets',
  themePath: '/themes',
};

const bridge = new ApiBridgeManager(BRIDGE_PORT, endpointConfig);
bridge.start();
