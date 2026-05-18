# GsForum Mikroservis Ayrimi - Detayli Ozet

## Genel Bakis

Bu repo artik modular monolith degil; her servis kendi klasorunde, kendi bagimliliklari ile bagimsiz calisabilir sekilde ayrildi. Tum servisler Docker ile ayri ayri build/run edilebilir. Servisler arasi mesajlasma RabbitMQ uzerinden yapiliyor.

## Root Dizini (Ust Duzey Klasorler)

- forum-api/
- userservice/
- postservice/
- topicservice/
- authservice/
- stats-worker/
- ai-processor/
- docker-compose.yml

## Servisler ve Sorumluluklari

### forum-api

- Amac: Genel API giris noktasi (simdilik sadece /health).
- Port: 3000
- Giris dosyasi: index.ts
- Not: Istersen gateway/proxy olarak diger servislere yonlendirecek sekilde genisletilebilir.

### userservice

- Amac: Kullanici islemleri.
- Port: 3001
- Endpointler:
  - GET /health
  - POST /users
  - GET /users
- Katmanlar:
  - controllers/userController.ts
  - services/userService.ts
  - models/user.ts
  - routes/usersRouter.ts

### postservice

- Amac: Post islemleri + RabbitMQ event publish.
- Port: 3002
- Endpointler:
  - GET /health
  - POST /posts
  - GET /posts
  - DELETE /posts/:id
- Mesajlasma:
  - post.created ve post.deleted eventlerini RabbitMQ kuyru guna yayinlar.
- Katmanlar:
  - controllers/postController.ts
  - services/postService.ts
  - models/post.ts
  - routes/postsRouter.ts
  - events/PostCreatedEvent.ts, PostDeletedEvent.ts
  - queue/RabbitMQProvider.ts
  - interfaces/IQueueProvider.ts

### topicservice

- Amac: Topic islemleri (trending dahil).
- Port: 3003
- Endpointler:
  - GET /health
  - POST /topics
  - GET /topics
  - GET /topics/trending
- Katmanlar:
  - controllers/topicController.ts
  - services/topicService.ts
  - models/topic.ts
  - routes/topicsRouter.ts

### authservice

- Amac: Kullanici kayit ve login (token uretimi).
- Port: 3004
- Endpointler:
  - GET /health
  - POST /auth/register
  - POST /auth/login
- Katmanlar:
  - controllers/authController.ts
  - services/authService.ts
  - models/auth.ts
  - routes/authRouter.ts

### stats-worker

- Amac: RabbitMQ eventlerini dinleyip user/topic istatistiklerini guncellemek.
- HTTP yok (worker servis).
- Mesajlasma:
  - post.created -> UserService.incrementPostCount
  - post.deleted -> UserService.decrementPostCount
  - post.created -> TopicService.incrementTopicStats
  - post.deleted -> TopicService.decrementTopicStats
- Katmanlar:
  - workers/UserStatsWorker.ts
  - workers/TopicStatsWorker.ts
  - services/userService.ts
  - services/topicService.ts
  - models/user.ts, models/topic.ts, models/post.ts
  - events/PostCreatedEvent.ts, PostDeletedEvent.ts
  - queue/RabbitMQProvider.ts
  - interfaces/IQueueProvider.ts

### ai-processor

- Amac: post.created eventlerini dinleyip AI sonucunu olusturmak.
- HTTP yok (worker servis).
- Mesajlasma:
  - post.created eventini dinler, AiService ile sonuc uretir.
- Katmanlar:
  - services/aiService.ts
  - models/ai.ts, models/post.ts
  - events/PostCreatedEvent.ts
  - queue/RabbitMQProvider.ts
  - interfaces/IQueueProvider.ts

## Docker ve Calistirma

- docker-compose.yml tum servisleri ve RabbitMQ’yu ayağa kaldirir.
- RabbitMQ container:
  - 5672 (AMQP)
  - 15672 (Management UI)

## Environment Degiskenleri

Her servis kendi .env.example dosyasina sahip.

- userservice: PORT
- postservice: PORT, RABBITMQ_URL, POSTS_QUEUE
- topicservice: PORT
- authservice: PORT
- stats-worker: RABBITMQ_URL, POSTS_QUEUE
- ai-processor: RABBITMQ_URL, POSTS_QUEUE
- forum-api: PORT

## Notlar ve Ilerleme

- Shared/common katman yok. Her servis kendi ihtiyacini lokal kopya olarak tasir.
- Servisler birbirinden bagimsiz calisir.
- Istersen sonraki adimda gateway ekleyip tek bir entrypoint (forum-api) ile diger servislere yonlendirme yapabiliriz.
