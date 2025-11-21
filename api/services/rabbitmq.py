import aio_pika
import json
import os
from typing import Dict, Any
from datetime import datetime

RABBITMQ_URL = os.getenv("RABBITMQ_URL", "amqp://admin:admin123@localhost:5672/")
QUEUE_NAME = "order_queue"

async def get_connection():
    """Obtener conexión a RabbitMQ"""
    return await aio_pika.connect_robust(RABBITMQ_URL)

def json_serial(obj):
    """JSON serializer for objects not serializable by default json code"""
    if isinstance(obj, datetime):
        return obj.isoformat()
    raise TypeError(f"Type {type(obj)} not serializable")

async def publish_order(order_data: Dict[str, Any]):
    """
    Publicar mensaje de pedido a la cola order_queue
    """
    try:
        connection = await get_connection()
        channel = await connection.channel()
        
        # Declarar cola (si no existe, se crea)
        queue = await channel.declare_queue(QUEUE_NAME, durable=True)
        
        # Publicar mensaje (convertir datetime a ISO format)
        message_body = json.dumps(order_data, default=json_serial)
        await channel.default_exchange.publish(
            aio_pika.Message(
                body=message_body.encode(),
                delivery_mode=aio_pika.DeliveryMode.PERSISTENT
            ),
            routing_key=QUEUE_NAME
        )
        
        print(f"✅ Mensaje publicado a {QUEUE_NAME}: {order_data.get('id')}")
        await connection.close()
        return True
    except Exception as e:
        print(f"❌ Error publicando mensaje: {e}")
        raise

