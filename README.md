# 📈 Coin Trading Dashboard 2026=03-25

업비트 API와 OpenAI API를 연동한 실시간 암호화폐 트레이딩 대시보드입니다.

## 주요 기능

- 업비트 API 연동 — 실시간 코인 시세 및 거래 데이터 조회
- OpenAI API 연동 — AI 기반 시장 분석 및 트레이딩 인사이트 제공
- 실시간 대시보드 UI — 차트 및 데이터 시각화

## 기술 스택

- React + Vite
- 업비트 Open API
- OpenAI API

## 실행 방법

```bash
# 패키지 설치
npm install

# 개발 서버 실행
npm run dev
```

## 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 아래 키를 입력하세요.

```
VITE_UPBIT_ACCESS_KEY=your_upbit_access_key
VITE_UPBIT_SECRET_KEY=your_upbit_secret_key
VITE_OPENAI_API_KEY=your_openai_api_key
```
