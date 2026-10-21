## 1. Проверка исходных дефектов и хранилище

- [x] 1.1 Прочитать актуальные конфиги, подтвердить ошибки Boolean(indexOf) и мутации массива, сверить уже выполненное исправление UpdatedAgo.
- [x] 1.2 Установить expo-sqlite через npx expo install, обновить корневые package.json/package-lock.json и подключить localStorage polyfill в index.ts; сохранить Expo Go/web совместимость SDK 57.
- [x] 1.3 Исправить useFavorites: includes по id, чистый функциональный updater и неизменяемое добавление/удаление; один state на экране.
- [x] 1.4 Добавить восстановление массива уникальных ID из matches:favorites:v1 до первого рендера и сохранение committed state; обработать отсутствующее/повреждённое значение и ошибки storage без падения, с неблокирующим сообщением при недоступности.

## 2. Контракт будущего backend и генерация

- [x] 2.1 Добавить PUT /favorites/{matchId}, operationId setMatchFavorite, required path/body и responses 200/400/404/500 в paths/favorite.yaml; связать с openapi.yaml и tag Favorites. Описать контракт как будущий, без действующего backend.
- [x] 2.2 Добавить component schemas SetMatchFavoriteRequest (isFavorite), MatchFavorite (matchId/isFavorite), ApiError (code/message), подключить $ref.
- [x] 2.3 Выполнить api:lint, api:bundle и api:generate; проверить generated types/Zod/Fetch/mutation key/options/hook и экспортировать нужные модули через @repo/api, без ручных правок generated output.

## 3. Подключение карточек

- [x] 3.1 Вызвать useFavorites один раз в MatchesScreen, передать состояние/обработчик конкретного id в MatchCard и existing FavoriteButton; подключить extraData FlatList.
- [x] 3.2 Разместить звезду 24×24 рядом со статусом, добавить selected state и сохранить русские labels; обновить общий layout skeleton с неинтерактивным placeholder звезды.
- [x] 3.3 Оставить комментарий в компоненте о generated useSetMatchFavorite и временном localStorage из-за отсутствия backend. Не подключать mutation hook, ручной fetch или mock mutation route.

## 4. Проверки поведения и объяснения

- [x] 4.1 В браузере проверить начальные неактивные звёзды, независимое добавление/снятие первого и другого матча, быстрые чётные/нечётные переключения, фильтры/прокрутку/refresh и отсутствие HTTP mutations.
- [x] 4.2 Проверить восстановление после перезапуска/перезагрузки, сохранённое удаление, повреждённые значения/дубли и отказ storage без падения; временный dev harness не включать в production diff.
- [x] 4.3 Проверить регрессию UpdatedAgo: рост, успешный refetch с тем же JSON, ошибка, 59/60/119/120 секунд, фон/возврат и cleanup; менять код только при подтверждённом дефекте.
- [ ] 4.4 Выполнить доступный Expo Go smoke (звёзды, перезапуск и timer); явно записать непроверенные платформы/сценарии.
- [x] 4.5 Обновить SOLUTION.md: по 1–3 предложения с причинами обеих жалоб и исправлениями; описать локальное сохранение, неиспользуемый серверный контракт и фактические проверки. Обновить API README.

## 5. Финальные проверки

- [x] 5.1 Выполнить scoped npx oxfmt и --check, npm run typecheck, api:lint, api:bundle и повторную api:generate без изменений output.
- [x] 5.2 Выполнить openspec validate add-match-favorites --strict --no-interactive и git diff --check; перечитать итоговый diff без соседних файлов. Не добавлять test runner и отдельный test-plan.md.

Ограничения: 4.4 не выполнен — устройство/симулятор Expo Go не использовались. 4.2/4.3 проверены на web; фон моделировался visibilitychange и управляемыми часами, cleanup интервала — временным harness. iOS export прошёл, но не заменяет native smoke. Фактические результаты записаны в SOLUTION.md.
