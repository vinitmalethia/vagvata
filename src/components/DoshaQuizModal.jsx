import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { PRODUCTS } from '../data/products';

export default function DoshaQuizModal({ isOpen, onClose, onSelectProduct }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  // Reset quiz when opened
  useEffect(() => {
    if (isOpen) {
      setCurrentQuestion(0);
      setAnswers({});
      setResult(null);
    }
  }, [isOpen]);

  const questions = [
    {
      id: 'bodyFrame',
      question: 'How would you describe your natural physical frame and weight tendency?',
      options: [
        { label: 'Slender, light bones, difficulty gaining weight', dosha: 'Vata' },
        { label: 'Medium athletic build, stable weight, easily tones', dosha: 'Pitta' },
        { label: 'Broad, strong bone structure, gains weight easily', dosha: 'Kapha' }
      ]
    },
    {
      id: 'digestion',
      question: 'How behaves your digestive fire (Agni) and appetite?',
      options: [
        { label: 'Variable & irregular; prone to gas, bloating, dry constipation', dosha: 'Vata' },
        { label: 'Intense & sharp; needs food on time, prone to acidity or heat', dosha: 'Pitta' },
        { label: 'Slow & steady; heavy after meals, can skip meals comfortably', dosha: 'Kapha' }
      ]
    },
    {
      id: 'primaryGoal',
      question: 'Which area of wellness is calling for your deepest care right now?',
      options: [
        { label: 'Strength, stamina, muscle vitality & Ojas rejuvenation', recommendation: 'vajra-shakti-premium' },
        { label: '100% Pure Himalayan Shilajit resin & cellular energy', recommendation: 'shilajit-resin' },
        { label: 'Women’s hormonal harmony & regular cyclical rhythm', recommendation: 'nari-santulan' },
        { label: 'IBS relief, persistent gas, bloating & gut motility', recommendation: 'kosht-sudha' },
        { label: 'Liver detox, bile flow & appetite revival', recommendation: 'akshire-jigar' },
        { label: 'Clear respiratory breathing & bronchial defense', recommendation: 'swas-amrit' },
        { label: 'Blood sugar harmony & curbing sweet cravings', recommendation: 'madhuraksha' }
      ]
    }
  ];

  const handleSelectOption = (qId, option) => {
    const updated = { ...answers, [qId]: option };
    setAnswers(updated);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate results
      const recommendedId = updated.primaryGoal?.recommendation || 'kosht-sudha';
      const matchedProduct = PRODUCTS.find((p) => p.id === recommendedId) || PRODUCTS[0];
      setResult({
        dosha: updated.bodyFrame?.dosha || 'Pitta',
        product: matchedProduct
      });
    }
  };

  const handleReset = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setResult(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-xl bg-[#F7F0DF] rounded-2xl shadow-2xl overflow-hidden border border-[#C9A45C]/40 text-[#263629] z-10"
          >
            {/* Header */}
            <div className="bg-[#102C20] text-[#F7F0DF] p-5 border-b border-[#C9A45C]/25 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-[#C9A45C]" />
                <h3 className="font-serif text-lg font-bold">Ayurvedic Prakriti & Dosha Guide</h3>
              </div>
              <button
                onClick={onClose}
                className="text-[#F7F0DF]/70 hover:text-[#C9A45C] transition-colors p-1"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Questions flow */}
            {!result ? (
              <div className="p-6">
                <div className="flex items-center justify-between text-xs text-[#79583B] mb-4">
                  <span className="uppercase tracking-widest font-semibold">
                    Question {currentQuestion + 1} of {questions.length}
                  </span>
                  <span>Step {currentQuestion + 1} / 3</span>
                </div>

                <h4 className="font-serif text-lg sm:text-xl font-bold text-[#173D2B] mb-5 leading-snug">
                  {questions[currentQuestion].question}
                </h4>

                <div className="space-y-3">
                  {questions[currentQuestion].options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(questions[currentQuestion].id, option)}
                      className="w-full text-left p-4 rounded-xl bg-white border border-[#C9A45C]/30 hover:border-[#173D2B] hover:bg-[#DCE5D5]/30 transition-all duration-200 text-xs sm:text-sm font-medium text-[#173D2B] flex items-center justify-between group cursor-pointer"
                    >
                      <span>{option.label}</span>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#173D2B] group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                    </button>
                  ))}
                </div>

                {currentQuestion > 0 && (
                  <button
                    onClick={() => setCurrentQuestion(currentQuestion - 1)}
                    className="mt-6 text-xs text-[#79583B] hover:text-[#173D2B] flex items-center space-x-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Previous Question</span>
                  </button>
                )}
              </div>
            ) : (
              /* Results Screen */
              <div className="p-8 text-center space-y-5">
                <div className="w-16 h-16 rounded-full bg-[#173D2B] text-[#DFC282] mx-auto flex items-center justify-center text-2xl font-serif">
                  ॐ
                </div>

                <div>
                  <span className="text-xs uppercase tracking-widest text-[#C9A45C] font-semibold">
                    Your Personalized Formulation
                  </span>
                  <h4 className="font-serif text-2xl font-bold text-[#173D2B] mt-1">
                    Dominant Dosha Element: {result.dosha}
                  </h4>
                  <p className="text-xs text-[#4A5B4D] max-w-md mx-auto mt-2">
                    Based on your metabolic traits and wellness goals, our Vaidya team recommends beginning with:
                  </p>
                </div>

                {/* Recommended Product Box */}
                <div className="p-4 rounded-2xl bg-white border border-[#C9A45C]/40 flex items-center space-x-4 text-left max-w-md mx-auto shadow-sm">
                  <div className="w-14 h-16 bg-[#F7F0DF] rounded-lg shrink-0 flex items-center justify-center p-1">
                    <span className="text-xl">🌿</span>
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] text-[#79583B] uppercase font-bold">{result.product.category}</span>
                    <h5 className="font-serif font-bold text-base text-[#173D2B]">{result.product.name}</h5>
                    <p className="text-xs text-[#4A5B4D] line-clamp-1">{result.product.subtitle}</p>
                    <span className="text-xs font-bold text-[#173D2B] mt-1 block">₹{result.product.price}</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      onClose();
                      onSelectProduct(result.product);
                    }}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-md bg-[#C9A45C] text-[#102C20] font-bold text-xs uppercase tracking-wider hover:bg-[#DFC282] transition-colors"
                  >
                    View Formulation Details
                  </button>
                  <button
                    onClick={handleReset}
                    className="w-full sm:w-auto px-4 py-2.5 text-xs text-[#79583B] hover:text-[#173D2B]"
                  >
                    Retake Guide
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
