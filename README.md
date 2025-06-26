
# 🛒 Products & Coupons API (NestJS + TypeORM)

Projeto desenvolvido para o **desafio técnico** com foco em boas práticas de arquitetura, validação, filtragem, clean code e modularidade utilizando o framework **NestJS** com **TypeORM** e banco de dados **SQLite**.

---

## 📦 Descrição Geral

O sistema é composto por **duas APIs independentes**:

### 1️⃣ Products API
Responsável por gerenciar produtos, incluindo:
- CRUD completo de produtos
- Paginação e filtros avançados (nome, preço, estoque, desconto)
- Aplicação e remoção de **descontos percentuais**
- Cálculo dinâmico do preço com desconto (`priceWithDiscount`)
- Soft delete
- Validação global com `ValidationPipe`
- Tratamento de erros padronizado (`HttpExceptionFilter`)

### 2️⃣ Coupons API
Responsável por gerenciar **cupons de desconto reutilizáveis ou únicos**, incluindo:
- CRUD completo de cupons
- Validação de cupons com base em:
  - Período de validade (`validFrom` / `validUntil`)
  - Tipo (`fixed` ou `percent`)
  - Quantidade de uso (`oneShot`)
- Validação exposta via endpoint
- Contador automático de uso (`usageCount`)
- Validação e erros padronizados

---

## 🧱 Tecnologias Utilizadas

- [NestJS](https://nestjs.com/)
- [TypeORM](https://typeorm.io/)
- [SQLite](https://www.sqlite.org/)
- [class-validator](https://github.com/typestack/class-validator)
- [Jest](https://jestjs.io/)

---

## 🧪 Funcionalidades Atendidas no Desafio

| Requisito                                               | Status |
|----------------------------------------------------------|--------|
| CRUD de produtos                                         | ✅     |
| Filtros por nome, estoque, preço, desconto               | ✅     |
| Paginação com `page` e `limit`                           | ✅     |
| Descontos percentuais por produto                        | ✅     |
| Campo `priceWithDiscount` calculado dinamicamente        | ✅     |
| Soft delete em produtos                                  | ✅     |
| Filtro `hasDiscount`                                     | ✅     |
| Validação de cupons com data e regra                     | ✅     |
| Cupom tipo `percent` ou `fixed`                          | ✅     |
| Cupom de uso único (`oneShot`)                           | ✅     |
| Tratamento global de erros com filtro customizado        | ✅     |
| Validação automática nos DTOs                            | ✅     |
| Separação clara de módulos (`products`, `coupons`)       | ✅     |
| Testes unitários de serviços                             | ✅ (parcial) |

---

## 📁 Estrutura de Pastas (Products API)

```bash
products-api/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── products/
│   ├── discounts/
│   ├── common/filters/http-exception.filter.ts
│   └── database/
├── db.sqlite
├── package.json
```

---

## 📁 Estrutura de Pastas (Coupons API)

```bash
coupons-api/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── coupons/
│   └── common/filters/http-exception.filter.ts
├── db.sqlite
├── package.json
```

---

## ⚙️ Como Rodar Cada API

### Products API

```bash
cd products-api
npm install
npm run start:dev
```

Acesse: `http://localhost:3000/products`

### Coupons API

```bash
cd coupons-api
npm install
npm run start:dev
```

Acesse: `http://localhost:3000/coupons`

---

## 📥 Exemplo de criação de cupom

```http
POST /coupons
Content-Type: application/json

{
  "code": "DESCONTO20",
  "type": "percent",
  "value": 20,
  "oneShot": false,
  "validFrom": "2025-06-24T00:00:00Z",
  "validUntil": "2025-06-30T23:59:59Z"
}
```

---

## 📥 Exemplo de criação de produto

```http
POST /products
Content-Type: application/json

{
  "name": "Café Premium",
  "description": "100% Arábica",
  "price": 100.0,
  "stock": 20
}
```

---

## 🧪 Rodando os Testes

```bash
npm run test
```

> Testes focados no `ProductsService`.

---


## 📜 Tratamento de Erros

Todas as APIs retornam erros neste formato:

```json
{
  "statusCode": 400,
  "message": "Cupom inválido",
  "error": "Bad Request",
  "path": "/coupons/validate/TESTE10",
  "timestamp": "2025-06-24T12:00:00.000Z"
}
```

---

## ✅ Boas práticas utilizadas

- DTOs com validações
- Separação clara por módulos
- Arquitetura baseada em responsabilidades
- Clean Code + SOLID
- Pipes e filtros globais
- Testes unitários
- Modularidade entre APIs

---