import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { ProcessedData } from './ExcelProcessor';
import fontkit from '@pdf-lib/fontkit';

async function loadChineseFont() {
  try {
    const response = await fetch('https://cdn.jsdelivr.net/npm/noto-sans-sc@2.0.0/NotoSansSC-Regular.otf');
    const fontData = await response.arrayBuffer();
    return fontData;
  } catch (error) {
    console.error('Failed to load Chinese font:', error);
    throw new Error('无法加载中文字体');
  }
}

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

export async function generatePDFReport(
  fileName: string,
  query: string,
  aiPlan: string,
  data: ProcessedData
): Promise<void> {
  try {
    // Create PDF document
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4',
      putOnlyUsedFonts: true,
      floatPrecision: 16
    });

    // Load and embed Chinese font
    const fontData = await loadChineseFont();
    doc.addFileToVFS('NotoSansSC-Regular.ttf', fontData);
    doc.addFont('NotoSansSC-Regular.ttf', 'NotoSansSC', 'normal');
    doc.setFont('NotoSansSC');

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

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let yPosition = margin;

    // Title
    doc.setFontSize(16);
    doc.text(`${fileName} 数据分析结果`, margin, yPosition);
    yPosition += 10;

    // Tool info
    doc.setFontSize(10);
    doc.text('分析工具：Xinlin-Excel Processor', margin, yPosition);
    yPosition += 7;
    doc.text('联系邮箱：300050956@qq.com', margin, yPosition);
    yPosition += 10;

    // Analysis time
    doc.text(`分析时间：${now}`, margin, yPosition);
    yPosition += 15;

    // Analysis purpose
    doc.setFontSize(12);
    doc.text('分析目的：', margin, yPosition);
    yPosition += 7;
    const queryLines = doc.splitTextToSize(query, pageWidth - 2 * margin);
    doc.setFontSize(10);
    doc.text(queryLines, margin, yPosition);
    yPosition += queryLines.length * 5 + 10;

    // Analysis plan
    doc.setFontSize(12);
    doc.text('分析计划：', margin, yPosition);
    yPosition += 7;
    const planBox = {
      x: margin - 2,
      y: yPosition - 4,
      w: pageWidth - 2 * margin + 4,
      h: 0
    };
    const planLines = doc.splitTextToSize(aiPlan, pageWidth - 2 * margin - 4);
    doc.setFontSize(10);
    doc.text(planLines, margin, yPosition);
    planBox.h = planLines.length * 5 + 8;
    doc.rect(planBox.x, planBox.y, planBox.w, planBox.h);
    yPosition += planLines.length * 5 + 15;

    // Check for new page
    if (yPosition > pageHeight - 60) {
      doc.addPage();
      yPosition = margin;
    }

    // Analysis results
    doc.setFontSize(12);
    doc.text('分析结果：', margin, yPosition);
    yPosition += 7;
    const resultBox = {
      x: margin - 2,
      y: yPosition - 4,
      w: pageWidth - 2 * margin + 4,
      h: 0
    };
    const analysisLines = doc.splitTextToSize(data.analysis, pageWidth - 2 * margin - 4);
    doc.setFontSize(10);
    doc.text(analysisLines, margin, yPosition);
    resultBox.h = analysisLines.length * 5 + 8;
    doc.rect(resultBox.x, resultBox.y, resultBox.w, resultBox.h);
    yPosition += analysisLines.length * 5 + 20;

    // Check for new page
    if (yPosition > pageHeight - 100) {
      doc.addPage();
      yPosition = margin;
    }

    // Payment info
    doc.setFontSize(12);
    const paymentText = '只要付一杯咖啡钱，就直接分享程序';
    doc.text(paymentText, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 10;

    // QR code
    const qrWidth = 60;
    const qrHeight = 60;
    const qrX = (pageWidth - qrWidth) / 2;

    try {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = 'https://i.ibb.co/ZRQBj7L/image.jpg';
      });
      
      doc.addImage(
        img,
        'JPEG',
        qrX,
        yPosition,
        qrWidth,
        qrHeight
      );
      yPosition += qrHeight + 10;
      doc.setFontSize(10);
      doc.text('以上二维码支持微信/支付宝支付', pageWidth / 2, yPosition, { align: 'center' });
    } catch (imgError) {
      console.error('加载二维码图片失败:', imgError);
    }

    // Footer with device info
    const deviceInfo = getDeviceInfo();
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    const footerText = `${deviceInfo} 提交 "${fileName}" 分析 ${now}`;
    doc.text(footerText, pageWidth / 2, pageHeight - 10, { align: 'center' });

    // Save PDF
    const timestamp = new Date().toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).replace(/[/:]/g, '-');
    
    doc.save(`${fileName}_分析报告_${timestamp}.pdf`);
  } catch (error) {
    console.error('生成PDF报告时出错:', error);
    alert('生成PDF报告失败，请重试');
  }
}