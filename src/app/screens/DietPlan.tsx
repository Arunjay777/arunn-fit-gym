import React, { useState, useEffect } from 'react';
import TacticalHeader from '../components/TacticalHeader';
import TacticalCard from '../components/TacticalCard';
import { Utensils, TrendingUp, Target, Flame } from 'lucide-react';

type BodyType = 'skinny' | 'fit' | 'fat' | null;

export default function DietPlan() {
  const [selectedType, setSelectedType] = useState<BodyType>(null);
  const [currentImageIndices, setCurrentImageIndices] = useState<Record<number, number>>({});

  const dietPlans = {
    skinny: {
      title: 'BULKING PROTOCOL',
      description: 'High-calorie surplus to build muscle mass',
      dailyCalories: 3200,
      color: '#00D4FF',
      meals: [
        {
          name: 'Breakfast: Power Oats',
          calories: 650,
          protein: 35,
          carbs: 85,
          fats: 20,
          images: [
            'https://images.unsplash.com/photo-1690896306653-6857ac14df1b?w=800',
            'https://images.unsplash.com/photo-1650562075965-4940a2cfbfe4?w=800'
          ],
          description: 'Oatmeal with banana, peanut butter, protein powder'
        },
        {
          name: 'Lunch: Chicken & Rice Bowl',
          calories: 850,
          protein: 55,
          carbs: 95,
          fats: 22,
          images: [
            'https://images.unsplash.com/photo-1762631934518-f75e233413ca?w=800',
            'https://images.unsplash.com/photo-1778449588437-97bd47f88276?w=800'
          ],
          description: 'Grilled chicken breast, brown rice, mixed vegetables'
        },
        {
          name: 'Dinner: Salmon Power Plate',
          calories: 800,
          protein: 50,
          carbs: 70,
          fats: 30,
          images: [
            'https://images.unsplash.com/photo-1613293984606-b797e2c48842?w=800',
            'https://images.unsplash.com/photo-1556845752-92f6fe9f596d?w=800'
          ],
          description: 'Baked salmon, sweet potato, quinoa, broccoli'
        }
      ]
    },
    fit: {
      title: 'MAINTENANCE PROTOCOL',
      description: 'Balanced nutrition for performance',
      dailyCalories: 2500,
      color: '#00FF88',
      meals: [
        {
          name: 'Breakfast: Balanced Bowl',
          calories: 500,
          protein: 30,
          carbs: 55,
          fats: 18,
          images: ['https://images.unsplash.com/photo-1690896306653-6857ac14df1b?w=800'],
          description: 'Greek yogurt, granola, berries, chia seeds'
        },
        {
          name: 'Lunch: Lean Protein Bowl',
          calories: 650,
          protein: 45,
          carbs: 60,
          fats: 20,
          images: ['https://images.unsplash.com/photo-1762631934518-f75e233413ca?w=800'],
          description: 'Grilled chicken, quinoa, mixed greens, avocado'
        },
        {
          name: 'Dinner: Clean Protein',
          calories: 700,
          protein: 48,
          carbs: 55,
          fats: 25,
          images: ['https://images.unsplash.com/photo-1613293984606-b797e2c48842?w=800'],
          description: 'Baked salmon, roasted vegetables, brown rice'
        }
      ]
    },
    fat: {
      title: 'CUTTING PROTOCOL',
      description: 'Caloric deficit for fat loss',
      dailyCalories: 1800,
      color: '#FF3366',
      meals: [
        {
          name: 'Breakfast: Protein Start',
          calories: 350,
          protein: 35,
          carbs: 30,
          fats: 12,
          images: ['https://images.unsplash.com/photo-1675501343762-fc726e82809c?w=800'],
          description: 'Egg whites, whole grain toast, spinach'
        },
        {
          name: 'Lunch: Lean & Green',
          calories: 450,
          protein: 40,
          carbs: 35,
          fats: 15,
          images: ['https://images.unsplash.com/photo-1605034298551-baacf17591d1?w=800'],
          description: 'Grilled chicken breast with large salad'
        },
        {
          name: 'Dinner: High Protein',
          calories: 650,
          protein: 55,
          carbs: 40,
          fats: 22,
          images: ['https://images.unsplash.com/photo-1613293984606-b797e2c48842?w=800'],
          description: 'Baked salmon, steamed broccoli, small quinoa'
        }
      ]
    }
  };

  useEffect(() => {
    if (selectedType) {
      const interval = setInterval(() => {
        setCurrentImageIndices(prev => {
          const newIndices = { ...prev };
          dietPlans[selectedType].meals.forEach((meal, index) => {
            newIndices[index] = ((prev[index] || 0) + 1) % meal.images.length;
          });
          return newIndices;
        });
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedType]);

  if (!selectedType) {
    return (
      <div className="min-h-screen p-8">
        <TacticalHeader title="DIET PLAN" subtitle="PERSONALIZED NUTRITION PROTOCOLS" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TacticalCard>
            <button onClick={() => setSelectedType('skinny')} className="w-full text-left">
              <TrendingUp className="w-12 h-12 mb-4" style={{ color: '#00D4FF' }} />
              <h3 className="font-mono text-xl mb-2" style={{ color: '#FFFFFF' }}>SKINNY / ECTOMORPH</h3>
              <p className="font-mono text-sm mb-4" style={{ color: '#888888' }}>Build muscle mass</p>
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-5 h-5" style={{ color: '#FF3366' }} />
                <span className="font-mono text-2xl" style={{ color: '#00D4FF' }}>3200 Cal</span>
              </div>
              <p className="font-mono text-xs" style={{ color: '#888888' }}>High-calorie surplus</p>
            </button>
          </TacticalCard>

          <TacticalCard>
            <button onClick={() => setSelectedType('fit')} className="w-full text-left">
              <Target className="w-12 h-12 mb-4" style={{ color: '#00FF88' }} />
              <h3 className="font-mono text-xl mb-2" style={{ color: '#FFFFFF' }}>FIT / MESOMORPH</h3>
              <p className="font-mono text-sm mb-4" style={{ color: '#888888' }}>Maintain & optimize</p>
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-5 h-5" style={{ color: '#FF3366' }} />
                <span className="font-mono text-2xl" style={{ color: '#00FF88' }}>2500 Cal</span>
              </div>
              <p className="font-mono text-xs" style={{ color: '#888888' }}>Balanced nutrition</p>
            </button>
          </TacticalCard>

          <TacticalCard>
            <button onClick={() => setSelectedType('fat')} className="w-full text-left">
              <Flame className="w-12 h-12 mb-4" style={{ color: '#FF3366' }} />
              <h3 className="font-mono text-xl mb-2" style={{ color: '#FFFFFF' }}>OVERWEIGHT / ENDOMORPH</h3>
              <p className="font-mono text-sm mb-4" style={{ color: '#888888' }}>Lose fat</p>
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-5 h-5" style={{ color: '#FF3366' }} />
                <span className="font-mono text-2xl" style={{ color: '#FF3366' }}>1800 Cal</span>
              </div>
              <p className="font-mono text-xs" style={{ color: '#888888' }}>Caloric deficit</p>
            </button>
          </TacticalCard>
        </div>
      </div>
    );
  }

  const plan = dietPlans[selectedType];

  return (
    <div className="min-h-screen p-8">
      <TacticalHeader title={plan.title} subtitle={plan.description} />

      <div className="mb-6">
        <button
          onClick={() => setSelectedType(null)}
          className="px-4 py-2 font-mono transition-all"
          style={{ border: '1px solid #00D4FF', color: '#00D4FF' }}
        >
          ← BACK TO SELECTION
        </button>
      </div>

      <TacticalCard className="mb-6">
        <div className="flex items-center gap-4">
          <Utensils className="w-8 h-8" style={{ color: plan.color }} />
          <div>
            <div className="font-mono text-2xl" style={{ color: plan.color }}>{plan.dailyCalories} CALORIES/DAY</div>
            <div className="font-mono text-sm" style={{ color: '#888888' }}>{plan.description}</div>
          </div>
        </div>
      </TacticalCard>

      <div className="space-y-6">
        {plan.meals.map((meal, index) => {
          const currentImageIndex = currentImageIndices[index] || 0;
          return (
            <TacticalCard key={index} noPadding>
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative h-64 md:h-auto overflow-hidden">
                  <img
                    src={meal.images[currentImageIndex]}
                    alt={meal.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {meal.images.length > 1 && (
                    <div className="absolute top-4 right-4 px-3 py-1" style={{ background: 'rgba(0, 0, 0, 0.8)' }}>
                      <span className="font-mono text-xs" style={{ color: '#00D4FF' }}>
                        {currentImageIndex + 1}/{meal.images.length}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-mono text-xl mb-3" style={{ color: '#FFFFFF' }}>{meal.name}</h3>
                  <p className="font-mono text-sm mb-4" style={{ color: '#888888' }}>{meal.description}</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3" style={{ background: 'rgba(255, 51, 102, 0.1)' }}>
                      <div className="font-mono text-xs mb-1" style={{ color: '#888888' }}>CALORIES</div>
                      <div className="font-mono text-2xl" style={{ color: '#FF3366' }}>{meal.calories}</div>
                    </div>
                    <div className="p-3" style={{ background: 'rgba(0, 212, 255, 0.1)' }}>
                      <div className="font-mono text-xs mb-1" style={{ color: '#888888' }}>PROTEIN</div>
                      <div className="font-mono text-2xl" style={{ color: '#00D4FF' }}>{meal.protein}g</div>
                    </div>
                    <div className="p-3" style={{ background: 'rgba(0, 255, 136, 0.1)' }}>
                      <div className="font-mono text-xs mb-1" style={{ color: '#888888' }}>CARBS</div>
                      <div className="font-mono text-2xl" style={{ color: '#00FF88' }}>{meal.carbs}g</div>
                    </div>
                    <div className="p-3" style={{ background: 'rgba(255, 215, 0, 0.1)' }}>
                      <div className="font-mono text-xs mb-1" style={{ color: '#888888' }}>FATS</div>
                      <div className="font-mono text-2xl" style={{ color: '#FFD700' }}>{meal.fats}g</div>
                    </div>
                  </div>
                </div>
              </div>
            </TacticalCard>
          );
        })}
      </div>
    </div>
  );
}
