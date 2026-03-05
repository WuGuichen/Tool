# 阶段一：构建 React 前端
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install
COPY frontend ./
RUN npm run build

# 阶段二：配置 FastAPI 后端
FROM continuumio/miniconda3 AS backend-builder
WORKDIR /app

# 创建 conda 环境
COPY backend/environment.yml .
RUN conda env create -f environment.yml -n web-toolbox

# 阶段三：运行环境 (合并前后端)
FROM debian:bookworm-slim
WORKDIR /app

# 安装必要的依赖
RUN apt-get update && apt-get install -y --no-install-recommends \
    wget bzip2 ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# 复制 conda 环境和后端代码
COPY --from=backend-builder /opt/conda /opt/conda
COPY backend /app/backend

# 复制前端编译好的静态文件到后端的 public 目录 (如果由 FastAPI 代理的话)
# 但在这个架构中，建议用 Nginx 或者让 FastAPI 提供静态文件代理
# 为了最简单部署（无 Nginx），我们在 FastAPI 中挂载前端 dist：
COPY --from=frontend-builder /app/frontend/dist /app/backend/public

# 设置环境变量，使用刚才安装的 conda 环境的 python
ENV PATH="/opt/conda/envs/web-toolbox/bin:$PATH"
ENV PYTHONPATH="/app/backend:$PYTHONPATH"

# 工作目录切到后端，启动 uvicorn
WORKDIR /app/backend

# 为了让 FastAPI 返回前端页面，需要在 main.py 挂载静态路由
# 此处暴露 8000 端口
EXPOSE 8000

# 运行命令
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
