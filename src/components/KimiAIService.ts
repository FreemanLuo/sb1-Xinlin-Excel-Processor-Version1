import axios from 'axios';

const KIMI_API_KEY = 'sk-vVDeb3KFPVNsjQmRZMHmTpxDOCnsdny4b6gWGOIV72c6aDOA';
const KIMI_API_URL = 'https://api.moonshot.cn/v1/chat/completions';

export async function processWithKimiAI(query: string, excelData: string) {
  try {
    const response = await axios.post(
      KIMI_API_URL,
      {
        model: 'moonshot-v1-8k',
        messages: [
          {
            role: 'system',
            content: '你是一位专业的数据分析专家。请根据用户的要求分析Excel数据，并提供具体的见解。请使用中文回复。'
          },
          {
            role: 'user',
            content: `
              分析需求：${query}
              
              Excel数据：
              ${excelData}
              
              请分析这些数据并提供：
              1. 根据需求得出的关键见解
              2. 支持这些见解的具体数据点
              3. 发现的任何模式或趋势
              4. 基于分析的建议
            `
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      },
      {
        headers: {
          'Authorization': `Bearer ${KIMI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('调用KIMI AI时出错:', error);
    throw new Error('KIMI AI处理失败');
  }
}