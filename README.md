# direct-dev-server
Веб-сервер для заданной ENB-ноды с автоматической сборкой при изменении исходных файлов.

## Установка

```
npm i direct-dev-server -D
```

## Как запустить
```
node lib/cli --bundle <enb_node_name>
```

### Параметры

- `-b`, `--bundle <enb_node_name>` - нода для сборки (обязательный параметр)
- `-p`, `--port <port>` - порт веб-сервера (по умолчанию 3000)
- `-h`, `--host <host>` - хост веб-сервера (по умолчанию `localhost`)
- `-d`, `--display-host <host>` - название хоста для отображаемой ссылки (по умолчанию используется значение параметра `http://host:port`)
- `-t`, `--target <target>` - enb-target, который будет открываться по умолчанию (переопределяет параметр `defaultTarget` из конфига)

## Конфиг
Конфиг должен лежать в корневой директории и называться `.dev-server.js`.

Пример конфига:
```js
module.exports = {
    baseDir: 'example-project',     // основная папка проекта
    baseUrl: 'test.bundles',        // базовый адрес веб-сервера
    bundles: 'bundles',             // путь к папке с бандлами относительно корня проекта (baseDir) 
    levels: [                       // список уровней переопределения
      'common.blocks',              // (в них будут отслеживаться изменения файлов)  
      'desktop.blocks'
    ],     
    defaultTarget: '?.test.html',   // таргет начальной страницы (будет открыта в браузере при старте)
    targets: {                      // зависимости таргетов от бэм-технологий
        '?.js': ['js'],
        '?.test.js': ['test.js'],
        '?.css': ['css']
    }
};
```
