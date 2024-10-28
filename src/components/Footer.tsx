import { Mail, Calendar } from 'lucide-react';

export function Footer() {
  return (
    <div className="mt-12 pt-6 border-t border-purple-100">
      <div className="mt-12 text-center">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">只要付一杯咖啡，就直接分享程序</h3>
        <div className="space-y-4">
          <img 
            src="https://i.ibb.co/ZRQBj7L/payment-qr.jpg"
            alt="支付二维码" 
            className="mx-auto rounded-lg shadow-lg hover:scale-105 transition-transform duration-300 w-64 h-64 object-contain bg-white p-4"
          />
          <p className="text-sm text-gray-600">以上二维码支持微信/支付宝支付</p>
        </div>
      </div>

      <p className="text-gray-600 flex items-center justify-center gap-2 mt-6 text-xs">
        <span>Designed by Xinlin Luo</span>
        <span className="text-purple-400">•</span>
        <a href="mailto:30005095@qq.com" className="text-purple-600 hover:text-purple-700 flex items-center gap-1">
          <Mail className="w-3 h-3 animate-bounce" />
          30005095@qq.com
        </a>
        <span className="text-purple-400">•</span>
        <span className="flex items-center gap-1 text-gray-500">
          <Calendar className="w-3 h-3 animate-pulse" />
          2024-10-26
        </span>
      </p>
    </div>
  );
}