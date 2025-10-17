#!/bin/bash
minikube delete
minikube start
kubectl delete all --all -n kong
kubectl delete configmap --all -n kong
kubectl delete secret --all -n kong
kubectl delete secret --all
kubectl delete pvc --all -n kong
kubectl delete pvc --all
helm uninstall kong
kubectl create namespace kong
openssl req -newkey rsa:2048 -nodes -keyout kong-manager.key -x509 -days 365 -out kong-manager.crt \
  -subj "/C=US/ST=State/L=City/O=Organization/OU=Unit/CN=localhost"

openssl req -newkey rsa:2048 -nodes -keyout kong-admin.key -x509 -days 365 -out kong-admin.crt \
  -subj "/C=US/ST=State/L=City/O=Organization/OU=Unit/CN=localhost"


kubectl create secret tls kong-manager-tls --cert=kong-manager.crt --key=kong-manager.key --namespace kong

kubectl create secret tls kong-admin-tls --cert=kong-admin.crt --key=kong-admin.key --namespace kong

helm repo add kong https://charts.konghq.com

helm install kong kong/kong -n kong -f './k8s/app/deployments/config-kong.yml'
# echo "Aguardando 15s para o deployments de cluster kong"
# sleep 15
helm upgrade kong -n kong kong/kong -f ./k8s/app/deployments/config-kong.yml
# echo "Aguardando 15s para configurar deployments de cluster kong"
# sleep 15
HOST=$(kubectl get svc --namespace kong kong-kong-proxy -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
PORT=$(kubectl get svc --namespace kong kong-kong-proxy -o jsonpath='{.spec.ports[0].port}')
export PROXY_IP=${HOST}:${PORT}

kubectl apply -f ./k8s/app/persistent-volume-claims/mongoku-pvc.yml
kubectl apply -f ./k8s/app/persistent-volume-claims/scheduler-auth-pvc.yml
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

kubectl apply -f ./k8s/app/deployments/mongo-auth-deployment.yml
kubectl apply -f ./k8s/app/deployments/mongo-events-deployment.yml
kubectl apply -f ./k8s/app/deployments/mongo-requisition-deployment.yml
kubectl apply -f ./k8s/app/deployments/mongo-inventory-deployment.yml 

kubectl apply -f ./k8s/app/deployments/scheduler-auth-deployment.yml
kubectl apply -f ./k8s/app/deployments/scheduler-events-deployment.yml
kubectl apply -f ./k8s/app/deployments/scheduler-requisition-deployment.yml
kubectl apply -f ./k8s/app/deployments/scheduler-inventory-deployment.yml
kubectl apply -f ./k8s/app/deployments/mongoku-deployment.yml
kubectl apply -f ./k8s/app/deployments/scheduler-ingress.yml
# echo "Aguardando 30s para o deployments serem criados"
# sleep 30
#kubectl get deployments
minikube tunnel


#chmod 744 meu-script.sh