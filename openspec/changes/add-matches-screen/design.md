## Context

См. proposal.md. Приложение использует Expo ~57.0.29, React 19.2.3, React Native 0.86.3; экран один, роутера и Query provider нет. Контракт OpenAPI пуст, источник матчей — внешний JSON. Zod установлен. `UpdatedAgo` захватывает первоначальный seconds, игнорирует since и не очищает interval. Test runner и Allure pipeline не настроены.

## Goals / Non-Goals

**Goals:** минимальная локальная реализация с независимыми загрузкой и представлением, поддержка Expo Go и web, предсказуемые состояния повторного запроса.

**Non-Goals:** избранное и исправление useFavorites, поиск, persistence, роутер, новый дизайн-системный слой, автополлинг, изменение URL, выдуманный backend endpoint или неподдерживаемые серверные фильтры.

## Decisions

1. Описать существующий JSON-источник в OpenAPI 3.0.3: GET `/OWNER/REPO/main/data/matches.json`, operationId `getMatches`, server `https://raw.githubusercontent.com`, success response и default error response без предположения о JSON-теле ошибки. Вынести путь в `api/src/paths/`, component schemas `Team`, `MatchScore`, `MatchStatus`, `Match`, `MatchesResponse` — в `api/src/components/schemas/`; связать через `$ref`. Runtime обращается ровно к MATCHES_URL из src/config.ts через request interceptor изолированного клиента, переданного в config generated hook; проверить фактическую сигнатуру после генерации. Не требовать EXPO_PUBLIC_API_URL для этого источника.
2. Схема: round — целое; matches — массив; команды с id/name/city; startsAt — ISO timestamp с timezone либо null; четыре известных статуса; score — объект неотрицательных целых home/away либо null; minute — необязательное неотрицательное целое. Дополнительные поля допустимы. OpenAPI — источник DTO и Zod schemas; Kubb 5 генерирует types, validators, Fetch methods, query keys/options и useGetMatches. Экспортировать используемые модули через @repo/api; generated output вручную не менять. Проверить строгость generated date-time validator; уникальность id и недостающую строгость дат проверить узким refinement поверх generated schema в query error path, без дублирования DTO/схем и валидации только в render/select. Использовать существующий Expo transport с expo/fetch и изолированный createApiClient с mockScenario=matches и mockFallbackScenario=false. По уточнению пользователя данные берутся из data/matches.json через существующий реестр моков; default остаётся пустым. Это явный источник ответа, а не подмена сетевой ошибки.
3. Подключить один стабильный QueryClient и QueryClientProvider в App.tsx. Экран использует один generated hook; допустим узкий wrapper для options/refinement без собственного fetch, useQuery и копирования query state. Одна generated query identity для полного ответа. Фильтр — локальное состояние, не query parameter или часть key: у статического JSON нет подтверждённой серверной фильтрации. Query-local options: retry=false, refetchOnWindowFocus=false, refetchOnReconnect=false; загрузка при открытии и явный refetch. Skeleton карточек определяется isLoading этого hook; isFetching управляет индикатором и блокировкой обновления, не заменяя сохранённые карточки skeleton. При paused без данных показать ожидание сети. Ошибка без данных показывает сообщение и «Повторить»; ошибка refresh сохраняет последний успешный результат. «Обновить» и «Повторить» вызывают refetch того же экземпляра generated hook без новой query или прямого вызова Fetch-метода. Защитить от повторного нажатия до rerender. Generated queryFn передаёт AbortSignal транспорту; проверить отмену unmount и отсутствие влияния позднего ответа.
4. FlatList сохраняет серверный порядок и использует id как key. Для фильтров — три именованные кнопки с видимым выбором, для refresh — кнопка «Обновить», доступная и в пустом состоянии. @expo/ui рассмотрен; обязательных sheet/picker/switch здесь нет, простые RN-кнопки дают общий web/native интерфейс без новой зависимости.
5. Маппинг статусов задаётся явно. scheduled/postponed — «Предстоящие»: оба ещё не завершены, перенос не исключает матч из расписания. live — только «Все»: матч уже начался, но ещё не завершён. Не выводить статус из часов устройства: данные примера могут быть историческими. Intl.DateTimeFormat с русской локалью и без фиксированного timeZone переводит timestamp в пояс устройства. null обрабатывается до форматирования. score проверяется как объект, не по truthiness отдельных чисел.
6. `UpdatedAgo` вычисляет max(0, floor((Date.now() - since.getTime()) / 1000)), сразу пересчитывает при смене since и использует очищаемый interval. При возврате приложения в foreground пересчитать возраст; выбрать совместимый с SDK 57 lifecycle при реализации. Не считать число interval ticks: фон может останавливать таймеры. since брать из dataUpdatedAt того же generated hook после первого успеха. Успех с идентичными данными или пустым массивом тоже сбрасывает отсчёт. До 60 секунд показывать секунды, затем floor(seconds / 60) минут с русскими окончаниями (1 минуту, 2 минуты, 5 минут). На неуспешный запрос since не менять.
7. Обновить только относящиеся к фиче разделы SOLUTION.md; не утверждать, что выполнена часть README про избранное.

## Risks / Trade-offs

- [MATCHES_URL содержит OWNER/REPO] → сохранить по требованию; честно показывать ошибку. По уточнению пользователя использовать явный mock-сценарий matches с data/matches.json; отдельно проверять ошибки контролируемого сценария. Реальный success smoke остаётся ограниченным до доступности источника.
- [Фон и timezone различаются между браузером и устройством] → проверить оба runtime, включая смену дня и возврат из фона.
- [Нет runner/renderer/Allure adapter] → для P2 выбрать ручные проверки поведения; не добавлять инфраструктуру автоматически. Отсутствие автоматической регрессии остаётся ограничением. Если setup будет отдельно разрешён, сначала согласовать совместимый runner и выполнить RED/GREEN по поведению.
- [Закрытый набор статусов] → неизвестный статус считается ошибкой данных, чтобы не скрывать неверную классификацию.

## Verification

Проверки реализации: typecheck, scoped Oxfmt check, openspec validate, api:lint,
api:bundle, api:generate и повторная генерация без изменений output.
В браузере проверить список, skeleton, фильтры, пустой ответ, ошибку/повтор,
refresh с сохранением данных и границы секунд/минут. Фактически выполненные
проверки и непроверенные платформы записать в SOLUTION.md.
Тестовая инфраструктура и отдельный тест-план не добавляются по просьбе пользователя.

## Migration Plan

Миграций и внешнего развертывания нет. Внедрить экран, проверить сценарии, заполнить SOLUTION.md. Откат — возврат исходного экрана, UpdatedAgo и удаление добавленного feature-кода.
