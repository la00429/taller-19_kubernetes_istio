# Service Mesh Kubernetes - Proyecto de Microservicios con Istio

Este repositorio contiene dos proyectos principales que demuestran la implementación de Service Mesh con Istio en Kubernetes:

1. **sample-istio-services**: Proyecto de ejemplo con microservicios Java
2. **Reto4**: Proyecto de microservicios multi-tecnología con Service Mesh

## 🚀 Requisitos Previos

- **Minikube** instalado y configurado
- **Istio** instalado
- **Docker** instalado
- **Git** instalado
- **Java 11+** (para loginMicroservice)
- **Python 3.9+** (para orderMgmtMicroservice)
- **Go 1.21+** (para userMgmtMicroservice)
- **Node.js 18+** (para frontend)

## 📁 Estructura del Proyecto

```
serviceMesh_Kubernetes/
├── sample-istio-services/          # Proyecto de ejemplo
│   ├── caller-service/             # Microservicio Java
│   ├── callme-service/             # Microservicio Java (v1/v2)
│   ├── first-service/              # Microservicio Java
│   └── k8s/                        # Configuraciones Istio
├── Reto4/                          # Proyecto principal
│   ├── loginMicroservice/          # Java + Spring Boot + MySQL
│   ├── orderMgmtMicroservice/      # Python + FastAPI + MongoDB
│   ├── userMgmtMicroservice/       # Go + PostgreSQL
│   ├── frontend/                   # React + Node.js
│   ├── k8s/                        # Manifiestos Kubernetes + Istio
│   └── deploy.sh                   # Script de deployment
└── README.md
```

## 🔧 Proyecto 1: sample-istio-services

### Ejecución

```bash
# 1. Iniciar Minikube
minikube start --memory=6144

# 2. Instalar Istio
istioctl install --set values.defaultRevision=default

# 3. Configurar Docker
eval $(minikube docker-env)

# 4. Construir imágenes
cd sample-istio-services
docker build -t caller-service:1.1.0 ./caller-service/
docker build -t callme-service:1.1.0 ./callme-service/
docker build -t first-service:1.1.0 ./first-service/

# 5. Desplegar servicios
kubectl apply -f caller-service/k8s/deployment.yaml
kubectl apply -f callme-service/k8s/deployment.yaml
kubectl apply -f first-service/k8s/deployment.yaml

# 6. Aplicar reglas Istio
kubectl apply -f k8s/istio-c1.yaml
kubectl apply -f k8s/istio-c2.yaml

# 7. Obtener URLs
minikube service caller-service --url
minikube service callme-service --url
minikube service first-service --url
```

### Endpoints Disponibles

- **Caller Service**: `GET /caller/ping` - Servicio principal
- **Callme Service**: `GET /callme/ping` - Servicio llamado (v1/v2)
- **First Service**: `GET /first/ping` - Servicio adicional

## 🔧 Proyecto 2: Reto4 - Microservicios Multi-Tecnología

### Ejecución Automática

```bash
cd Reto4
bash deploy.sh
```

### Ejecución Manual

```bash
# 1. Iniciar Minikube e Istio
minikube start --memory=6144
istioctl install --set values.defaultRevision=default

# 2. Configurar Docker
eval $(minikube docker-env)

# 3. Compilar microservicios
cd loginMicroservice && mvn clean package -DskipTests && cd ..
cd orderMgmtMicroservice && pip install -r requirements.txt && cd ..
cd userMgmtMicroservice && go mod tidy && go build -o main . && cd ..
cd frontend && npm install && cd ..

# 4. Construir imágenes Docker
docker build -t login-service:1.0.0 ./loginMicroservice/
docker build -t order-service:1.0.0 ./orderMgmtMicroservice/
docker build -t user-service:1.0.0 ./userMgmtMicroservice/
docker build -t frontend-service:1.0.0 ./frontend/

# 5. Desplegar bases de datos
kubectl apply -f k8s/mysql.yaml
kubectl apply -f k8s/postgres.yaml
kubectl apply -f k8s/mongodb.yaml

# 6. Desplegar microservicios
kubectl apply -f k8s/login-service.yaml
kubectl apply -f k8s/order-service.yaml
kubectl apply -f k8s/user-service.yaml
kubectl apply -f k8s/frontend-service.yaml

# 7. Aplicar configuración Istio
kubectl apply -f k8s/istio-gateway.yaml

# 8. Obtener URLs
minikube service frontend-service --url
minikube service login-service --url
```

