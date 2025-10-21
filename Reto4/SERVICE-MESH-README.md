# Reto 4 - Service Mesh con Istio

## 🏗️ Arquitectura Service Mesh

Este proyecto implementa un Service Mesh usando Istio para gestionar la comunicación entre microservicios.

### **Microservicios:**
- **login-service** (Java Spring Boot) - Puerto 8081
- **order-service** (Python FastAPI) - Puerto 8082  
- **user-service** (Go) - Puerto 8083
- **gateway-service** (Java Spring Boot) - Puerto 8080

### **Características del Service Mesh:**
- ✅ **Circuit Breaker** para order-service
- ✅ **Retry Policy** para login-service
- ✅ **Load Balancing** para user-service
- ✅ **Traffic Management** con Istio Gateway
- ✅ **Observability** con métricas de Envoy

## 🚀 Despliegue

### **Prerrequisitos:**
```bash
# Minikube
minikube start --driver=docker --cpus=2 --memory=6144

# Istio
istioctl install --set profile=demo -y
kubectl label namespace default istio-injection=enabled
```

### **Despliegue Automático:**
```bash
chmod +x deploy-service-mesh.sh
./deploy-service-mesh.sh
```

### **Despliegue Manual:**
```bash
# 1. Construir imágenes
eval $(minikube docker-env)
docker build -t login-service:1.0.0 ./loginMicroservice/
docker build -t order-service:1.0.0 ./orderMgmtMicroservice/
docker build -t user-service:1.0.0 ./userMgmtMicroservice/
docker build -t gateway-service:1.0.0 ./gateway/

# 2. Desplegar servicios
kubectl apply -f k8s/login-service.yaml
kubectl apply -f k8s/order-service.yaml
kubectl apply -f k8s/user-service.yaml
kubectl apply -f k8s/gateway-service.yaml

# 3. Aplicar reglas de Istio
kubectl apply -f k8s/istio-gateway.yaml
kubectl apply -f k8s/istio-traffic-management.yaml
```

## 🔍 Verificación

### **Verificar Pods:**
```bash
kubectl get pods -o wide
# Debería mostrar 2/2 containers (app + istio-proxy)
```

### **Verificar Service Mesh:**
```bash
# Estado del proxy
istioctl proxy-status

# Configuración del proxy
istioctl proxy-config cluster <pod-name>

# Logs del sidecar
kubectl logs <pod-name> -c istio-proxy
```

### **Probar Endpoints:**
```bash
# Obtener URL
minikube service gateway-service --url

# Probar endpoints
curl http://<URL>/login/authuser
curl http://<URL>/order/createorder
curl http://<URL>/user/customers
```

## 📊 Observabilidad

### **Métricas de Istio:**
```bash
# Ver métricas del sidecar
kubectl logs <pod-name> -c istio-proxy

# Ver configuración de circuit breaker
istioctl proxy-config cluster <pod-name> | grep order-service

# Ver logs de retry
kubectl logs <pod-name> -c istio-proxy | grep "retry"
```

### **Traffic Management:**
- **Circuit Breaker**: Protege order-service de sobrecarga
- **Retry Policy**: Reintenta llamadas fallidas a login-service
- **Load Balancing**: Distribuye carga en user-service

## 🛠️ Troubleshooting

### **Problemas Comunes:**
1. **Pods no inician**: Verificar que Istio esté instalado
2. **Sidecar no inyectado**: Verificar label `istio-injection=enabled`
3. **Conectividad**: Verificar logs del sidecar Envoy

### **Comandos de Debug:**
```bash
# Ver logs de todos los servicios
kubectl logs -f deployment/login-service -c istio-proxy
kubectl logs -f deployment/order-service -c istio-proxy
kubectl logs -f deployment/user-service -c istio-proxy
kubectl logs -f deployment/gateway-service -c istio-proxy

# Ver configuración de Istio
kubectl get virtualservices
kubectl get destinationrules
kubectl get gateways
```

## 🎯 Beneficios del Service Mesh

1. **Resiliencia**: Circuit breakers y retry policies
2. **Observabilidad**: Métricas y logs centralizados
3. **Seguridad**: mTLS automático entre servicios
4. **Traffic Management**: Routing y load balancing
5. **Despliegue**: Canary deployments y traffic splitting

