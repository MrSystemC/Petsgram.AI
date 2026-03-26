import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { UserRole } from '../types';
import { analyzeImage } from '../services/geminiService';

interface DiagnosticsViewProps {
  userRole: UserRole;
}

const DiagnosticsView: React.FC<DiagnosticsViewProps> = ({ userRole }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [analysis, setAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        // Extract base64 data correctly
        const base64Data = result.split(',')[1];
        setSelectedImage(base64Data);
        setMimeType(file.type);
        setAnalysis(''); // Clear previous analysis
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setAnalysis('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const runAnalysis = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    let prompt = "";
    
    switch(userRole) {
      case UserRole.VET:
        prompt = "Проанализируй это изображение с медицинской точки зрения. Укажи возможные патологии, дерматологические проблемы или внешние признаки заболеваний. Используй профессиональную терминологию.";
        break;
      case UserRole.FARMER:
        prompt = "Оцени состояние животного или растения на фото. Есть ли признаки болезней, паразитов или недостатка питательных веществ? Дай рекомендации.";
        break;
      case UserRole.ECO_ACTIVIST:
        prompt = "Определи вид животного/растения на фото. Находится ли оно под угрозой? Оцени состояние окружающей среды, если она видна.";
        break;
      default:
        prompt = "Что изображено на фото? Если это питомец, определи породу. Если видна проблема (рана, сыпь), подскажи, что это может быть и стоит ли срочно бежать к врачу.";
        break;
    }

    try {
      const result = await analyzeImage(selectedImage, mimeType, prompt, userRole);
      setAnalysis(result);
    } catch (error) {
      setAnalysis("Ошибка анализа изображения. Пожалуйста, попробуйте другое фото.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 p-4 md:p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto w-full space-y-6">
        
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-slate-900">Визуальная Диагностика</h2>
          <p className="text-slate-500">
            Загрузите фото питомца, рентген или снимок растения для анализа нейросетью.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
          
          {!selectedImage ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 rounded-xl p-12 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 hover:border-emerald-400 transition-all group"
            >
              <div className="bg-emerald-100 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                <Upload className="text-emerald-600" size={32} />
              </div>
              <p className="text-slate-900 font-medium text-lg">Нажмите для загрузки фото</p>
              <p className="text-slate-400 text-sm mt-1">JPG, PNG до 5MB</p>
              <input 
                ref={fileInputRef} 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                className="hidden" 
              />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative rounded-xl overflow-hidden bg-slate-900 max-h-[400px] flex items-center justify-center">
                <img 
                  src={`data:${mimeType};base64,${selectedImage}`} 
                  alt="Preview" 
                  className="max-h-[400px] w-auto object-contain"
                />
                <button 
                  onClick={clearImage}
                  className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {!analysis && (
                <button
                  onClick={runAnalysis}
                  disabled={isAnalyzing}
                  className="w-full py-4 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2 shadow-lg shadow-emerald-200"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      <span>Анализирую изображение...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle size={20} />
                      <span>Запустить анализ</span>
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {analysis && (
            <div className="mt-8 animate-fade-in">
              <div className="flex items-center space-x-2 mb-4">
                <AlertCircle className="text-emerald-600" />
                <h3 className="text-xl font-bold text-slate-800">Результат анализа</h3>
              </div>
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 text-slate-700 leading-relaxed whitespace-pre-wrap">
                {analysis}
              </div>
              <div className="mt-4 p-4 bg-blue-50 text-blue-800 rounded-lg text-sm border border-blue-100">
                <strong>Важно:</strong> Это результат работы ИИ. Он не заменяет очную консультацию специалиста. В экстренных случаях обратитесь к врачу.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiagnosticsView;
