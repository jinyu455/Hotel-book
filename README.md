# 酒店预订系统 (Hotel Booking System)

这是一个基于 **Taro + React** 构建的跨端酒店预订全栈项目，采用 **Express** 作为后端服务框架、**MongoDB** 作为数据库，实现了用户、商户、管理员三类角色的权限隔离与核心业务流程，支持酒店搜索预订、商户酒店管理、管理员资质审核等完整功能。

---

## 项目概览

### 核心定位
面向多角色的酒店预订管理平台，通过精细化的权限控制，实现“用户预订-商户运营-管理员监管”的闭环业务流程。

### 核心功能

| 角色       | 核心功能                                                                 |
| :--------- | :----------------------------------------------------------------------- |
| **用户**   | 账号注册（默认开放用户注册）、登录、首页酒店搜索、酒店列表筛选、酒店详情查看、订单提交（尚未完成） |
| **商户**   | 账号注册（默认注册为商户）、登录、已发布酒店管理、酒店新建、酒店信息编辑、订单查看（尚未完成） |
| **管理员** | 登录、酒店列表筛选（按审核状态）、酒店资质审核、酒店详情查看、审核结果提交           |

### 技术栈

| 模块       | 技术选型                                                                 |
| :--------- | :----------------------------------------------------------------------- |
| **前端**   | Taro 3.x、React、TypeScript、SCSS、Taro UI 组件库        |
| **后端**   | Node.js、Express、MongoDB、Mongoose、JWT（权限认证）   |
| **开发工具** | VSCode、Git       |

---

## 项目结构

HOTEL-BOOK/
├── back/                     # 后端服务目录
│   ├── middleware/           # 中间件
│   │   └── auth.js           # JWT 权限校验中间件
│   ├── models/               # MongoDB 数据模型
│   │   ├── Hotel.js          # 酒店模型
│   │   ├── Order.js          # 订单模型（尚未完成完整功能）
│   │   ├── Review.js         # 评价模型（尚未完成完整功能）
│   │   └── User.js           # 用户（含商户）模型
│   ├── routes/               # 接口路由
│   │   ├── auth.js           # 登录/注册接口
│   │   ├── hotels.js         # 酒店相关接口
│   │   ├── orders.js         # 订单相关接口（尚未完成完整功能）
│   │   ├── reviews.js        # 评价相关接口（尚未完成完整功能）
│   │   └── upload.js         # 图片上传接口
│   ├── scripts/              # 模拟数据脚本
│   │   ├── mockHotels.js     # 酒店模拟数据
│   │   ├── mockMerchantWithTwoHotels.js # 带酒店的商户模拟数据
│   │   ├── mockPendingHotels.js # 待审核酒店模拟数据
│   │   └── mockUsers.js      # 用户模拟数据
│   ├── uploads/              # 图片上传存储目录
│   ├── app.js                # 后端入口文件
│   ├── package.json          # 后端依赖配置
│   └── package-lock.json     # 后端依赖锁文件
├── front/                    # 前端项目目录
│   ├── src/                  # 前端核心源码
│   │   ├── pages/            # 页面组件
│   │   │   ├── admin/        # 管理员页面
│   │   │   │   └── hotel/    # 管理员酒店管理
│   │   │   │       ├── audit/ # 酒店审核页
│   │   │   │       │   ├── components/ # 审核页公共组件
│   │   │   │       │   ├── detail/     # 酒店审核详情
│   │   │   │       │   └── list/       # 待审核酒店列表
|   |   |   |       ├── edit/ # 商户编辑自己酒店
|   |   |   |       └── list/ # 商户自己酒店列表
│   │   │   ├── login/        # 统一登录页
│   │   │   ├── register/     # 统一注册页（默认注册为商户）
│   │   │   ├── home/         # 用户首页（酒店搜索）
│   │   │   ├── list/         # 用户酒店搜索结果列表
│   │   │   └── detail/       # 酒店详情页（用户/商户/管理员共用）
│   │   ├── app.config.ts     # Taro 全局配置（路由/导航栏）
│   │   ├── app.ts            # 前端入口文件
│   │   ├── app.scss          # 全局样式
│   │   └── index.html        # 入口 HTML
│   ├── config/               # Taro 项目配置
│   ├── dist/                 # 编译输出目录
│   ├── node_modules/         # 前端依赖
│   ├── .husky/               # Git 提交钩子
│   ├── package.json          # 前端依赖配置
│   └── package-lock.json     # 前端依赖锁文件
└── README.md                 # 项目说明文档

---

## 快速开始

