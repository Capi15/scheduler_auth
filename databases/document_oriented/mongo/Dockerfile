FROM mongo:8.0.3

EXPOSE 27017

RUN mkdir -p /workspace /data/db

CMD ["mongod", "--replSet", "rs0", "--bind_ip_all"]