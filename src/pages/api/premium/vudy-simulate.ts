import type { APIRoute } from 'astro';
import { simulateVudyPayment } from '../../../lib/vudy';

/**
 * Simulación de solicitud de pago con Vudy API (no real).
 * Usado por la página Premium del prototipo.
 */
export const GET: APIRoute = async () => {
  try {
    const result = await simulateVudyPayment();
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Vudy simulate error', err);
    return new Response(
      JSON.stringify({ success: false, message: 'Error al simular pago con Vudy.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
