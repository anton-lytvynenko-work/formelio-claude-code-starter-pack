---
name: block-hardcoded-secrets
enabled: true
event: file
pattern: (api[_-]?key|secret|password|token)\s*[:=]\s*["'][^"']{8,}["']
action: block
---

**Hardcoded secret detected!**

Never commit secrets to source control. Instead:
- Use environment variables: `process.env.API_KEY`
- Use a secrets manager (AWS Secrets Manager, Vault)
- Use `.env` files (add to `.gitignore`)
