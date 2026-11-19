import React from 'react';

// Displays the authentic original product packaging photograph
export default function ProductVisual({ 
  product, 
  className = 'w-full h-full', 
  showShadow = true,
  aspect = 'contain'
}) {
  const imageSrc = product.image || `/images/products/${product.id}.jpg`;

  return (
    <div className={`relative flex items-center justify-center p-2 select-none ${className}`}>
      {/* Subtle soft grounding shadow */}
      {showShadow && (
        <div 
          className="absolute bottom-2 w-3/4 h-5 rounded-full blur-md opacity-30 pointer-events-none" 
          style={{ background: 'radial-gradient(ellipse at center, #102C20 0%, transparent 70%)' }}
        />
      )}
      
      {/* Real Product Packaging Photo */}
      <img
        src={imageSrc}
        alt={`${product.name} - ${product.subtitle}`}
        className="max-h-full max-w-full object-contain filter drop-shadow-xl transition-transform duration-500 group-hover:scale-105 rounded-lg"
        loading="eager"
        decoding="sync"
      />
    </div>
  );
}