### 前置准备
1.  安装 **Node.js**（推荐 v16+）、**npm**（推荐 v8+）；
2.  安装并启动 **MongoDB**（本地服务或远程连接均可）；
3.  克隆本项目：`git clone <项目仓库地址>`；
4.  进入项目根目录：`cd HOTEL-BOOK`。

### 后端启动
1.  进入后端目录：`cd back`；
2.  安装依赖：`npm install`；
3.  配置环境（可选）：新建 `.env` 文件，配置 MongoDB 地址、JWT 密钥等（参考下方**环境配置**）；
4.  生成模拟数据：`node scripts/mockUsers.js && node scripts/mockHotels.js`；
5.  启动服务：`npm run start`（默认运行在 `http://localhost:5000`）。

### 前端启动
1.  新开终端，进入前端目录：`cd front`；
2.  安装依赖：`npm install`；
3.  启动开发服务（以微信小程序为例）：`npm run dev:weapp`；
4.  打开微信开发者工具，导入 `front/dist/weapp` 目录，即可预览项目。

### 环境配置（后端 .env 示例）
```env
# MongoDB 连接地址
MONGO_URL=mongodb://localhost:27017/hotel_book
# JWT 密钥
JWT_SECRET=your_secret_key
# 服务端口
PORT=5000
```

---

## 核心业务流程

### 1. 注册与登录
- **注册**：所有用户通过 `/register` 页面注册，默认注册为**商户**角色，账号自动存入数据库；
- **登录**：通过 `/login` 页面输入账号密码，后端验证后生成 JWT 令牌，前端存储令牌并根据角色跳转至对应页面：
  - 用户 → 首页（`/home`）；
  - 商户 → 已发布酒店列表（`/admin/hotel/list`）；
  - 管理员 → 酒店审核列表（`/admin/hotel/audit/list`）。

### 2. 用户预订流程
1.  首页（`/home`）输入关键词搜索酒店；
2.  跳转至酒店列表页（`/list`），查看筛选后的酒店；
3.  点击酒店，进入详情页（`/detail`），查看酒店信息；
4.  提交订单，后端生成订单，关联用户与酒店信息。（尚未完成）

### 3. 商户运营流程
1.  登录后进入已发布酒店列表页，可查看自身发布的所有酒店；
2.  点击「新建酒店」，进入编辑页（`/admin/hotel/edit`），提交酒店信息（待审核状态）；
3.  点击现有酒店，进入编辑页修改信息，修改后需重新审核；
4.  查看订单列表，跟踪用户预订状态。（尚未完成）

### 4. 管理员审核流程
1.  登录后进入酒店审核列表页（`/admin/hotel/audit/list`），可按「待审核/已通过/已驳回」筛选；
2.  点击待审核酒店，进入审核详情页（`/admin/hotel/audit/detail`）；
3.  审核通过：酒店状态更新为「已通过」，用户可搜索到该酒店；
4.  审核驳回：酒店状态更新为「已拒绝」，商户可查看驳回原因并修改后重新提交。

---

## 接口规范

### 基础格式
- **请求方式**：GET（查询）、POST（新增）、PUT（修改）、DELETE（删除）；
- **数据格式**：所有接口均采用 JSON 格式传输；
- **权限接口**：需在请求头中携带 JWT 令牌：`'x-auth-token': token `。

### 核心接口示例

| 接口地址          | 请求方式 | 角色权限 | 描述           |
| :---------------- | :------- | :------- | :------------- |
| `/api/auth/login` | POST     | 所有     | 账号登录       |
| `/api/auth/register` | POST  | 所有     | 账号注册       |
| `/api/hotels`     | GET      | 所有     | 获取酒店列表   |
| `/api/hotels`     | POST     | 商户     | 新建酒店       |
| `/api/hotels/:id` | PUT      | 商户/管理员 | 修改酒店信息 |
| `/api/hotels/audit/:id` | PUT  | 管理员   | 酒店审核       |

---

## 开发与调试

### 权限调试
- 后端通过 `middleware/auth.js` 校验 JWT 令牌，解析用户角色后拦截无权限请求；
- 前端在请求拦截器中统一携带令牌，在响应拦截器中处理令牌过期（跳转至登录页）。

### 页面路由
前端路由配置在 `front/src/app.config.ts` 中，核心路由映射：
```ts
pages: [
  'pages/login/index',
  'pages/register/index',
  'pages/home/index',
  'pages/list/index',
  'pages/detail/index',
  'pages/admin/hotel/audit/list/index',
  'pages/admin/hotel/audit/detail/index',
  'pages/admin/hotel/list/index',
  'pages/admin/hotel/edit/index'
]
