# Cloudflare Bark Server

Bark 服务端，基于 Cloudflare Workers 实现，新增单用户模式和通知保存。多用户模式和通知保存使用 D1 SQL 数据库。

## 准备工作

1. 创建 [Cloudflare API token](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/)
   - 选择 Edit Cloudflare Workers 模板
   - 需要以下权限：Workers Builds Configuration、Workers Routes、Workers Scripts、D1
2. 获取 [Cloudflare Account ID](https://developers.cloudflare.com/fundamentals/setup/find-account-and-zone-ids/)
3. [可选] 多用户模式或保存通知，需要创建 [D1 SQL 数据库](https://developers.cloudflare.com/d1/get-started/)，并获取数据库名称和 ID
4. [可选] 单用户模式，需要获取 Bark Device Token：打开 Bark App -> 点击右下角设置 -> 点击 Device Token
5. [可选] 单用户模式，需要生成一个随机字符串作为 Bark Key：`openssl rand -base64 16`，删除所有的符号，剩下的字符串作为密钥

## 使用 GitHub Actions 部署

1. Fork 本仓库
2. 在仓库的 Settings -> Secrets and variables -> Actions 中添加以下 Secrets：
   - `CLOUDFLARE_ACCOUNT_ID`：Cloudflare Account ID
   - `CLOUDFLARE_API_TOKEN`：Cloudflare API token
3. 在仓库的 Settings -> Secrets and variables -> Actions 中添加以下 Variables：
   - `PERSIST`：是否启用多用户模式和通知保存，值为 `true`[可选，开启通知保存时配置]
   - `CUSTOM_DOMAIN`：自定义域名[可选]
   - `D1_NAME`：D1 数据库名称[可选]
   - `D1_ID`：D1 数据库 ID[可选]
4. 启用 Actions，手动运行 `Deploy` workflow

## 单用户模式

单用户模式下，只需配置 Bark Device Token 和 Bark Key，即可使用 Bark 服务端。

开启方式：
1. 打开 Cloudflare 控制台
2. 点击菜单 Workers 和 Pages
3. 点击 cloudflare-bark-server 项目
4. 点击设置
5. 选择变量和机密菜单
6. 点击添加
7. 添加密钥类型，名称 DEVICE_TOKEN，值为 Bark Device Token
8. 添加密钥类型，名称 KEY，值为 Bark Key

访问 `https://your-worker-name.your-account.workers.dev/info`，可以看到 serverless 为 true

## 通知保存

当配置 D1 数据库和开启通知保存时，可以保存通知到数据库中。目前暂时没有提供浏览历史通知功能，可以直接在数据库的 `messages` 表中查看。

## 使用方法

查看[官方文档](https://bark.day.app/#/)