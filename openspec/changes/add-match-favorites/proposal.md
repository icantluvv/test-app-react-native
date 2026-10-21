## Why

На карточках матчей ещё нет звёздочки избранного. Существующий useFavorites неверно определяет выбранные матчи и изменяет массив state на месте, поэтому его подключение без исправления воспроизведёт жалобы тестировщика.

## What Changes

- Исправить определение избранного по id и переключение через функциональное неизменяемое обновление state.
- Подключить существующий FavoriteButton к каждой загруженной карточке через одно состояние избранного на экране; сохранять выбор при фильтрации, обновлении списка и перезапуске приложения.
- Хранить только ID матчей в локальном localStorage: expo-sqlite polyfill на native и встроенный localStorage на web; без backend.
- Сохранить совпадение геометрии skeleton и карточки после добавления звезды; skeleton не содержит активной кнопки.
- Проверить уже исправленный UpdatedAgo: течение времени, сброс после успешного обновления, сохранение возраста при ошибке, границы секунд/минут и cleanup.
- Описать будущий PUT /favorites/{matchId} с isFavorite=true/false в OpenAPI, вынести путь и component schemas, сгенерировать Kubb types/Zod/Fetch/mutation hook и экспортировать через @repo/api. Backend пока отсутствует: UI не вызывает mutation.
- Добавить в компонент комментарий о generated mutation hook и временном использовании только localStorage в тестовом задании.
- В SOLUTION.md описать причины обеих жалоб по 1–3 предложения на каждую.

## Capabilities

### New Capabilities

- `match-favorites`: независимое переключение избранного по id в карточках, локальное сохранение выбора между перезапусками и объяснение дефектов избранного и таймера.

### Modified Capabilities

Нет опубликованных основных спецификаций для изменения. Поведение UpdatedAgo уже реализовано в add-matches-screen и не переопределяется этим change.

## Impact

index.ts, package.json, package-lock.json, src/hooks/useFavorites.ts, src/components/FavoriteButton.tsx, src/screens/MatchesScreen.tsx, src/screens/matches/MatchCard.tsx и SOLUTION.md. UpdatedAgo меняется только при подтверждённой регрессии в рамках описанных требований. Для native localStorage добавляется совместимый с SDK 57 expo-sqlite через npx expo install с обновлением корневого lockfile и импортом polyfill в index.ts. Дополнительно затрагиваются api/src/openapi.yaml, новый paths-файл и component schemas, generated output, публичные экспорты @repo/api и API README. Общий клиент, env и query defaults не меняются. Новые фильтры, навигация, синхронизация с backend и общий store вне scope.

## Quality impact

Риск P2: локальное UI-состояние без записи на сервер. Проверки — API lint/bundle/generate с повторной генерацией без diff, typecheck, scoped Oxfmt, OpenSpec validation и ручные сценарии избранного/таймера в браузере и доступном Expo Go. Runner и отдельный test-plan.md не добавляются по ранее выраженному требованию пользователя. Откат — вернуть затронутые компоненты, hook и документацию; миграций нет.
