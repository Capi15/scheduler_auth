kubectl create namespace kong

helm repo add kong https://charts.konghq.com

helm install kong -n kong kong/kong

helm upgrade kong -n kong kong/kong -f ./k8s/app/deployments/config-kong.yml

APLICAR COMANDOS DEPLOYMENTS ANTES DO TUNNEL

kubectl apply -f ./k8s/app/persistent-volume-claims/mongoku-pvc.yml
kubectl apply -f ./k8s/app/persistent-volume-claims/scheduler-auth-pvc.yml
kubectl apply -f ./k8s/app/persistent-volume-claims/scheduler-inventory-pvc.yml 
kubectl apply -f ./k8s/app/persistent-volume-claims/mongo-auth-pvc.yml
kubectl apply -f ./k8s/app/persistent-volume-claims/mongo-events-pvc.yml 
kubectl apply -f ./k8s/app/persistent-volume-claims/mongo-requisition-pvc.yml 
kubectl apply -f ./k8s/app/persistent-volume-claims/mongo-inventory-pvc.yml   
kubectl get pvc

kubectl create configmap env-config-scheduler-auth --from-env-file=env-config-scheduler-auth.env
kubectl describe configmap env-config-scheduler-auth
kubectl create configmap env-config-scheduler-events --from-env-file=env-config-scheduler-events.env
kubectl describe configmap env-config-scheduler-events
kubectl create configmap env-config-scheduler-requisition --from-env-file=env-config-scheduler-requisition.env
kubectl describe configmap env-config-scheduler-requisition
kubectl create configmap env-config-scheduler-inventory --from-env-file=env-config-scheduler-inventory.env
kubectl describe configmap env-config-scheduler-inventory

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

kubectl get deployments


minikube tunnel
