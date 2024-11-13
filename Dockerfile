# Node.js 20 이미지 설정
FROM node:20

# pnpm 설치
RUN npm install -g pnpm

# 최상위 폴더를 작업 디렉토리
WORKDIR /app

# 공통 package.json과 lock 파일을 복사 및 설치
COPY package*.json pnpm-lock.yaml ./
RUN pnpm install

# 프론트엔드 파일 복사 및 빌드
WORKDIR /app/apps/frontend
COPY apps/frontend ./
RUN pnpm install
RUN pnpm run build

# 백엔드 파일 복사 및 의존성 설치
WORKDIR /app/apps/backend
COPY apps/backend ./
RUN pnpm install

# 프론트엔드와 백엔드 포트 노출 설정
EXPOSE 3000 8080

# 컨테이너 시작 시 실행
CMD ["sh", "-c", "pnpm --prefix /app/apps/frontend run dev & pnpm --prefix /app/apps/backend start"]
