import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/summary", async (req, res) => {
  const { coin, currentPrice, rsi, ema20, ema50, trend, note, candles } = req.body;

  const prompt = `
당신은 암호화폐 트레이딩 보조 AI입니다.
아래 데이터를 보고 현재 상황을 한국어로 3~5줄 요약해주세요.

코인: ${coin}
현재가: ${currentPrice}원
RSI: ${rsi}
EMA20: ${ema20}
EMA50: ${ema50}
추세: ${trend}
메모: ${note || "없음"}
최근 캔들 5개: ${JSON.stringify(candles?.slice(-5))}
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 500,
      messages: [{ role: "user", content: prompt }],
    });
    const text = response.choices[0].message.content;
    res.json({ summary: text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "OpenAI 호출 실패" });
  }
});

app.listen(3001, () => {
  console.log("서버 실행 중: http://localhost:3001");
});