# Git Flow для English Tenses Trainer

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
