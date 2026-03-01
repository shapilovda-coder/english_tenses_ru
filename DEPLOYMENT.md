# Git Flow для English Tenses Trainer

## ⚠️ ВАЖНО: Нужно добавить Secrets в GitHub

Перед включением автодеплоя необходимо добавить следующие secrets в GitHub:

**Settings → Secrets and variables → Actions → New repository secret**

| Secret | Значение | Где взять |
|--------|----------|-----------|
| `RENDER_API_KEY` | API ключ Render | Render Dashboard → Account Settings → API Keys |
| `RENDER_PROD_SERVICE_ID` | ID прод-сервиса | Render Dashboard → english-tenses-trainer-prod → Settings |
| `RENDER_STAGING_SERVICE_ID` | ID staging-сервиса | Render Dashboard → english-tenses-trainer-staging → Settings |

После добавления secrets — раскомментировать `on: push:` в workflow файлах и удалить `workflow_dispatch`.

---

## Ветки

- `master` — production, деплоится на https://временаванглийском.рф
- `develop` — staging, деплоится на https://staging-временаванглийском.рф.onrender.com
- `feature/*` — фичи, мержатся в develop

## Процесс разработки

### 1. Новая фича
```bash
git checkout develop
git pull origin develop
git checkout -b feature/new-feature
# работаем...
git push origin feature/new-feature
# PR → develop
```

### 2. Тестирование на staging
- Автодеплой из develop на staging URL
- Проверяем функциональность
- Если ок — PR develop → master

### 3. Релиз в production
- PR develop → master требует approval
- После мержа — автодеплой на прод

## Защита от случайных выкладок

1. **GitHub Branch Protection** (master):
   - Require pull request reviews
   - Require status checks to pass
   - Restrict pushes to specific people

2. **GitHub Environments** (production):
   - Required reviewers (минимум 1)
   - Deployment protection rules

3. **Render**:
   - Prod сервис привязан только к master
   - Автодеплой отключен или с approval
