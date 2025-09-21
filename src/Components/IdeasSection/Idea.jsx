import React, { useState, useEffect, useRef } from 'react';
import '../IdeasSection/Idea.css';
import { 
  ChevronLeft, 
  ChevronRight, 
  Stethoscope,   // Vet
  Heart,         // Personal Care
  ShoppingBag,   // Products
  Baby,          // Baby Care
  Syringe,       // Health
  PawPrint,      // Pets
  Users, 
  Star,
  Shield,
  Globe
} from 'lucide-react';

const IdeasSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [visibleCards, setVisibleCards] = useState(3);
  const intervalRef = useRef(null);

  // ✨ New Ideas data based on categories
  const ideas = [
    {
      id: 1,
      icon: Stethoscope,
      title: "24/7 Vet Support",
      subtitle: "Expert Pet Care",
      description: "Instant access to professional veterinarians to keep your pets healthy and happy.",
      color: "blue-gradient",
      bgColor: "bg-blue",
      category: "Vet"
    },
    {
      id: 2,
      icon: Heart,
      title: "Personal Wellness",
      subtitle: "Care for You",
      description: "Premium personal care products designed to help you look and feel your best.",
      color: "pink-gradient",
      bgColor: "bg-pink",
      category: "Personal Care"
    },
    {
      id: 3,
      icon: Baby,
      title: "Baby Essentials",
      subtitle: "Gentle & Safe",
      description: "Trusted baby care items with the softest touch for your little one's comfort.",
      color: "orange-gradient",
      bgColor: "bg-orange",
      category: "Baby Care"
    },
    {
      id: 4,
      icon: Syringe,
      title: "Health Services",
      subtitle: "Wellness First",
      description: "Book health checkups, vaccinations, and pharmacy products at your convenience.",
      color: "green-gradient",
      bgColor: "bg-green",
      category: "Health"
    },
    {
      id: 5,
      icon: ShoppingBag,
      title: "Shop Products",
      subtitle: "Quality Items",
      description: "Discover a curated collection of trusted brands and high-quality daily essentials.",
      color: "indigo-gradient",
      bgColor: "bg-indigo",
      category: "Products"
    },
    {
      id: 6,
      icon: PawPrint,
      title: "Pet Essentials",
      subtitle: "For Furry Friends",
      description: "Food, toys, and grooming supplies to pamper your pets the right way.",
      color: "yellow-gradient",
      bgColor: "bg-yellow",
      category: "Pets"
    },
    {
      id: 7,
      icon: Star,
      title: "Premium Care",
      subtitle: "Trusted Brands",
      description: "Only the most trusted and top-quality brands for you and your family.",
      color: "teal-gradient",
      bgColor: "bg-teal",
      category: "Products"
    },
    {
      id: 8,
      icon: Shield,
      title: "Secure Services",
      subtitle: "Safe & Reliable",
      description: "We guarantee safe payments and verified services for your peace of mind.",
      color: "gray-gradient",
      bgColor: "bg-gray",
      category: "Health"
    }
  ];

  // ✨ Updated Categories
  const categories = ['All', 'Vet', 'Personal Care', 'Baby Care', 'Health', 'Products', 'Pets'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredIdeas = selectedCategory === 'All' 
    ? ideas 
    : ideas.filter(idea => idea.category === selectedCategory);

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide(prev => 
          prev >= Math.ceil(filteredIdeas.length / visibleCards) - 1 ? 0 : prev + 1
        );
      }, 4000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoPlaying, filteredIdeas.length, visibleCards]);

  // Responsive card count
  useEffect(() => {
    const updateVisibleCards = () => {
      const width = window.innerWidth;
      if (width < 768) setVisibleCards(1);
      else if (width < 1024) setVisibleCards(2);
      else setVisibleCards(3);
    };

    updateVisibleCards();
    window.addEventListener('resize', updateVisibleCards);
    return () => window.removeEventListener('resize', updateVisibleCards);
  }, []);

  const nextSlide = () => {
    setCurrentSlide(prev => 
      prev >= Math.ceil(filteredIdeas.length / visibleCards) - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide(prev => 
      prev <= 0 ? Math.ceil(filteredIdeas.length / visibleCards) - 1 : prev - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="ideas-section">
      <div className="ideas-container">
        
        {/* Header Section */}
        <div className="ideas-header">
           
          <h2 className="ideas-title">
            Explore Nancee Services
          </h2>
          <p className="ideas-subtitle">
            Discover modern services and essentials tailored for you, your family, and your pets.
          </p>
        </div>

        {/* Category Filter */}
        <div className="category-filter-container">
          <div className="category-filter">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setCurrentSlide(0);
                }}
                className={`category-button ${selectedCategory === category ? 'category-button-active' : ''}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Slider Container */}
        <div className="slider-container">
          
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="slider-nav-button slider-nav-prev"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            <ChevronLeft className="nav-icon" />
          </button>
          
          <button
            onClick={nextSlide}
            className="slider-nav-button slider-nav-next"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            <ChevronRight className="nav-icon" />
          </button>

          {/* Cards Container */}
          <div className="cards-container">
            <div 
              className="cards-wrapper"
              style={{ 
                transform: `translateX(-${currentSlide * (100 / visibleCards)}%)`,
                width: `${Math.ceil(filteredIdeas.length / visibleCards) * 100}%`
              }}
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
            >
              {filteredIdeas.map((idea) => {
                const IconComponent = idea.icon;
                return (
                  <div
                    key={idea.id}
                    className="card-item"
                    style={{ width: `${100 / Math.ceil(filteredIdeas.length / visibleCards) / visibleCards}%` }}
                  >
                    <div className={`idea-card ${idea.bgColor}`}>
                      <div className="card-pattern">
                        <div className="pattern-circle pattern-circle-1"></div>
                        <div className="pattern-circle pattern-circle-2"></div>
                      </div>
                      <div className="card-content">
                        <div className={`card-icon ${idea.color}`}>
                          <IconComponent className="idea-icon" />
                        </div>
                        <div className="category-badge">
                          {idea.category}
                        </div>
                        <h3 className="card-title">{idea.title}</h3>
                        <p className="card-subtitle">{idea.subtitle}</p>
                        <p className="card-description">{idea.description}</p>
                        <div className="card-action">
                          <span>Learn more</span>
                          <ChevronRight className="action-arrow" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="slide-indicators">
          {Array.from({ length: Math.ceil(filteredIdeas.length / visibleCards) }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`indicator ${currentSlide === index ? 'indicator-active' : ''}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default IdeasSection;
