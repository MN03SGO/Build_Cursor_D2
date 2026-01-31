/**
 * Simulación de Vudy API para el prototipo (no realiza pagos reales).
 */

export interface VudySimulationResult {
  success: boolean;
  message: string;
  transactionId?: string;
}

/**
 * Simula una solicitud de pago a Vudy API.
 * No realiza ninguna llamada real ni cobro.
 */
export async function simulateVudyPayment(amount?: number): Promise<VudySimulationResult> {
  await new Promise((r) => setTimeout(r, 1500));
  return {
    success: true,
    message: 'Simulación OK: solicitud de pago enviada (Vudy API). No es un pago real.',
    transactionId: `sim_${Date.now()}`,
  };
}
