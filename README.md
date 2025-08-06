# Sistema de Gerenciamento de Produtos

Este é um sistema de CRUD de produtos desenvolvido com **Spring Boot** no backend e **Angular** no frontend, implementando operações CRUD com paginação, filtros e validações.

## 🚀 Tecnologias Utilizadas

### Backend
- **Spring Boot 3.2.1**
- **Spring Data JPA**
- **H2 Database** (em memória)
- **Spring Validation**
- **Swagger/OpenAPI** para documentação
- **Maven** para gerenciamento de dependências

### Frontend
- **Angular 20** (última versão)
- **Angular Material** para componentes UI
- **Reactive Forms** para validação
- **HTTP Client** para comunicação com API
- **TypeScript** para tipagem estática

## 📁 Estrutura do Projeto

```
project-root/
├── backend/                 # Aplicação Spring Boot
│   ├── src/main/java/
│   │   └── com/productmanagement/
│   │       ├── ProductManagementApplication.java
│   │       ├── controller/
│   │       ├── service/
│   │       ├── repository/
│   │       ├── model/
│   │       ├── exception/
│   │       └── config/
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── data.sql
│   └── pom.xml
├── frontend/                # Aplicação Angular (pasta raiz)
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   └── models/
│   │   ├── main.ts
│   │   └── global_styles.css
│   ├── angular.json
│   └── package.json
└── README.md
```

## 🛠️ Como Executar o Projeto

### Pré-requisitos
- **Java 17** ou superior
- **Node.js 18** ou superior
- **Maven 3.6** ou superior
- **Angular CLI** (opcional, mas recomendado)

### 1. Executando o Backend (Spring Boot)

```bash
# Navegar para a pasta do backend
cd backend

# Executar a aplicação (irá baixar dependências automaticamente)
./mvnw spring-boot:run

# Ou se preferir usar Maven instalado globalmente
mvn spring-boot:run
```

O backend estará disponível em: `http://localhost:8080`

**URLs importantes do Backend:**
- **API Base:** `http://localhost:8080/api/products`
- **Swagger UI:** `http://localhost:8080/swagger-ui.html`
- **H2 Console:** `http://localhost:8080/h2-console`
  - JDBC URL: `jdbc:h2:mem:productdb`
  - Username: `sa`
  - Password: (deixar em branco)

### 2. Executando o Frontend (Angular)

```bash
# Na pasta raiz do projeto (onde está o angular.json)
npm install

# Executar o servidor de desenvolvimento
npm start
# ou
ng serve
```

O frontend estará disponível em: `http://localhost:4200`

## 📋 Funcionalidades Implementadas

### ✅ Backend Features
- [x] **CRUD Completo** de produtos (Create, Read, Update, Delete)
- [x] **Paginação e Ordenação** em todas as listagens
- [x] **Filtro de busca** por nome do produto
- [x] **Validação de dados** com Bean Validation
- [x] **Tratamento global de exceções** com @ControllerAdvice
- [x] **Banco H2 em memória** com dados de teste
- [x] **Documentação automática** com Swagger/OpenAPI
- [x] **CORS configurado** para o frontend Angular

### ✅ Frontend Features
- [x] **Interface moderna** com Angular Material
- [x] **Listagem paginada** de produtos
- [x] **Formulário de criação/edição** com validações
- [x] **Busca por nome** de produto
- [x] **Confirmação de exclusão** com dialog
- [x] **Notificações** com snackbar
- [x] **Tratamento de erros** e estados de loading
- [x] **Design responsivo** para mobile e desktop

## 🔗 Endpoints da API

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/products` | Lista produtos com paginação e filtro |
| `GET` | `/api/products/{id}` | Busca produto por ID |
| `POST` | `/api/products` | Cria novo produto |
| `PUT` | `/api/products/{id}` | Atualiza produto existente |
| `DELETE` | `/api/products/{id}` | Exclui produto |

### Exemplos de Requisições

#### Listar produtos com paginação
```bash
GET /api/products?page=0&size=10&sort=nome,asc
```

#### Buscar produtos por nome
```bash
GET /api/products?search=smartphone&page=0&size=10
```

#### Criar produto
```bash
POST /api/products
Content-Type: application/json

{
    "nome": "Produto Teste",
    "preco": 99.99,
    "descricao": "Descrição do produto de teste",
    "quantidade": 10
}
```

## 🎨 Características do Design

- **Material Design** com paleta de cores moderna
- **Layout responsivo** que se adapta a diferentes tamanhos de tela
- **Componentes reutilizáveis** e organizados
- **Feedback visual** com loading states e notificações
- **Validações em tempo real** nos formulários
- **Confirmações de ações destrutivas**

## 🐛 Tratamento de Erros

### Backend
- Exceções customizadas para recursos não encontrados
- Validação automática de campos obrigatórios
- Response padronizado para todos os tipos de erro
- Logs detalhados para debugging

### Frontend
- Interceptação de erros HTTP
- Mensagens de erro amigáveis ao usuário
- Estados de loading durante requisições
- Fallbacks para situações de erro

## 🔧 Configurações Adicionais

### CORS
O backend está configurado para aceitar requisições do frontend Angular rodando na porta 4200.

### Base de Dados
O H2 está configurado para recriar o schema a cada restart, garantindo sempre dados limpos para teste.

### Logs
Configurados logs detalhados para desenvolvimento, facilitando o debug de problemas.

**Desenvolvido com ❤️ usando Spring Boot + Angular**
