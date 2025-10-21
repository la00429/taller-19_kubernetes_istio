#!/bin/bash

echo "🚀 Desplegando Reto 4 con Service Mesh (Istio)"

# 1. Iniciar Minikube
echo "📋 Iniciando Minikube..."
minikube start --driver=docker --cpus=2 --memory=6144

# 2. Instalar Istio
echo "🔧 Instalando Istio..."
istioctl install --set profile=demo -y
kubectl label namespace default istio-injection=enabled

# 3. Configurar Docker
echo "🐳 Configurando Docker..."
eval $(minikube docker-env)

# 4. Compilar y preparar microservicios
echo "🔨 Compilando login-service (Java/Maven)..."
cd loginMicroservice && mvn clean package -DskipTests && cd ..

echo "🔨 Preparando order-service (Python)..."
cd orderMgmtMicroservice && pip install -r requirements.txt && cd ..

echo "🔨 Preparando user-service (Go)..."
cd userMgmtMicroservice && go mod tidy && go build -o main . && cd ..

echo "🔨 Preparando frontend (Node.js)..."
cd frontend && npm install && cd ..

# 5. Construir imágenes
echo "🔨 Construyendo imágenes Docker..."
docker build -t login-service:1.0.0 ./loginMicroservice/
docker build -t order-service:1.0.0 ./orderMgmtMicroservice/
docker build -t user-service:1.0.0 ./userMgmtMicroservice/
docker build -t frontend-service:1.0.0 ./frontend/

# 6. Desplegar bases de datos
echo "📦 Desplegando bases de datos..."
kubectl apply -f k8s/mysql.yaml
kubectl apply -f k8s/postgres.yaml
kubectl apply -f k8s/mongodb.yaml

# 7. Esperar bases de datos
echo "⏳ Esperando bases de datos..."
kubectl wait --for=condition=ready pod -l app=mysql --timeout=60s
kubectl wait --for=condition=ready pod -l app=postgres --timeout=60s
kubectl wait --for=condition=ready pod -l app=mongodb --timeout=60s

# 8. Desplegar microservicios
echo "📦 Desplegando microservicios..."
kubectl apply -f k8s/login-service.yaml
kubectl apply -f k8s/order-service.yaml
kubectl apply -f k8s/user-service.yaml
kubectl apply -f k8s/frontend-service.yaml

# 9. Aplicar reglas de Istio
echo "🔧 Aplicando reglas de Istio..."
kubectl apply -f k8s/istio-gateway.yaml

# 10. Verificar
echo "✅ Verificando despliegue..."
kubectl get pods
kubectl get svc

# 11. URL de acceso
echo "🌐 URL de acceso:"
echo "Frontend:"
minikube service frontend-service --url
echo "Login Service:"
minikube service login-service --url

echo "🎉 ¡Listo! Cada microservicio con su base de datos:"
echo "   - Frontend → React (puerto 3000)"
echo "   - Login Service → MySQL"
echo "   - User Service → PostgreSQL"  
echo "   - Order Service → MongoDB"
