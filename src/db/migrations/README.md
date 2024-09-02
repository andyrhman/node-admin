# WARNING

You must delete the migrations file first before you push to github. If not github actions won't migrate your tables.

```bash
npm run migration:generate --name=MIGRATE_TABLES # feching the entities
npm run migration:run # migrate to database
```
