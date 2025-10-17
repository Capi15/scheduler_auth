#!/bin/bash
minikube delete

minikube start --memory=7000 --cpus 4
kubectl create namespace kong

# --- [Gera SAN config para localhost e 127.0.0.1] ---
cat <<EOF > san.conf
[req]
default_bits = 2048
prompt = no
default_md = sha256
req_extensions = req_ext
distinguished_name = dn

[dn]
C = US
ST = State
L = City
O = Organization
OU = Unit
CN = localhost

[req_ext]
subjectAltName = @alt_names

[alt_names]
DNS.1 = localhost
IP.1 = 127.0.0.1
EOF

# --- [Certificado para o Kong Proxy] ---
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout kong-proxy.key -out kong-proxy.crt \
  -config san.conf -extensions req_ext

kubectl create secret tls kong-proxy-tls --cert=kong-proxy.crt --key=kong-proxy.key --namespace kong

kubectl create secret tls kong-manager-tls --cert=kong-manager.crt --key=kong-manager.key --namespace kong

kubectl create secret tls kong-admin-tls --cert=kong-admin.crt --key=kong-admin.key --namespace kong

helm repo add kong https://charts.konghq.com

helm install kong kong/kong -n kong -f './k8s/app/deployments/config-kong.yml'

HOST=$(kubectl get svc --namespace kong kong-kong-proxy -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
PORT=$(kubectl get svc --namespace kong kong-kong-proxy -o jsonpath='{.spec.ports[0].port}')
export PROXY_IP=${HOST}:${PORT}

kubectl apply -f ./k8s/app/persistent-volume-claims/mongoku-pvc.yml
kubectl apply -f ./k8s/app/persistent-volume-claims/scheduler-auth-pvc.yml
kubectl apply -f ./k8s/app/persistent-volume-claims/scheduler-web-pvc.yml
kubectl apply -f ./k8s/app/persistent-volume-claims/scheduler-inventory-pvc.yml 
kubectl apply -f ./k8s/app/persistent-volume-claims/mongo-auth-pvc.yml
kubectl apply -f ./k8s/app/persistent-volume-claims/mongo-events-pvc.yml 
kubectl apply -f ./k8s/app/persistent-volume-claims/mongo-requisition-pvc.yml 
kubectl apply -f ./k8s/app/persistent-volume-claims/mongo-inventory-pvc.yml   
#kubectl get pvc

kubectl create configmap env-config-scheduler-auth --from-env-file=env-config-scheduler-auth.env
#kubectl describe configmap env-config-scheduler-auth
kubectl create configmap env-config-scheduler-events --from-env-file=env-config-scheduler-events.env
#kubectl describe configmap env-config-scheduler-events
kubectl create configmap env-config-scheduler-requisition --from-env-file=env-config-scheduler-requisition.env
#kubectl describe configmap env-config-scheduler-requisition
kubectl create configmap env-config-scheduler-inventory --from-env-file=env-config-scheduler-inventory.env
#kubectl describe configmap env-config-scheduler-inventory
kubectl create configmap env-config-scheduler-web --from-env-file=env-config-scheduler-web.env

kubectl apply -f ./k8s/app/deployments/mongo-auth-deployment.yml
kubectl apply -f ./k8s/app/deployments/mongo-events-deployment.yml
kubectl apply -f ./k8s/app/deployments/mongo-requisition-deployment.yml
kubectl apply -f ./k8s/app/deployments/mongo-inventory-deployment.yml 

kubectl apply -f ./k8s/app/deployments/scheduler-auth-deployment.yml
kubectl apply -f ./k8s/app/deployments/scheduler-events-deployment.yml
kubectl apply -f ./k8s/app/deployments/scheduler-requisition-deployment.yml
kubectl apply -f ./k8s/app/deployments/scheduler-inventory-deployment.yml
kubectl apply -f ./k8s/app/deployments/scheduler-web-deployment.yml
kubectl apply -f ./k8s/app/deployments/mongoku-deployment.yml
kubectl apply -f ./k8s/app/deployments/scheduler-ingress.yml

#kubectl get deployments
minikube tunnel


#chmod 744 meu-script.sh