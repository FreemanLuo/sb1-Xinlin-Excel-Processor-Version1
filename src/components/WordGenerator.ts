import { Document, Paragraph, TextRun, ImageRun, AlignmentType, HeadingLevel, Packer } from 'docx';
import { saveAs } from 'file-saver';
import { ProcessedData } from './ExcelProcessor';

function getDeviceInfo(): string {
  const userAgent = navigator.userAgent.toLowerCase();
  const platform = navigator.platform;
  let deviceType = '';
  let deviceName = '';

  if (/iphone|ipad|ipod/.test(userAgent)) {
    deviceType = 'iOS移动设备';
    deviceName = platform;
  } else if (/android/.test(userAgent)) {
    deviceType = 'Android移动设备';
    deviceName = platform;
  } else {
    deviceType = '电脑设备';
    deviceName = platform;
  }

  return `${deviceType} ${deviceName}`;
}

function formatMarkdownText(text: string): Paragraph[] {
  const paragraphs: Paragraph[] = [];
  const lines = text.split('\n');

  lines.forEach(line => {
    const trimmedLine = line.trim();
    if (!trimmedLine) {
      paragraphs.push(new Paragraph({ spacing: { after: 200 } }));
      return;
    }

    if (trimmedLine.startsWith('# ')) {
      paragraphs.push(new Paragraph({
        children: [
          new TextRun({
            text: trimmedLine.substring(2),
            size: 28,
            bold: true,
            color: 'FFFFFF' // White color for headings
          })
        ],
        spacing: { before: 400, after: 200 }
      }));
    } else if (trimmedLine.startsWith('## ')) {
      paragraphs.push(new Paragraph({
        children: [
          new TextRun({
            text: trimmedLine.substring(3),
            size: 24,
            bold: true,
            color: 'FFFFFF' // White color for subheadings
          })
        ],
        spacing: { before: 300, after: 200 }
      }));
    } else if (trimmedLine.startsWith('- ')) {
      paragraphs.push(new Paragraph({
        children: [
          new TextRun({ text: '• ', size: 20 }),
          new TextRun({ text: trimmedLine.substring(2), size: 20 })
        ],
        indent: { left: 720 },
        spacing: { after: 200 }
      }));
    } else if (trimmedLine.startsWith('> ')) {
      paragraphs.push(new Paragraph({
        children: [
          new TextRun({ 
            text: trimmedLine.substring(2), 
            size: 20, 
            italics: true 
          })
        ],
        indent: { left: 720 },
        spacing: { before: 200, after: 200 }
      }));
    } else {
      paragraphs.push(new Paragraph({
        children: [
          new TextRun({ 
            text: trimmedLine, 
            size: 20 
          })
        ],
        spacing: { after: 200 }
      }));
    }
  });

  return paragraphs;
}

export async function generateWordReport(
  fileName: string,
  query: string,
  aiPlan: string,
  data: ProcessedData
): Promise<void> {
  try {
    const now = new Date().toLocaleString('zh-CN', {
      timeZone: 'Asia/Shanghai',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });

    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          // Title
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: `${fileName} 数据分析结果`,
                size: 32,
                bold: true
              })
            ],
            spacing: { after: 400 }
          }),

          // Tool info
          new Paragraph({
            children: [
              new TextRun({
                text: '分析工具：Xinlin-Excel Processor',
                size: 20
              })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: '联系邮箱：300050956@qq.com',
                size: 20
              })
            ]
          }),

          // Analysis time
          new Paragraph({
            children: [
              new TextRun({
                text: `分析时间：${now}`,
                size: 20
              })
            ],
            spacing: { after: 400 }
          }),

          // Analysis purpose
          new Paragraph({
            children: [
              new TextRun({
                text: '分析目的：',
                size: 24,
                bold: true
              })
            ]
          }),
          ...formatMarkdownText(query),

          // Analysis plan
          new Paragraph({
            children: [
              new TextRun({
                text: '分析计划：',
                size: 24,
                bold: true
              })
            ],
            spacing: { before: 400 }
          }),
          ...formatMarkdownText(aiPlan || data.analysis), // Use aiPlan if available, otherwise use data.analysis

          // Analysis results
          new Paragraph({
            children: [
              new TextRun({
                text: '分析结果：',
                size: 24,
                bold: true
              })
            ],
            spacing: { before: 400 }
          }),
          ...formatMarkdownText(data.analysis),

          // Payment info
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: '只要付一杯咖啡钱，就直接分享程序',
                size: 24,
                bold: true
              })
            ],
            spacing: { before: 400, after: 200 }
          }),

          // QR Code
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new ImageRun({
                data: await fetch('https://i.ibb.co/ZRQBj7L/image.jpg').then(r => r.arrayBuffer()),
                transformation: {
                  width: 200,
                  height: 200
                }
              })
            ]
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: '以上二维码支持微信/支付宝支付',
                size: 20
              })
            ],
            spacing: { after: 400 }
          }),

          // Footer
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: `${getDeviceInfo()} 提交 "${fileName}" 分析 ${now}`,
                size: 16,
                color: '808080'
              })
            ]
          })
        ]
      }]
    });

    // Generate and save document
    const buffer = await Packer.toBlob(doc);
    const timestamp = new Date().toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).replace(/[/:]/g, '-');
    
    saveAs(buffer, `${fileName}_分析报告_${timestamp}.docx`);
  } catch (error) {
    console.error('生成Word报告时出错:', error);
    throw new Error('生成Word报告失败，请重试');
  }
}