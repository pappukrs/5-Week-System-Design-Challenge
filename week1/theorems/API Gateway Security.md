# **📅 Day 14: API Gateway Security** 🔒🛡️  

API Gateways **secure** and **protect** microservices from unauthorized access, malicious attacks, and data breaches.  

## **📌 Why is API Gateway Security Important?**  
✅ Prevents **unauthorized access** to APIs.  
✅ Protects against **DDoS** and brute-force attacks.  
✅ Ensures **data privacy** and integrity.  

---

## **🔹 1️⃣ Authentication & Authorization** 🆔  
### **🔐 Authentication** – Verifies "who you are" (e.g., JWT, OAuth2).  
### **✅ Authorization** – Determines "what you can access" (e.g., Role-Based Access Control).  

### **🔍 Example: JWT Authentication in Kong API Gateway**  
📍 **Enable JWT Plugin**  
```bash
curl -X POST http://localhost:8001/services/user-service/plugins \
     --data "name=jwt"
```
📍 **Create a Consumer**  
```bash
curl -X POST http://localhost:8001/consumers \
     --data "username=api-user"
```
📍 **Generate JWT Credential**  
```bash
curl -X POST http://localhost:8001/consumers/api-user/jwt
```
✅ Now, clients must **include a JWT token** in their requests.

---

## **🔹 2️⃣ Rate Limiting & Throttling** 🚦  
✅ **Prevents abuse** by limiting requests per second.  
✅ Protects against **brute-force** and **DDoS attacks**.  

### **🔍 Example: Rate Limiting in AWS API Gateway**  
📍 **Enable Rate Limiting**  
```bash
aws apigateway update-stage --rest-api-id abc123 --stage-name prod \
    --patch-operations op="replace",path="/throttle/rateLimit",value="100"
```
✅ Now, the API allows **100 requests per second** per client.

---

## **🔹 3️⃣ Web Application Firewall (WAF)** 🛑  
✅ Protects against **SQL Injection, XSS, and other attacks**.  
✅ **AWS WAF**, **Cloudflare WAF**, and **NGINX ModSecurity** provide this.  

### **🔍 Example: AWS WAF with API Gateway**  
📍 **Create a WebACL to Block SQL Injection**  
```bash
aws wafv2 create-web-acl --name "BlockSQLInjection" --scope "REGIONAL"
```
📍 **Attach to API Gateway**  
```bash
aws wafv2 associate-web-acl --web-acl-arn "arn:aws:waf::acl-id" --resource-arn "arn:aws:apigateway::/restapis/api-id/stages/prod"
```
✅ Now, the API is **protected from SQL injection**.

---

## **🔹 4️⃣ Request Validation & Schema Enforcement** 📏  
✅ Prevents **malformed or malicious payloads**.  
✅ Uses **OpenAPI Schema** or **JSON Schema Validation**.  

### **🔍 Example: Request Validation in NGINX API Gateway**  
📍 **Enforce JSON Schema Validation**  
```nginx
server {
    location /api {
        content_by_lua_block {
            local req = ngx.req.get_body_data()
            if not isValidJSON(req) then
                ngx.exit(400)
            end
        }
    }
}
```
✅ Ensures **only valid JSON payloads** are accepted.

---

## **📌 Summary**  
🔒 **Authentication & Authorization** – Use **JWT, OAuth2**.  
🚦 **Rate Limiting & Throttling** – Prevent **DDoS & abuse**.  
🛑 **Web Application Firewall (WAF)** – Protect **against SQL Injection, XSS**.  
📏 **Request Validation** – Enforce **strict payload rules**.  

🚀 **Next Topic: Logging & Monitoring in API Gateway?**