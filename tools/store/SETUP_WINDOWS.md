# Доступ к App Store и Google Play по API (Windows)

Инструкция для работы со скриптами `tools/store` на своём компьютере с Windows. Подходит для двух приложений:

| Приложение | Проект | Папка со скриптами |
|------------|--------|--------------------|
| Raglan Planner (`com.ilyadylko.knitapp`) | knite | `knite\tools\store` |
| Hi, Anxiety (`com.ilyadylko.HiAnxiety`) | StopAD | `StopAD\tools\store` |

Ключи доступа работают только для этих двух приложений. Других приложений команды они не видят.

## 1. Что нужно заранее

- **Python 3.9 или новее.** Скачать с [python.org](https://www.python.org/downloads/windows/), при установке поставить галочку **Add python.exe to PATH**.
  Проверка в PowerShell: `python --version`.
- **Ключ App Store**: файл `AuthKey_XXXXXXXXXX.p8` и его Key ID (10 символов, те же, что в имени файла).
  Создаётся в App Store Connect: своё имя справа вверху → Изменить профиль → Individual API Key → Generate. Скачать файл можно только один раз.
- **Ключ Google Play**: JSON-файл service account (выдаёт Илья).

## 2. Папка для ключей

Ключи лежат в одной папке вне проектов: `C:\Users\<имя пользователя>\bare\.secrets\store\`.

Создать её в PowerShell:

```powershell
mkdir $HOME\bare\.secrets\store
```

Открыть в Проводнике:

```powershell
explorer $HOME\bare\.secrets\store
```

Положить туда три файла:

| Файл | Что это |
|------|---------|
| `AuthKey_XXXXXXXXXX.p8` | ключ App Store, имя не менять |
| `service-account.json` | ключ Google Play: скачанный JSON переименовать именно так |
| `apple.json` | создать самой, содержимое ниже |

Содержимое `apple.json` (вместо `XXXXXXXXXX` подставить свой Key ID):

```json
{
  "key_type": "individual",
  "key_id": "XXXXXXXXXX",
  "private_key_file": "AuthKey_XXXXXXXXXX.p8"
}
```

**Внимание: расширения файлов.** Windows по умолчанию прячет расширения, и файл из Блокнота легко сохраняется как `apple.json.txt`, а скачанный ключ Google остаётся `service-account.json.json`. Включите показ расширений: Проводник → Вид → Показать → **Расширения имён файлов**. В Блокноте при сохранении выбирайте тип «Все файлы».

## 3. Установка (один раз для каждого проекта)

В PowerShell перейти в папку со скриптами, например:

```powershell
cd путь\к\knite\tools\store
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

Если PowerShell пишет, что выполнение скриптов запрещено (`running scripts is disabled`), один раз выполнить:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

Для Hi, Anxiety то же самое в папке `StopAD\tools\store`.

## 4. Проверка

Каждый раз перед работой: открыть PowerShell в папке `tools\store` и выполнить `venv\Scripts\activate`.

```powershell
python asm.py check
python play.py check
```

- `asm.py check` должен показать название приложения и состояние версии в App Store.
- `play.py check` должен показать имя пакета и закончиться без ошибки.

В README команды написаны как `python3 ...`. На Windows вместо `python3` пишите `python`.

## 5. Основные команды

| Команда | Что делает |
|---------|------------|
| `python asm.py pull` | скачать тексты App Store в `metadata\ios_*.json` |
| `python asm.py validate` | проверить длину текстов |
| `python asm.py keywords` / `description` / `promo` / `name` | отправить тексты в App Store |
| `python asm.py whats-new --text "Bug fixes"` | текст «Что нового» |
| `python play.py pull` | скачать тексты Google Play в `metadata\play_*.json` |
| `python play.py update --dry-run` | показать, что изменится, ничего не отправляя |
| `python play.py update` | отправить тексты в Google Play |
| `python dump_listings.py` | сохранить копию всех текстов из обоих магазинов (только чтение) |

Остальные скрипты описаны в `README.md`.

Ключевые слова, описание и «Что нового» в App Store меняются только на новой версии, которая ещё не отправлена на проверку. Сначала создайте версию в App Store Connect. Промотекст можно менять и на опубликованной версии.

## 6. Частые ошибки

| Ошибка | Что делать |
|--------|------------|
| `Create ...apple.json with key_id...` | нет `apple.json` или он сохранился как `apple.json.txt` |
| `Place AuthKey_<KEY_ID>.p8 in ...` | `.p8` лежит не в той папке или переименован |
| `Copy Play service account JSON to ...` | нет `service-account.json` (проверьте расширение) |
| Apple `401 NOT_AUTHORIZED` | неверный Key ID в `apple.json` или ключ отозван: создайте новый в профиле |
| Apple `403` | у пользователя нет доступа к этому приложению: попросить Илью добавить его в «Пользователи и доступ» |
| Google `403` / `Package not found` | service account не приглашён в Play Console для этого приложения; после приглашения права иногда применяются через несколько часов |
| `No module named ...` | не активирован venv (`venv\Scripts\activate`) или не выполнен `pip install -r requirements.txt` |

## 7. Безопасность

- Ключи хранятся только в `bare\.secrets\store`. Не кладите их в папки проектов, в git, в мессенджеры или в чат с ИИ.
- Если ключ куда-то попал: ключ Apple отзовите в своём профиле App Store Connect и создайте новый, про ключ Google скажите Илье, он его заменит.