### Arquitectura de Microservicios

| Microservicio | Tecnología | Puerto | Base de Datos | Endpoints |
|---------------|------------|--------|---------------|-----------|
| **login-service** | Java + Spring Boot | 8081 | MySQL | `/api/login` |
| **order-service** | Python + FastAPI | 8000 | MongoDB | `/api/order` |
| **user-service** | Go | 8080 | PostgreSQL | `/api/user` |
| **frontend** | React + Node.js | 3000 | - | `/` |

### Endpoints Disponibles

- **Frontend**: `http://localhost:3000` - Interfaz de usuario
- **Login API**: `http://localhost:8081/api/login` - Autenticación
- **Order API**: `http://localhost:8000/api/order` - Gestión de órdenes
- **User API**: `http://localhost:8080/api/user` - Gestión de usuarios

## 🔍 Comandos de Diagnóstico

### Verificar Estado de Pods
```bash
kubectl get pods
kubectl get services
kubectl get gateways
kubectl get virtualservices
```

### Verificar Inyección de Sidecar
```bash
kubectl get pods -o jsonpath='{.items[*].spec.containers[*].name}'
kubectl describe pod <pod-name>
```

### Logs de Envoy
```bash
kubectl logs <pod-name> -c istio-proxy
kubectl logs <pod-name> -c <container-name>
```

### Verificar Conectividad
```bash
kubectl exec -it <pod-name> -c <container-name> -- curl <service-name>:<port>/health
```

## 🛠️ Troubleshooting

### Problemas Comunes

1. **Error de conexión a base de datos**: Verificar que las bases de datos estén ejecutándose
2. **Error de imagen no encontrada**: Ejecutar `eval $(minikube docker-env)` antes de construir imágenes
3. **Error de puerto**: Verificar que los puertos en los manifiestos coincidan con los de las aplicaciones
4. **Error de sidecar**: Verificar que Istio esté instalado y configurado correctamente

### Limpiar Recursos

```bash
# Limpiar Reto4
kubectl delete -f Reto4/k8s/

# Limpiar sample-istio-services
kubectl delete -f sample-istio-services/caller-service/k8s/
kubectl delete -f sample-istio-services/callme-service/k8s/
kubectl delete -f sample-istio-services/first-service/k8s/

# Limpiar Istio
istioctl uninstall --purge
```

## 📚 Conceptos de Service Mesh Implementados

- **Sidecar Injection**: Inyección automática de proxies Envoy
- **Service Discovery**: Descubrimiento automático de servicios
- **Load Balancing**: Balanceamiento de carga entre instancias
- **Traffic Management**: Gestión de tráfico con VirtualService y DestinationRule
- **Gateway**: Punto de entrada único para tráfico externo
- **Circuit Breaker**: Patrón de circuit breaker para resilencia
- **Retry Policy**: Políticas de reintento automático
- **Observability**: Logs y métricas de tráfico

## 🎯 Objetivos del Proyecto

1. **Demostrar Service Mesh**: Implementación práctica de Istio en microservicios
2. **Multi-tecnología**: Integración de diferentes lenguajes y frameworks
3. **Escalabilidad**: Despliegue en Kubernetes con Istio
4. **Observabilidad**: Monitoreo y logging distribuido
5. **Resilencia**: Patrones de circuit breaker y retry

---

**Desarrollado por:** Laura
**Repositorio:** https://github.com/la00429/taller-19_kubernetes_istio
