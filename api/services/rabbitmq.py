import aio_pika
import json
import os
import uuid
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
    if isinstance(obj, uuid.UUID):
        return str(obj)
    raise TypeError(f"Type {type(obj)} not serializable")

async def publish_order(order_data: Dict[str, Any]):
    """
    Publicar mensaje de pedido a la cola order_queue
    El formato debe ser compatible con el worker que espera:
    {
        "orderId": str,
        "userId": str,
        "addressId": str,
        "items": [...],
        "total": float,
        "notes": str (opcional)
    }
    """
    try:
        connection = await get_connection()
        channel = await connection.channel()
        
        # Declarar cola (si no existe, se crea)
        queue = await channel.declare_queue(QUEUE_NAME, durable=True)
        
        # Formatear mensaje para el worker
        # Asegurar que los items tengan el formato correcto (productId, quantity, price)
        items = []
        for item in order_data.get("items", []):
            items.append({
                "productId": str(item.get("productId", item.get("product_id", ""))),
                "quantity": int(item.get("quantity", 0)),
                "price": float(item.get("price", 0))
            })
        
        message = {
            "orderId": str(order_data.get("id", "")),
            "userId": str(order_data.get("userId", "")),
            "addressId": str(order_data.get("addressId", "")),
            "items": items,
            "total": float(order_data.get("total", 0)),
            "notes": order_data.get("notes")
        }
        
        # Publicar mensaje (convertir datetime y UUID a formatos serializables)
        message_body = json.dumps(message, default=json_serial)
        await channel.default_exchange.publish(
            aio_pika.Message(
                body=message_body.encode(),
                delivery_mode=aio_pika.DeliveryMode.PERSISTENT
            ),
            routing_key=QUEUE_NAME
        )
        
        print(f"✅ Mensaje publicado a {QUEUE_NAME}: {message.get('orderId')}")
        await connection.close()
        return True
    except Exception as e:
        print(f"❌ Error publicando mensaje: {e}")
        import traceback
        traceback.print_exc()
        raise

