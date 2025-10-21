# RETO - INGENIERÍA DE SOFTWARE II PRIMER CORTE

---

- Cristian Andrés Basto Largo 
- Andrea Katherine Bello Sotelo
- Laura Vanessa Figueredo Martinez

---

# Manual Técnico
## LoginMicroservice (Login Microservice )
## OrderMgmtMicroservice (Order Microservice)

## Propósito
El microservicio OrderMgmtMicroservice gestiona órdenes de clientes: creación, actualización de estado y consulta por cliente. Está desacoplado del login (que maneja autenticación y emisión de JWT). Este servicio es puramente de negocio sobre órdenes y persiste en MongoDB.

Nuestra arquitectura asume:
- Autenticación y emisión de JWT: loginMicroservice.
- Filtrado / verificación del JWT: API Gateway.
- OrderMgmtMicroservice confía en el Gateway (capa de confianza interna).  
Si se requiere validar el JWT directamente aquí, se agregaría un middleware que:
1. Lee Authorization: Bearer <token>
2. Verifica firma (misma secret/key que login)
3. Rechaza con 401 si es inválido.  

No es necesario mientras el Gateway controle acceso.

## Persistencia de datos

Persistimos en MongoDB:
- Base: OrderDB
- Colección: Order
La persistencia se verifica fácilmente:
1. Crear una orden (endpoint createorder).
2. Reiniciar el microservicio (no borrar Mongo).
3. Consultar por customerid → la orden sigue presente.
También se puede inspeccionar en Mongo:
`db.Order.find()` (vía mongosh).  
Cada documento mantiene: customerid, orderID (en caso de no especificarlo se asigna un UUID), status.

## Arquitectura por capas (DTO / Domain / Repository / Service / Controller)

- OrderMgmtMicroservice/ main.py (Bootstrap FastAPI + CORS + eventos) 
- eureka.py (Registro Eureka + heartbeats) 
- db.py (Conexión Mongo) 

- domain/order.py (Modelo de dominio) 
- dto/order_dto.py (DTOs de entrada/salida) 
- repository/order_repository.py (Acceso a Mongo) 
- service/order_service.py (Reglas de negocio) 
- controller/order_controller.py (Rutas / Endpoints) 
- requirements.txt


### Flujo de una petición (POST /order/createorder)
1. Controller recibe JSON → valida con DTO CreateOrderRequest.
2. Service genera UUID si no viene orderID.
3. Repository inserta documento async en Mongo.
4. Controller devuelve {"orderCreated": true}.

- DTO: desacopla estructura externa de la representación interna.
- Domain: permite extender lógica sin tocar DTO.
- Service: espacio para reglas (validar estados, etc.).
- Controller: sólo orquestación HTTP.

## Explicación

### main.py (arranque)

Responsabilidades:
- Crear instancia FastAPI.
- Registrar router de /order.
- Exponer /health (usado por Eureka).
- Invocar start_eureka_registration() en startup y stop_eureka_registration() en shutdown.

### eureka.py (integración Eureka)
Responsabilidades:
- Construir XML minimal para POST /apps/{APP_NAME}.
- Forzar hostname a 'localhost' (INSTANCE_ID = localhost:order-microservice:8082).
- Enviar heartbeats PUT /apps/{APP_NAME}/{INSTANCE_ID} cada 10s (configurable).
- Deshabilitable con EUREKA_ENABLED=0.
Variables relevantes:
- APP_NAME, EUREKA_SERVER, EUREKA_HOSTNAME, EUREKA_HEARTBEAT_INTERVAL, PORT.

### db.py
Conexión a Mongo:
- Crea AsyncIOMotorClient a mongodb://localhost:27017
- Expone `db = client["OrderDB"]`.

### domain/order.py
Modelo base.

### dto/order_dto.py
DTOs:
- CreateOrderRequest: customerid, orderID opcional, status.
- UpdateOrderStatusRequest: orderID, status.
- OrderResponse: customerid, orderID, status.

### repository/order_repository.py
Funciones async contra Mongo:
- insert_order(document)
- update_status(order_id, status)
- find_by_customer(customerid)

Uso de índices (opcional en mejora futura).  
Se mantiene lógica mínima: no resuelve validaciones de estado (eso iría a service).

### service/order_service.py
Reglas de negocio:
- generate orderID (UUID4) si falta.
- Llama repository.
- Normaliza retorno booleano (true cuando update modifica >=1 documento).

### controller/order_controller.py
Define endpoints:
- POST /order/createorder
- PUT /order/updateorderstatus
- GET /order/findorderbycustomerid
Respuestas simplificadas (banderas booleanas) para cumplir requerimiento exacto.

## Endpoints
1. POST /order/createorder  
   Body: { "customerid": "...", "status": "PENDING" }  
   Respuesta: { "orderCreated": true }
2. PUT /order/updateorderstatus  
   Body: { "orderID": "...", "status": "SHIPPED" }  
   Respuesta: { "orderStatusUpdated": true }
3. GET /order/findorderbycustomerid?customerid=...  
   Respuesta: [ { "customerid": "...", "orderID": "...", "status": "..." }, ... ]

---

El OrderMgmtMicroservice implementa gestión de órdenes simple, asincrónica y escalable con FastAPI y MongoDB. Se registra en Eureka para ser descubierta por el gateway y delega autenticación al ecosistema existente. La estructura de capas permitirá añadir reglas y seguridad sin refactorizaciones mayores.

---
