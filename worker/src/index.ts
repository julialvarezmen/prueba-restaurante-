import amqp from 'amqplib';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
// Usar el nombre del servicio de Docker Compose para la conexión
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://admin:admin123@rabbitmq:5672/';
const QUEUE_NAME = 'order_queue';

interface OrderMessage {
  orderId: string;
  userId: string;
  addressId: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  notes?: string;
}

async function processOrder(message: OrderMessage) {
  console.log(`📦 Procesando pedido: ${message.orderId}`);
  
  try {
    // Simular tiempo de procesamiento/preparación (5 segundos)
    console.log(`⏳ Preparando pedido ${message.orderId}...`);
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Actualizar estado del pedido a PREPARING
    await prisma.order.update({
      where: { id: message.orderId },
      data: { status: 'PREPARING' }
    });
    
    console.log(`✅ Pedido ${message.orderId} actualizado a PREPARING`);
  } catch (error: any) {
    console.error(`❌ Error procesando pedido ${message.orderId}:`, error);
    throw error;
  }
}

async function startConsumer() {
  try {
    console.log('🔌 Conectando a RabbitMQ...');
    console.log(`📍 URL de conexión: ${RABBITMQ_URL.replace(/:[^:@]+@/, ':****@')}`); // Ocultar contraseña en logs
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    
    // Asegurar que la cola existe
    await channel.assertQueue(QUEUE_NAME, { durable: true });
    console.log(`✅ Conectado a RabbitMQ. Esperando mensajes en cola: ${QUEUE_NAME}`);
    
    // Configurar prefetch (procesar un mensaje a la vez)
    channel.prefetch(1);
    
    // Consumir mensajes
    channel.consume(QUEUE_NAME, async (msg) => {
      if (!msg) return;
      
      try {
        const orderData: OrderMessage = JSON.parse(msg.content.toString());
        console.log(`📨 Mensaje recibido: Pedido ${orderData.orderId}`);
        
        // Procesar pedido
        await processOrder(orderData);
        
        // Confirmar procesamiento
        channel.ack(msg);
        console.log(`✅ Mensaje procesado y confirmado: ${orderData.orderId}`);
      } catch (error: any) {
        console.error('❌ Error procesando mensaje:', error);
        // Rechazar mensaje y no reencolar (para evitar loops infinitos)
        channel.nack(msg, false, false);
      }
    }, {
      noAck: false // Requerir confirmación manual
    });
    
    console.log('👂 Worker escuchando mensajes...');
    
    // Manejar cierre graceful
    process.on('SIGINT', async () => {
      console.log('🛑 Cerrando conexión...');
      await channel.close();
      await connection.close();
      await prisma.$disconnect();
      process.exit(0);
    });
    
  } catch (error: any) {
    console.error('❌ Error en consumer:', error);
    console.error(`📍 URL intentada: ${RABBITMQ_URL.replace(/:[^:@]+@/, ':****@')}`);
    if (error.code === 'ECONNREFUSED') {
      console.error('💡 Verifica que RabbitMQ esté corriendo y accesible en la red Docker');
      console.error('💡 Asegúrate de usar el nombre del servicio "rabbitmq" en lugar de una IP');
    }
    // Reintentar después de 5 segundos
    console.log('🔄 Reintentando conexión en 5 segundos...');
    setTimeout(startConsumer, 5000);
  }
}

// Iniciar consumer
startConsumer();

