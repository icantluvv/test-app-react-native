## 1. Данные и загрузка

- [x] 1.1 Сверить API с Expo SDK 57 и прочитать ближайшие конфиги; проверить причину исходного дефекта UpdatedAgo по коду.
- [x] 1.2 Описать GET источника MATCHES_URL, operationId getMatches, success/error responses, путь и component schemas Team/MatchScore/MatchStatus/Match/MatchesResponse через $ref.
- [x] 1.3 Сгенерировать Kubb 5 types/Zod/Fetch/query keys/options/hooks и экспортировать их через @repo/api. Проверить generated validation, добавить только недостающие refinements в query error path.
- [x] 1.4 Подключить стабильный QueryClientProvider и generated useGetMatches с точным MATCHES_URL через существующий Expo transport с явным mock-сценарием matches; проверить фактические сигнатуры, AbortSignal и query-local lifecycle по design.md.
- [x] 1.5 Добавить чистые преобразования статуса, локального фильтра, даты и счёта на generated types, без дублирования DTO и query state.

## 2. Экран и время обновления

- [x] 2.1 Собрать карточку и FlatList: команды, счёт с нулями, локальное время, дата-заглушка, русские статусы и live-минута, серверный порядок.
- [x] 2.2 Добавить локальные фильтры Все/Предстоящие/Завершённые (8/4/3), skeleton по isLoading generated hook, paused без данных, ошибку с «Повторить» и пустой экран «нет запрашиваемых матчей» для пустого ответа или фильтра.
- [x] 2.3 Подключить «Обновить» и «Повторить» к refetch того же generated hook; isFetching управляет индикатором/блокировкой. Сохранить данные и фильтр при refresh/error.
- [x] 2.4 Исправить UpdatedAgo: расчёт от since, немедленный сброс после успеха, cleanup таймера, пересчёт после фона и целые минуты после 59 секунд с русскими окончаниями; подключить since к dataUpdatedAt того же generated hook, включая успех с идентичными данными.

## 3. Проверки поведения и документация

- [x] 3.1 Подготовить контролируемые ответы через существующий транспорт через явный mock-сценарий matches из data/matches.json и без изменения MATCHES_URL; не добавлять test runner без отдельного разрешения.
- [x] 3.2 Проверить основные состояния экрана в браузере; записать результаты, runtime/timezone и ограничения источника в SOLUTION.md.
- [ ] 3.3 Выполнить smoke в Expo Go: список, фильтры, refresh/error/retry, локальное время, фон/возврат; явно отметить недоступную платформу или непроверенный сценарий.
- [x] 3.4 Обновить относящиеся к фиче разделы SOLUTION.md, API README и указать фактически выполненные проверки и ограничения.

## 4. Финальные gates

- [x] 4.0 Выполнить api:lint, api:bundle, api:generate и typecheck; повторить generation без изменений output.

- [x] 4.1 Выполнить scoped `npx oxfmt <изменённые файлы>`, затем `npx oxfmt --check <изменённые файлы>` и `npm run typecheck`.
- [x] 4.2 Выполнить `openspec validate add-matches-screen --strict --no-interactive` и `git diff --check`; перечитать итоговый diff без соседних изменений.

Expo Go smoke (3.3) не выполнен: устройство/симулятор для проверки не использовались. Фон/возврат, runtime cleanup и paused без данных остаются непроверенными.
